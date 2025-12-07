const express = require("express");
const router = express.Router();
const packsController = require("../controllers/packsController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, packsController.packs);
router.post("/:id/open", authMiddleware, packsController.open);

module.exports = router;
