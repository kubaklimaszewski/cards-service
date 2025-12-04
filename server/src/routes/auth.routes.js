const express = require("express");
const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../../config");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

/*************
  Logowanie
*************/
router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  email = email.toLowerCase();

  if (email == "" || password == "") {
    return res.json({ success: false, message: "Wypełnij wszystkie pola" });
  }

  const result = await pool.query("SELECT * FROM users where email = $1", [
    email,
  ]);

  if (result.rows.length === 0) {
    return res.json({ success: false, message: "Email nie istnieje" });
  }

  if (!(await bcrypt.compare(password, result.rows[0].password_hash))) {
    return res.json({ success: false, message: "Podano złe hasło" });
  }

  const token = jwt.sign(
    {
      id: result.rows[0].id,
      email: result.rows[0].email,
      username: result.rows[0].username,
      money: result.rows[0].money,
    },
    jwtSecret,
    { expiresIn: "1h" }
  );

  return res.json({ success: true, token });
});

/**************
  Rejestracja
**************/
router.post("/register", async (req, res) => {
  let { username, email, password, confirmPassword } = req.body;
  email = email.toLowerCase();

  if (
    username == "" ||
    email == "" ||
    password == "" ||
    confirmPassword == ""
  ) {
    return res.json({ success: false, message: "Wypełnij wszystkie pola" });
  }

  if (username.length < 3) {
    return res.json({
      success: false,
      message: "Nazwa musi mieć co najmniej 3 znaki",
    });
  }

  const emailPattern = /^[a-z][a-z0-9]*(?:\.[a-z0-9]+)*@[a-z0-9]{2,}\.[a-z]+$/;
  const usernamePattern = /^[a-zA-Z0-9]+$/;
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d\-*\.#]{8,}$/;

  if (!emailPattern.test(email)) {
    return res.json({ success: false, message: "Podano nieprawdiłowy email" });
  }

  if (!usernamePattern.test(username)) {
    return res.json({ success: false, message: "Podano nieprawdiłową nazwę" });
  }

  if (!passwordPattern.test(password)) {
    return res.json({ success: false, message: "Podano nieprawidłowe hasło" });
  }

  const result = await pool.query("SELECT id FROM users WHERE email = $1", [
    email,
  ]);

  if (result.rows.length > 0) {
    return res.json({ success: false, message: "Email już istnieje" });
  }

  if (password != confirmPassword) {
    return res.json({ success: false, message: "Powtórz hasło" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const insertResult = await pool.query(
    "INSERT INTO users (email, username, password_hash, money) VALUES ($1, $2, $3, $4) RETURNING id",
    [email, username, passwordHash, 1000]
  );

  const newUserID = insertResult.rows[0].id;

  return res.json({ success: true, id: newUserID });
});

/*************
    Token
*************/
router.get("/profile", authMiddleware, (req, res) => {
  return res.json({ success: true, user: req.user });
});

module.exports = router;
