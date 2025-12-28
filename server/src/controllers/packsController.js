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
    return res.status(200).json({
      success: true,
      data: false,
    });
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
    const packId = Number(req.params.id);
    const userId = req.user.id;

    const authResult = await pool.query(
      "SELECT quantity FROM users_packs WHERE user_id = $1 AND pack_id = $2 AND quantity > 0",
      [userId, packId]
    );

    if (authResult.rows.length === 0) {
      throw new UnauthorizedError("No pack for open");
    }

    const openResult = await pool.query(
      "SELECT card_id, drop_weight FROM packs_cards WHERE pack_id = $1",
      [packId]
    );

    if (openResult.rows.length === 0) {
      throw new NotFoundError("Cards not found");
    }

    const updateResult = await pool.query(
      "UPDATE users_packs SET quantity = quantity - 1 WHERE user_id = $1 AND pack_id = $2 RETURNING quantity",
      [userId, packId]
    );

    if (updateResult.rows.length === 0) {
      throw new UnauthorizedError("Pack open error");
    }

    const totalWeight = openResult.rows.reduce(
      (sum, row) => sum + row.drop_weight,
      0
    );  

    const cardsCount = await pool
      .query("SELECT cards_count FROM packs WHERE id = $1", [packId])
      .then((res) => res.rows[0].cards_count || 0);

    let selectedCards = [];
    let random;
    let weight;
    console.log("Liczba kart:", cardsCount);

    for (i = 0; i < cardsCount; i++) {
      weight = 0;
      random = (Math.random() * totalWeight);
      for (const row of openResult.rows) {
        weight += row.drop_weight;
        if (weight >= random) {
          selectedCards.push(row.card_id);
          break;
        }
      }
    }

    console.log("ID kart:", selectedCards);

    const cardsCounts = selectedCards.reduce((temp, cardId) => {
      temp[cardId] = (temp[cardId] || 0) + 1;
      return temp;
    }, {});

    console.log("id kart z liczbą", cardsCounts);

    const ids = Object.keys(cardsCounts).map(Number);
    const quantities = Object.values(cardsCounts);

    const result = await pool.query(
      `
        INSERT INTO users_cards (user_id, card_id, quantity) 
        SELECT $1, unnest($2::int[]), unnest($3::int[])
        ON CONFLICT (user_id, card_id) 
        DO UPDATE SET quantity = users_cards.quantity + EXCLUDED.quantity
        RETURNING *
      `,
      [userId, ids, quantities]
    );

    const idSet = new Set(selectedCards);
    const idArray = Array.from(idSet);

    const cardsInfo = await pool
      .query(
        "SELECT id, name, value, description, rarity, icon FROM cards WHERE id = ANY($1)",
        [idArray]
      )
      .then((res) => res.rows);

    const cards = selectedCards.map((id) =>
      cardsInfo.find((card) => card.id === id)
    );

    console.log("informacje o wylosowanych kartach: ", cards);

    const cardsnumber = await pool.query(
      "SELECT sum(quantity) as cards from users_cards WHERE user_id = $1",
      [userId]
    ).then(res => res.rows[0].cards)

    return res.status(200).json({
      success: true,
      data: {
        cards: cards,
        newQuantity: updateResult.rows[0].quantity,
        cardsNumber: cardsnumber
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  packs,
  open,
};
