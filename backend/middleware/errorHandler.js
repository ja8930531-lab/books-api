const errorHandler = (err, req, res, next) => {
  console.error("❌ API Error:", err.message);

  res.status(err.statusCode || 500).json({
    success: false,
    message: "Something went wrong. Please try again later.",
  });
};

module.exports = errorHandler;