const ClothingItems = require("../models/clothingItem");

/**
 * CREATE ITEM
 */
const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  return ClothingItems.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(
          Object.assign(new Error("Invalid data provided"), { statusCode: 400 })
        );
      }
      return next(err);
    });
};

/**
 * GET ALL ITEMS
 */
const getItems = (req, res, next) =>
  ClothingItems.find({})
    .then((items) => res.status(200).send({ data: items }))
    .catch(next);

/**
 * UPDATE ITEM IMAGE
 */
const updateItem = (req, res, next) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  return ClothingItems.findByIdAndUpdate(
    itemId,
    { $set: { imageUrl } },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(
          Object.assign(new Error("Invalid item ID"), { statusCode: 400 })
        );
      }
      if (err.name === "ValidationError") {
        return next(
          Object.assign(new Error("Invalid data provided"), { statusCode: 400 })
        );
      }
      if (err.name === "DocumentNotFoundError") {
        return next(
          Object.assign(new Error("Item not found"), { statusCode: 404 })
        );
      }
      return next(err);
    });
};

/**
 * DELETE ITEM (OWNER ONLY)
 */
const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const currentUserId = req.user._id;

  return ClothingItems.findById(itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(currentUserId)) {
        return next(
          Object.assign(new Error("Forbidden: not your item"), {
            statusCode: 403,
          })
        );
      }

      return ClothingItems.findByIdAndDelete(itemId).then(() =>
        res.status(200).send({ message: "Item deleted successfully" })
      );
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(
          Object.assign(new Error("Invalid item ID"), { statusCode: 400 })
        );
      }
      if (err.name === "DocumentNotFoundError") {
        return next(
          Object.assign(new Error("Item not found"), { statusCode: 404 })
        );
      }
      return next(err);
    });
};

/**
 * LIKE ITEM
 */
const likeItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  return ClothingItems.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(
          Object.assign(new Error("Invalid item ID"), { statusCode: 400 })
        );
      }
      if (err.name === "DocumentNotFoundError") {
        return next(
          Object.assign(new Error("Item not found"), { statusCode: 404 })
        );
      }
      return next(err);
    });
};

/**
 * DISLIKE ITEM
 */
const dislikeItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  return ClothingItems.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === "CastError") {
        return next(
          Object.assign(new Error("Invalid item ID"), { statusCode: 400 })
        );
      }
      if (err.name === "DocumentNotFoundError") {
        return next(
          Object.assign(new Error("Item not found"), { statusCode: 404 })
        );
      }
      return next(err);
    });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
