const express = require("express");
const router = express.Router();
const cardsController = require("../controllers/cardsController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, cardsController.cards);
router.post("/:id/sell", authMiddleware, cardsController.sell);

module.exports = router;
