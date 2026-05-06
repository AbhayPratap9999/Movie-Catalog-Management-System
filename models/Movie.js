const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true
  },
  director: {
    type: String,
    required: [true, "Director is required"],
    trim: true
  },
  genre: {
    type: String,
    trim: true,
    default: ""
  },
  releaseYear: {
    type: Number,
    min: [1888, "Release year must be 1888 or later"]
  },
  rating: {
    type: Number,
    min: [0, "Rating cannot be less than 0"],
    max: [10, "Rating cannot be more than 10"]
  },
  duration: {
    type: Number,
    min: [1, "Duration must be at least 1 minute"]
  },
  language: {
    type: String,
    trim: true,
    default: "English"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Movie", movieSchema);
