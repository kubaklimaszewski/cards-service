const pool = require("../config/database");
const {
  NotFoundError,
  AppError,
  UnauthorizedError,
} = require("../utils/errors");

async function cards(req, res, next) {
  try {
    // 1. Get packs data
    const cardsResult = await pool.query(
      `SELECT
        t1.id,
        t1.name,
        t1.description,
        t1.rarity,
        t1.icon,
        t1.value,
        t2.quantity
      FROM cards t1
      JOIN users_cards t2
        ON t1.id = t2.card_id
      WHERE t2.user_id = $1 AND t2.quantity > 0`,
      [req.user.id]
    );

    if (cardsResult.rows.length === 0) {
      return res.status(200).json({
        success: true,
        data: false,
      });
    }

    // 2. Return data
    return res.status(200).json({
      success: true,
      data: cardsResult.rows,
    });
  } catch (err) {
    next(err);
  }
}

async function sell(req, res, next) {
  try {
    const cardId = Number(req.params.id);
    const userId = req.user.id;

    const authResult = await pool.query(
      "SELECT quantity FROM users_cards WHERE user_id = $1 AND card_id = $2 AND quantity > 0",
      [userId, cardId]
    );

    if (authResult.rows.length === 0) {
      throw new UnauthorizedError("No card for sell");
    }

    const updateQuantityResult = await pool.query(
      "UPDATE users_cards SET quantity = quantity - 1 WHERE user_id = $1 AND card_id = $2 RETURNING quantity",
      [userId, cardId]
    );

    if (updateQuantityResult.rows.length === 0) {
      throw new UnauthorizedError("Card sell error");
    }

    const value = await pool
      .query("SELECT value FROM cards WHERE id = $1", [cardId])
      .then((res) => res.rows[0].value);

    if (!value) {
      throw new UnauthorizedError("No card value");
    }

    const updateBalanceResult = await pool.query(
      "UPDATE users SET balance = balance + $1 WHERE id = $2 RETURNING balance",
      [value, userId]
    );

    if (updateBalanceResult.rows.length === 0) {
      throw new UnauthorizedError("Balance update error");
    }

    const cardsnumber = await pool
      .query(
        "SELECT sum(quantity) as cards FROM users_cards WHERE user_id = $1",
        [userId]
      )
      .then((res) => res.rows[0].cards);

    return res.status(200).json({
      success: true,
      data: {
        newQuantity: updateQuantityResult.rows[0].quantity,
        newBalance: updateBalanceResult.rows[0].balance,
        value: value,
        cards: cardsnumber,
      },
    });
  } catch (err) {
    next(err);
  }
}

async function sellDuplicate(req, res, next) {
  try {
    const cardId = Number(req.params.id);
    const userId = req.user.id;

    const authResult = await pool.query(
      "SELECT quantity FROM users_cards WHERE user_id = $1 AND card_id = $2 AND quantity > 1",
      [userId, cardId]
    );

    if (authResult.rows.length === 0) {
      throw new UnauthorizedError("No card for sell");
    }

    const quantiyToSell = authResult.rows[0].quantity - 1;

    const updateQuantityResult = await pool.query(
      "UPDATE users_cards SET quantity = 1 WHERE user_id = $1 AND card_id = $2 RETURNING quantity",
      [userId, cardId]
    );

    if (updateQuantityResult.rows.length === 0) {
      throw new UnauthorizedError("Card sell error");
    }

    const value = await pool
      .query("SELECT value FROM cards WHERE id = $1", [cardId])
      .then((res) => res.rows[0].value);

    if (!value) {
      throw new UnauthorizedError("No card value");
    }

    const profit = value * quantiyToSell;

    const updateBalanceResult = await pool.query(
      "UPDATE users SET balance = balance + $1 WHERE id = $2 RETURNING balance",
      [profit, userId]
    );

    if (updateBalanceResult.rows.length === 0) {
      throw new UnauthorizedError("Balance update error");
    }

    const cardsnumber = await pool
      .query(
        "SELECT sum(quantity) as cards FROM users_cards WHERE user_id = $1",
        [userId]
      )
      .then((res) => res.rows[0].cards);
      
    return res.status(200).json({
      success: true,
      data: {
        newQuantity: updateQuantityResult.rows[0].quantity,
        newBalance: updateBalanceResult.rows[0].balance,
        profit: profit,
        cards: cardsnumber,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  cards,
  sell,
  sellDuplicate,
};
