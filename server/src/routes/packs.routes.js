const express = require("express");
const pool = require("../db");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.post("/load", async (req, res) => {
  const result = await pool.query("SELECT * FROM packs;");
  if (result.rows.length === 0) {
    return res.json({
      success: false,
      message: "Nie udało się załadować paczek",
    });
  }
  return res.json({
    success: true,
    packs: result.rows,
  });
});

router.post("/buy", authMiddleware, async (req, res) => {
  const packId = parseInt(req.body.packId);
  const userId = req.user.id;
  if (!Number.isInteger(packId) || packId <= 0) {
    return res.status(400).json({
      success: false, 
      message: "Nieprawidłowe ID paczki",
    });
  }

  const userResult = await pool.query("SELECT money FROM users WHERE id = $1", [
    parseInt(userId),
  ]);

  const packResult = await pool.query("SELECT price FROM packs WHERE id = $1", [
    parseInt(packId),
  ]);

  if (userResult.rows.length === 0 || packResult.rows.length === 0) {
    return res.status(404).json({
      success: false,
      message: "User lub pack nie znaleziony",
    });
  }

  const userMoney = userResult.rows[0]["money"];
  const packPrice = packResult.rows[0]["price"];

  if (userMoney < packPrice) {
    return res.status(400).json({
      success: false,
      message: "Masz za mało pieniędzy",
    });
  }

  await pool.query(
    `INSERT INTO users_packs (user_id, pack_id, quantity)
     VALUES ($1, $2, 1)
     ON CONFLICT (user_id, pack_id)
     DO UPDATE SET quantity = users_packs.quantity + 1`,
    [parseInt(userId), parseInt(packId)]
  );

  await pool.query("UPDATE users SET money = money - $1 WHERE id = $2", [
    packPrice,
    parseInt(userId),
  ]);

  return res.json({
    success: true,
    newMoney: userMoney - packPrice,
    message: "Zakupiono paczkę",
  });
});

module.exports = router;
