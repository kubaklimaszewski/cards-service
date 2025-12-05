const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  const isServerError = statusCode >= 500;
  const message = isServerError
    ? "Internal server error"
    : err.message || "Error";

  res.status(statusCode).json({
    success: false,
    error: {
      message,
      statusCode,
    },
  });
};

module.exports = errorHandler;
