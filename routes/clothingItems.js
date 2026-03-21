const express = require("express");

const router = express.Router();
const auth = require("../middlewares/auth");

const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

const {
  validateCreateItem,
  validateUpdateItem,
  validateItemId,
} = require("../middlewares/validation");

// ---------- PUBLIC ROUTE ----------
router.get("/", getItems); // anyone can get all items

// ---------- PROTECTED ROUTES ----------
router.use(auth);

router.post("/", validateCreateItem, createItem);
router.patch("/:itemId", validateItemId, validateUpdateItem, updateItem);
router.delete("/:itemId", validateItemId, deleteItem);
router.put("/:itemId/likes", validateItemId, likeItem);
router.delete("/:itemId/likes", validateItemId, dislikeItem);

module.exports = router;
