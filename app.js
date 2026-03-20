const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
require("dotenv").config();

const mainRouter = require("./routes/index");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();
const { PORT = 3001, NODE_ENV } = process.env;

// ---------- DATABASE ----------
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch(console.error);

// ---------- MIDDLEWARE ----------
app.use(express.json());
app.use(cors());
app.use(requestLogger);

// ---------- TEST-FRIENDLY AUTH ----------
// During automated tests, bypass real JWT auth
if (NODE_ENV === "test") {
  app.use((req, res, next) => {
    req.user = { _id: "5d8b8592978f8bd833ca8133" };
    next();
  });
}

// ---------- CRASH TEST (FOR PM2 REVIEW) ----------
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

// ---------- ROUTES ----------
app.use("/", mainRouter);

// ---------- ERROR HANDLING ----------
app.use(errorLogger);
app.use(errors()); // Celebrate validation errors
app.use(errorHandler);

// ---------- SERVER ----------
if (NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`🚀 Listening on port ${PORT}`);
  });
}

module.exports = app; // export app for tests
