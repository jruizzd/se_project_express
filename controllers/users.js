const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  BAD_REQUEST,
  NOT_FOUND,
  CONFLICT,
  UNAUTHORIZED,
} = require("../utils/errors");

// GET /users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    next(err);
  }
};

// POST /users
const createUser = async (req, res, next) => {
  try {
    const { name, avatar, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    });

    res.status(201).send({
      _id: user._id,
      name: user.name,
      avatar: user.avatar,
      email: user.email,
    });
  } catch (err) {
    if (err.code === 11000) {
      const conflictError = new Error("A user with that email already exists");
      conflictError.statusCode = CONFLICT;
      return next(conflictError);
    }

    if (err.name === "ValidationError") {
      const validationError = new Error("Invalid user data");
      validationError.statusCode = BAD_REQUEST;
      return next(validationError);
    }

    next(err);
  }
};

// GET /users/me
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).orFail();
    res.status(200).send(user);
  } catch (err) {
    if (err.name === "DocumentNotFoundError") {
      const notFoundError = new Error("User not found");
      notFoundError.statusCode = NOT_FOUND;
      return next(notFoundError);
    }

    if (err.name === "CastError") {
      const badRequestError = new Error("Invalid user ID");
      badRequestError.statusCode = BAD_REQUEST;
      return next(badRequestError);
    }

    next(err);
  }
};

// POST /login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const badRequestError = new Error("Email and password are required");
      badRequestError.statusCode = BAD_REQUEST;
      throw badRequestError;
    }

    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.send({ token });
  } catch (err) {
    const authError = new Error("Incorrect email or password");
    authError.statusCode = UNAUTHORIZED;
    next(authError);
  }
};

// PATCH /users/me
const updateUser = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true }
    ).orFail();

    res.status(200).send(user);
  } catch (err) {
    if (err.name === "DocumentNotFoundError") {
      const notFoundError = new Error("User not found");
      notFoundError.statusCode = NOT_FOUND;
      return next(notFoundError);
    }

    if (err.name === "ValidationError") {
      const validationError = new Error("Invalid user data");
      validationError.statusCode = BAD_REQUEST;
      return next(validationError);
    }

    next(err);
  }
};

module.exports = {
  getUsers,
  createUser,
  getCurrentUser,
  updateUser,
  login,
};
