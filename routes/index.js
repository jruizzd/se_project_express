const router = require("express").Router();
const auth = require("../middlewares/auth");

// Routers
const clothingItems = require("./clothingItems");
const userRouter = require("./users");

// Controllers
const { login, createUser } = require("../controllers/users");
const { getItems } = require("../controllers/clothingItems");

// Validators
const { validateSignin, validateSignup } = require("../middlewares/validation");

// Custom errors
const NotFoundError = require("../errors/NotFoundError");

// ---------- PUBLIC ----------
router.post("/signin", validateSignin, login);
router.post("/signup", validateSignup, createUser);
router.get("/items", getItems); // Public get all items

// ---------- PROTECTED ----------
router.use(auth);
router.use("/users", userRouter);
router.use("/items", clothingItems); // Protected item routes (create, update, delete, like/dislike)

// ---------- 404 ----------
router.use((req, res, next) => {
  // Throw error instead of sending response directly
  next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
