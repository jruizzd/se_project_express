const { celebrate, Joi, Segments } = require("celebrate");
const validator = require("validator");

/* -------------------- HELPERS -------------------- */

// Strict URL validator
const validateURL = (value, helpers) => {
  if (
    validator.isURL(value, {
      protocols: ["http", "https"],
      require_protocol: true,
      require_host: true,
      require_tld: true,
    })
  ) {
    return value;
  }
  return helpers.error("string.uri");
};

// MongoDB ObjectId validator
const validateObjectId = (value, helpers) => {
  if (validator.isMongoId(value)) {
    return value;
  }
  return helpers.error("any.invalid");
};

/* -------------------- CLOTHING ITEMS -------------------- */

const validateCreateItem = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    weather: Joi.string().required().valid("hot", "warm", "cold"),
    imageUrl: Joi.string().required().custom(validateURL),
  }),
});

const validateUpdateItem = celebrate({
  [Segments.BODY]: Joi.object()
    .keys({
      name: Joi.string().min(2).max(30),
      weather: Joi.string().valid("hot", "warm", "cold"),
      imageUrl: Joi.string().custom(validateURL),
    })
    .min(1),
});

const validateItemId = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    itemId: Joi.string().required().custom(validateObjectId),
  }),
});

/* -------------------- USERS -------------------- */

const validateUpdateProfile = celebrate({
  [Segments.BODY]: Joi.object()
    .keys({
      name: Joi.string().min(2).max(30),
      avatar: Joi.string().custom(validateURL),
    })
    .min(1),
});

module.exports = {
  validateCreateItem,
  validateUpdateItem,
  validateItemId,
  validateUpdateProfile,
};
