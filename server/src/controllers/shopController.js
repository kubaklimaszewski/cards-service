const pool = require("../config/database");
const { NotFoundError, AppError, UnauthorizedError } = require("../utils/errors");

async function packs(req, res, next) {
  try {
    const result = await pool.query(
      "SELECT id, name, price, description, rarity, icon FROM packs"
    );

    if (result.rows.length === 0) {
      throw new NotFoundError("No packs for display");
    }

    return res.status(200).json({
      success: true,
      packs: result.rows,
    });
  } catch (err) {
    next(err);
  }
}

async function purchase(req, res, next) {
  try {
    const { quantity } = req.body;
    const packId = Number(req.params.id);
    // 1. Get user data
    const userResult = await pool.query(
      "SELECT id, balance FROM users WHERE id = $1 FOR UPDATE",
      [req.user.id]
    );

    if (userResult.rows.length === 0) {
      throw new UnauthorizedError("User not exist");
    }

    const user = userResult.rows[0];

    // 2. Get pack data
    const packResult = await pool.query(
      "SELECT id, price FROM packs WHERE id = $1",
      [packId]
    );

    if (packResult.rows.length === 0) {
      throw new NotFoundError("Pack not exist");
    }

    const pack = packResult.rows[0];

    // 3. Compare user balance with packs price
    const newBalance = user.balance - quantity * pack.price;

    if (newBalance < 0) {
      throw new AppError("Not enough money", 403);
    }

    await pool.query(
      "UPDATE users SET balance = $1 WHERE id = $2",
      [newBalance, user.id]
    );

    await pool.query(
      `INSERT INTO users_packs (user_id, pack_id, quantity)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, pack_id)
      DO UPDATE SET quantity = users_packs.quantity + $3;`,
      [user.id, pack.id, quantity]
    );

    return res.status(200).json({
      success: true,
      newBalance: newBalance,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  packs,
  purchase,
};
