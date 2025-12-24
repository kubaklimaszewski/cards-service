const pool = require("../config/database");
const { UnauthorizedError } = require("../utils/errors");

async function me(req, res, next) {
  try {
    // 1. Get user data
    const result = await pool.query(
      `SELECT u.username, u.balance, COALESCE(SUM(uc.quantity), 0) as cardsNumber 
       FROM users u 
       LEFT JOIN users_cards uc ON u.id = uc.user_id 
       WHERE u.id = $1 
       GROUP BY u.id, u.username, u.balance`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      throw new UnauthorizedError("User not exist");
    }

    const user = result.rows[0];

    // Return data
    return res.status(200).json({
      success: true,
      username: user.username,
      balance: user.balance,
      cards: user.cardsnumber,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  me,
};
