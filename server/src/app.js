const express = require("express");
const cors = require("cors");
const authRouter = require("./routes/auth");
const errorHandler = require("./middleware/errorHandler");


const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());

app.use("/api/auth", authRouter);

app.get("/api/health", (req, res) => {
  return res.json({ status: "ok" });
});

app.use(errorHandler);

module.exports = app;
