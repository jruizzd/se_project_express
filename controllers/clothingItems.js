const ClothingItems = require("../models/clothingItem");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItems.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(201).send({ data: item });
    })
    .catch((e) => {
      if (e.name === "ValidationError") {
        const error = new Error("Invalid data provided");
        error.statusCode = 400;
        return next(error);
      }
      next(e);
    });
};

const getItems = (req, res, next) => {
  ClothingItems.find({})
    .then((items) => {
      res.status(200).send({ data: items });
    })
    .catch(next);
};

const updateItem = (req, res, next) => {
  const { itemId } = req.params;
  const { imageURL } = req.body;

  ClothingItems.findByIdAndUpdate(
    itemId,
    { $set: { imageURL } },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((e) => {
      if (e.name === "CastError") {
        const error = new Error("Invalid item ID");
        error.statusCode = 400;
        return next(error);
      }
      if (e.name === "ValidationError") {
        const error = new Error("Invalid data provided");
        error.statusCode = 400;
        return next(error);
      }
      if (e.name === "DocumentNotFoundError") {
        const error = new Error("Item not found");
        error.statusCode = 404;
        return next(error);
      }
      next(e);
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const currentUserId = req.user._id;

  ClothingItems.findById(itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(currentUserId)) {
        const error = new Error("You cannot delete this item");
        error.statusCode = 403;
        return next(error);
      }

      return ClothingItems.findByIdAndDelete(itemId).then(() =>
        res.status(200).send({ message: "Item deleted successfully" })
      );
    })
    .catch((e) => {
      if (e.name === "CastError") {
        const error = new Error("Invalid item ID");
        error.statusCode = 400;
        return next(error);
      }
      if (e.name === "DocumentNotFoundError") {
        const error = new Error("Item not found");
        error.statusCode = 404;
        return next(error);
      }
      next(e);
    });
};

const likeItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  ClothingItems.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((e) => {
      if (e.name === "CastError") {
        const error = new Error("Invalid item ID");
        error.statusCode = 400;
        return next(error);
      }
      if (e.name === "DocumentNotFoundError") {
        const error = new Error("Item not found");
        error.statusCode = 404;
        return next(error);
      }
      next(e);
    });
};

const dislikeItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  ClothingItems.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((e) => {
      if (e.name === "CastError") {
        const error = new Error("Invalid item ID");
        error.statusCode = 400;
        return next(error);
      }
      if (e.name === "DocumentNotFoundError") {
        const error = new Error("Item not found");
        error.statusCode = 404;
        return next(error);
      }
      next(e);
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
