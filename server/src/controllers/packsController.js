const pool = require("../config/database");
const {
  NotFoundError,
  AppError,
  UnauthorizedError,
} = require("../utils/errors");

async function packs(req, res, next) {
  try {
    // 1. Get packs data
    const packsResult = await pool.query(
      `SELECT
        t1.id,
        t1.name,
        t1.description,
        t1.rarity,
        t1.icon,
        t1.cards_count,
        t2.quantity
      FROM packs t1
      JOIN users_packs t2
        ON t1.id = t2.pack_id
      WHERE t2.user_id = $1 AND t2.quantity > 0`,
      [req.user.id]
    );

    if (packsResult.rows.length === 0) {
      throw new NotFoundError("No packs for display");
    }

    // 2. Return data
    return res.status(200).json({
      success: true,
      data: packsResult.rows,
    });
  } catch (err) {
    next(err);
  }
}

async function open(req, res, next) {
  try {
    return res.status(200).json({
      success: true,
      data: { newQuantity: 2 },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  packs,
  open,
};
