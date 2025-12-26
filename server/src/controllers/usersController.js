const pool = require("../config/database");
const { UnauthorizedError } = require("../utils/errors");

async function me(req, res, next) {
  try {
    // 1. Get user data
    const result = await pool.query(
      `SELECT u.username, u.balance, u.last_login, u.basic_packs, u.free_pack, COALESCE(SUM(uc.quantity), 0) as cardsNumber 
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

    const lastLogin = new Date(user.last_login);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (lastLogin < today) {
      const updateResult = await pool.query(
        "UPDATE users SET last_login = CURRENT_DATE, free_pack = true, basic_packs = 5 WHERE id = $1",
        [req.user.id]
      );
      user.free_pack = true;
      user.basic_packs = 5;
    }

    // Return data
    return res.status(200).json({
      success: true,
      username: user.username,
      balance: user.balance,
      cards: user.cardsnumber,
      isClaimed: !user.free_pack,
      bpQuantity: user.basic_packs,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  me,
};
