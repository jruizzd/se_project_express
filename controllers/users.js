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
    return res.status(200).send(users);
  } catch (err) {
    return next(err);
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

    return res.status(201).send({
      _id: user._id,
      name: user.name,
      avatar: user.avatar,
      email: user.email,
    });
  } catch (err) {
    if (err.code === 11000) {
      return next(
        Object.assign(new Error("A user with that email already exists"), {
          statusCode: CONFLICT,
        })
      );
    }

    if (err.name === "ValidationError") {
      return next(
        Object.assign(new Error("Invalid user data"), {
          statusCode: BAD_REQUEST,
        })
      );
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
      return next(
        Object.assign(new Error("User not found"), { statusCode: NOT_FOUND })
      );
    }

    if (err.name === "CastError") {
      return next(
        Object.assign(new Error("Invalid user ID"), { statusCode: BAD_REQUEST })
      );
    }

    return next(err);
  }
};

// POST /login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw Object.assign(new Error("Email and password are required"), {
        statusCode: BAD_REQUEST,
      });
    }

    const user = await User.findUserByCredentials(email, password);

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    return res.send({ token });
  } catch (err) {
    return next(
      Object.assign(new Error("Incorrect email or password"), {
        statusCode: UNAUTHORIZED,
      })
    );
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
      return next(
        Object.assign(new Error("User not found"), { statusCode: NOT_FOUND })
      );
    }

    if (err.name === "ValidationError") {
      return next(
        Object.assign(new Error("Invalid user data"), {
          statusCode: BAD_REQUEST,
        })
      );
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
