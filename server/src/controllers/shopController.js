const pool = require("../config/database");
const {
  NotFoundError,
  AppError,
  UnauthorizedError,
} = require("../utils/errors");

async function packs(req, res, next) {
  try {
    // 1. Get packs data
    const result = await pool.query(
      "SELECT id, name, price, description, rarity, icon, cards_count, 1 AS quantity FROM packs"
    );

    if (result.rows.length === 0) {
      throw new NotFoundError("No packs for display");
    }

    // 2. Return data
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

    // 4. Update user balance
    await pool.query("UPDATE users SET balance = $1 WHERE id = $2", [
      newBalance,
      user.id,
    ]);

    // 5. Add pack to user
    await pool.query(
      `INSERT INTO users_packs (user_id, pack_id, quantity)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, pack_id)
      DO UPDATE SET quantity = users_packs.quantity + $3;`,
      [user.id, pack.id, quantity]
    );

    // Response 200
    return res.status(200).json({
      success: true,
      newBalance: newBalance,
    });
  } catch (err) {
    next(err);
  }
}

async function purchaseBP(req, res, next) {
  try {
    const { quantity } = req.body;
    const packId = 1;
    // 1. Get user data
    const userResult = await pool.query(
      "SELECT id, basic_packs, balance FROM users WHERE id = $1 FOR UPDATE",
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
    const newBP = user.basic_packs - quantity;

    if (newBalance < 0) {
      throw new AppError("Not enough money", 403);
    }

    if (newBP < 0) {
      throw new AppError("Not enough packs", 403);
    }

    // 4. Update user
    await pool.query("UPDATE users SET balance = $1, basic_packs = $2 WHERE id = $3", [
      newBalance,
      newBP,
      user.id,
    ]);

    // 5. Add pack to user
    await pool.query(
      `INSERT INTO users_packs (user_id, pack_id, quantity)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, pack_id)
      DO UPDATE SET quantity = users_packs.quantity + $3;`,
      [user.id, pack.id, quantity]
    );

    // Response 200
    return res.status(200).json({
      success: true,
      newBalance: newBalance,
      newBP: newBP,
    });
  } catch (err) {
    next(err);
  }
}

async function claim(req, res, next) {
  try {
    const packId = Number(req.params.id);
    // 1. Get user data
    const userResult = await pool.query(
      "SELECT id, free_pack FROM users WHERE id = $1 FOR UPDATE",
      [req.user.id]
    );

    if (userResult.rows.length === 0) {
      throw new UnauthorizedError("User not exist");
    }

    if (packId === 1) {
      if (!userResult.rows[0].free_pack) {
        throw new UnauthorizedError("Pack alredy claimed");
      }
    }

    const userId = userResult.rows[0].id;

    // 2. Get pack data
    const packResult = await pool.query("SELECT id FROM packs WHERE id = $1", [
      packId,
    ]);

    if (packResult.rows.length === 0) {
      throw new NotFoundError("Pack not exist");
    }

    const pack = packResult.rows[0];

    // 3. Add pack to user
    await pool.query(
      `INSERT INTO users_packs (user_id, pack_id, quantity)
      VALUES ($1, $2, 1)
      ON CONFLICT (user_id, pack_id)
      DO UPDATE SET quantity = users_packs.quantity + 1;`,
      [userId, packId]
    );

    if (packId === 1) {
      await pool.query("UPDATE users SET free_pack = false WHERE id = $1", [
        userId,
      ]);
    }

    // Response 200
    return res.status(200).json({
      success: true,
    });
  } catch (err) {
    console.error(err);
    next(err);
  }
}

module.exports = {
  packs,
  purchase,
  purchaseBP,
  claim,
};
