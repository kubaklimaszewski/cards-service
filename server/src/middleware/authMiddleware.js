const jwt = require("jsonwebtoken");
const { UnauthorizedError } = require("../utils/errors");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Missing or invalid Authorization header"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: payload.id,
      username: payload.username,
      email: payload.email,
    };

    return next();
  } catch (err) {
    return next(new UnauthorizedError("Invalid or expired token"));
  }
}

module.exports = authMiddleware;
