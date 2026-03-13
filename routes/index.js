const router = require("express").Router();
const auth = require("../middlewares/auth");

const clothingItems = require("./clothingItems");
const userRouter = require("./users");

const { login, createUser } = require("../controllers/users");
const { getItems } = require("../controllers/clothingItems"); // Add this import
const { NOT_FOUND } = require("../utils/errors");

// ---------- PUBLIC ----------
router.post("/signin", login);
router.post("/signup", createUser);
router.get("/items", getItems); // ← Add this line here!

// ---------- PROTECTED ----------
router.use(auth);
router.use("/users", userRouter);
router.use("/items", clothingItems); // This will handle the protected /items routes

// ---------- 404 ----------
router.use((req, res, next) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

module.exports = router;
