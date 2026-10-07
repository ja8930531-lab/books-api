const Book = require("../models/Book");

const getBooks = async (req, res, next) => {
  try {
    const books = await Book.find();

    res.json({
      success: true,
      books,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBooks,
};