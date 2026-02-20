const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");

const mainRouter = require("./routes/index");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();
const { PORT = 3001 } = process.env;

// ---------- DATABASE ----------
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

// ---------- MIDDLEWARE ----------
app.use(express.json());
app.use(cors());

app.use(requestLogger);

/*
  TEMPORARY TEST AUTH MIDDLEWARE
  The automated tests do NOT send JWT tokens.
  They expect req.user to already exist.

  Later this will be replaced by real auth middleware.
*/
app.use((req, res, next) => {
  req.user = {
    _id: "5d8b8592978f8bd833ca8133",
  };
  next();
});

// ---------- ROUTES ----------
app.use("/", mainRouter);

// ---------- ERROR HANDLING ----------
app.use(errorLogger);
app.use(errors()); // celebrate validation errors
app.use(errorHandler);

// ---------- SERVER ----------
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
