const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/database");
const {
  ValidationError,
  AppError,
  UnauthorizedError,
} = require("../utils/errors");
const { checkLimit } = require("../middleware/rateLimiter");

const SALT_ROUNDS = 10;
const REGISTER_WINDOW_MS = 60 * 60 * 1000; // 1h
const REGISTER_MAX_ATTEMPTS = 3;

async function register(req, res, next) {
  try {
    //1. Register Limit
    const identifier = `register:${req.ip}`;
    const { allowed, retryAfterSec } = checkLimit(
      identifier,
      REGISTER_WINDOW_MS,
      REGISTER_MAX_ATTEMPTS
    );

    if (!allowed) {
      return res.status(429).json({
        success: false,
        error: {
          message: `Too many registrations from this IP. Try again in ${retryAfterSec}s.`,
          statusCode: 429,
        },
      });
    }

    //2. Validation
    const { username, email, password, passwordConfirm } = req.body;

    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();
    const normalizedUsername = String(username || "").trim();

    if (!normalizedEmail) {
      throw new ValidationError("Email is required");
    }
    const emailRegex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+$/;
    if (!emailRegex.test(normalizedEmail) || normalizedEmail.length > 254) {
      throw new ValidationError("Invalid email format");
    }

    if (!normalizedUsername) {
      throw new ValidationError("Username is required");
    }
    const usernameRegex = /^[A-Za-z0-9]{3,}$/;
    if (
      !usernameRegex.test(normalizedUsername) ||
      normalizedUsername.length > 32
    ) {
      throw new ValidationError(
        "Username must be at least 3 chars (letters/digits only, max 32 chars)"
      );
    }

    if (!password || !passwordConfirm) {
      throw new ValidationError("Password and passwordConfirm are required");
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password) || password.length > 128) {
      throw new ValidationError(
        "Password must be at least 8 chars and include lowercase, uppercase and a digit (max 128 chars)"
      );
    }
    if (password !== passwordConfirm) {
      throw new ValidationError("Passwords do not match");
    }

    // 3. Email is in use?
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [
      normalizedEmail,
    ]);

    if (existing.rows.length > 0) {
      throw new AppError("Email is already in use", 409);
    }

    // 4. Password hash
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // 5. Insert do DB (RETURNING id, username, email)
    const result = await pool.query(
      `INSERT INTO users (username, email, password_hash) 
        VALUES ($1, $2, $3) 
        RETURNING id, username, email`,
      [normalizedUsername, normalizedEmail, passwordHash]
    );

    const user = result.rows[0];

    // 6. Odpowiedź 201
    return res.status(201).json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
}

const LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 min
const LOGIN_MAX_ATTEMPTS = 5;

async function login(req, res, next) {
  try {
    const rawEmail = String(req.body.email || "");
    const password = String(req.body.password || "");

    const email = rawEmail.trim().toLowerCase();

    // 1. Simple validation
    if (!email || !password) {
      throw new ValidationError("Email and password are required");
    }

    // 2. RATE LIMIT (IP + email)
    const identifier = `login:${req.ip}:${email}`;

    const { allowed, retryAfterSec } = checkLimit(
      identifier,
      LOGIN_WINDOW_MS,
      LOGIN_MAX_ATTEMPTS
    );

    if (!allowed) {
      return res.status(429).json({
        success: false,
        error: {
          message: `Too many login attempts. Try again in ${retryAfterSec}s.`,
          statusCode: 429,
        },
      });
    }

    // 3. Get user
    const result = await pool.query(
      "SELECT id, username, email, password_hash FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const user = result.rows[0];

    // 4. Password check
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      throw new UnauthorizedError("Invalid credentials");
    }

    // 5. Create token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    // 6. Return data
    return res.status(200).json({
      success: true,
      data: {
        token: token,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
};
