const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/me", authMiddleware, usersController.me)

module.exports = router;