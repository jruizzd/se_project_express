const { celebrate, Joi, Segments } = require("celebrate");
const validator = require("validator");

/* -------------------- HELPERS -------------------- */

// Safe URL validator (prevents server crash)
const urlValidator = (value, helpers) => {
  if (!validator.isURL(value, { require_protocol: true })) {
    return helpers.message("Invalid URL format");
  }
  return value;
};

// MongoDB ObjectId validation
const objectIdValidator = (value, helpers) => {
  if (!validator.isMongoId(value)) {
    return helpers.message("Invalid item id");
  }
  return value;
};

/* -------------------- CLOTHING ITEMS -------------------- */

// Create clothing item
const validateCreateItem = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 2 characters",
      "string.max": "Name must be under 30 characters",
    }),

    weather: Joi.string().required().valid("hot", "warm", "cold").messages({
      "any.only": "Weather must be hot, warm, or cold",
    }),

    imageUrl: Joi.string().required().custom(urlValidator),
  }),
});

// Delete item / Like / Unlike
const validateItemId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    itemId: Joi.string().required().custom(objectIdValidator),
  }),
});

/* -------------------- USERS -------------------- */

// Update profile
const validateUpdateProfile = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(urlValidator),
  }),
});

/* -------------------- EXPORTS -------------------- */

module.exports = {
  validateCreateItem,
  validateItemId,
  validateUpdateProfile,
};
