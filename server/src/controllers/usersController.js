const pool = require("../config/database");
const { UnauthorizedError } = require("../utils/errors");

async function me(req, res, next) {
  try {

    // 1. Get user data
    const result = await pool.query(
      "SELECT username, balance FROM users WHERE id = $1",
      [req.user.id]
    );

    if (result.rows.length === 0) {
      throw new UnauthorizedError("Email not exist");
    }

    const user = result.rows[0];

    // Return data
    return res.status(200).json({
      success: true,
      username: user.username,
      balance: user.balance,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  me,
};
