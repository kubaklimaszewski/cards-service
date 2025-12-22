const express = require("express");
const router = express.Router();
const shopController = require("../controllers/shopController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/packs", shopController.packs);
router.post('/packs/:id/purchase', authMiddleware, shopController.purchase);

module.exports = router;