const router = require("express").Router();
const auth = require("../middlewares/auth");

const clothingItems = require("./clothingItems");
const userRouter = require("./users");

const { login, createUser } = require("../controllers/users");
const { NOT_FOUND } = require("../utils/errors");

// ---------- PUBLIC ----------
router.post("/signin", login);
router.post("/signup", createUser);
router.use("/items", clothingItems); // public read

// ---------- PROTECTED ----------
router.use(auth);
router.use("/users", userRouter);

// ---------- 404 ----------
router.use((req, res, next) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

module.exports = router;
