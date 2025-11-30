const clothingItem = require("../models/clothingItem");
const ClothingItems = require("../models/clothingItem");
const { INTERNAL_SERVER_ERROR, BAD_REQUEST } = require("../utils/errors");

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageURL } = req.body;

  ClothingItems.create({ name, weather, imageURL })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((e) => {
      res.status(INTERNAL_SERVER_ERROR).send({ message: e.message, e });
    });
};

const getItems = (req, res) => {
  ClothingItems.find({})
    .then((items) => res.status(200).send(items))
    .catch((e) => {
      res.status(INTERNAL_SERVER_ERROR).send({ message: e.message, e });
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageURL } = req.body;

  ClothingItems.findByIdAndUpdate(itemId, { $set: { imageURL } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((e) => {
      res.status(INTERNAL_SERVER_ERROR).send({ message: e.message, e });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  console.log(itemId);
  ClothingItems.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(204).send({}))
    .catch((e) => {
      res.status(INTERNAL_SERVER_ERROR).send({ message: e.message, e });
    });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
};
