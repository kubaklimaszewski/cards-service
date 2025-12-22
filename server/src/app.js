const express = require("express");
const cors = require("cors");
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const shopRouter = require("./routes/shop");
const packsRouter = require("./routes/packs");
const cardsRouter = require("./routes/cards");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/shop", shopRouter);
app.use("/api/packs", packsRouter);
app.use("/api/cards", cardsRouter);

app.get("/api/health", (req, res) => {
  return res.json({ status: "ok" });
});

app.use(errorHandler);

module.exports = app;
