const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");
const ConflictError = require("../errors/ConflictError");
const UnauthorizedError = require("../errors/UnauthorizedError");

// GET /users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.status(200).send(users);
  } catch (err) {
    return next(err);
  }
};

// POST /users (signup)
const createUser = async (req, res, next) => {
  try {
    const { name, avatar, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ConflictError("A user with that email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    });

    return res.status(201).send({
      _id: user._id,
      name: user.name,
      avatar: user.avatar,
      email: user.email,
    });
  } catch (err) {
    // Handle duplicate key error (race condition)
    if (err.code === 11000) {
      return next(new ConflictError("A user with that email already exists"));
    }

    if (err.name === "ValidationError") {
      return next(new BadRequestError("Invalid user data"));
    }

    return next(err);
  }
};

// GET /users/me
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).orFail();
    return res.status(200).send(user);
  } catch (err) {
    if (err.name === "DocumentNotFoundError") {
      return next(new NotFoundError("User not found"));
    }

    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid user ID"));
    }

    return next(err);
  }
};

// POST /signin (login)
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // With celebrate validation, email and password are guaranteed to exist

    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.send({ token });
  } catch (err) {
    return next(new UnauthorizedError("Incorrect email or password"));
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

    return res.status(200).send(user);
  } catch (err) {
    if (err.name === "DocumentNotFoundError") {
      return next(new NotFoundError("User not found"));
    }

    if (err.name === "ValidationError") {
      return next(new BadRequestError("Invalid user data"));
    }

    return next(err);
  }
};

module.exports = {
  getUsers,
  createUser,
  getCurrentUser,
  updateUser,
  login,
};
