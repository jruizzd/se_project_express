const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const mainRouter = require("./routes/index");
const errorHandler = require("./middlewares/error-handler");
const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());
app.use(cors());

if (process.env.NODE_ENV === "test") {
  console.log("Current NODE_ENV:", process.env.NODE_ENV);
  app.use((req, res, next) => {
    req.user = { _id: "5d8b8592978f8bd833ca8133" };
    next();
  });
}

app.use(requestLogger);
app.use("/", mainRouter);
app.use(errorLogger); // enabling the error logger
app.use(errors()); // celebrate error handler
app.use(errorHandler); // centralized error handler

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
