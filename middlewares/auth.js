const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UNAUTHORIZED } = require("../utils/errors");

function auth(req, res, next) {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(UNAUTHORIZED).json({
        message: "Unauthorized",
      });
    }

    const token = authorization.replace("Bearer ", "");

    const payload = jwt.verify(token, JWT_SECRET);

    // attach user payload to request
    req.user = payload;

    next();
    return null;
  } catch (err) {
    return res.status(UNAUTHORIZED).json({
      message: "Unauthorized",
    });
  }
}

module.exports = auth;
