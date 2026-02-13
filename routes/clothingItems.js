const express = require("express");

const router = express.Router();

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

// Create
router.post("/", validateCreateItem, createItem);

// Read
router.get("/", getItems);

// Update
router.put("/:itemId", validateItemId, validateUpdateItem, updateItem);

// Delete
router.delete("/:itemId", validateItemId, deleteItem);

// Likes
router.put("/:itemId/likes", validateItemId, likeItem);
router.delete("/:itemId/likes", validateItemId, dislikeItem);

module.exports = router;
