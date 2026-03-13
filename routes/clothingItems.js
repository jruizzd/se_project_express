const express = require("express");
const router = express.Router();

const {
  createItem,
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

// PROTECTED ROUTES ONLY

// Create
router.post("/", validateCreateItem, createItem);

// Update
router.put("/:itemId", validateItemId, validateUpdateItem, updateItem);

// Delete
router.delete("/:itemId", validateItemId, deleteItem);

// Likes
router.put("/:itemId/likes", validateItemId, likeItem);
router.delete("/:itemId/likes", validateItemId, dislikeItem);

module.exports = router;
