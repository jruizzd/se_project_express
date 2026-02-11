const errorHandler = (err, req, res, next) => {
  // Log the error for debugging
  console.error(err);

  // Check if it's a custom error with a status code
  const statusCode = err.statusCode || 500;
  const message = err.message || "An error occurred on the server";

  // Send the response
  res.status(statusCode).send({ message });
};

module.exports = errorHandler;
