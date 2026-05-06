const express = require("express");
const mongoose = require("mongoose");
const Movie = require("../models/Movie");

const router = express.Router();

function buildValidationMessage(error) {
  if (!error.errors) {
    return error.message;
  }

  return Object.values(error.errors)
    .map((item) => item.message)
    .join(", ");
}

function normalizePayload(body) {
  const fields = [
    "title",
    "director",
    "genre",
    "releaseYear",
    "rating",
    "duration",
    "language"
  ];

  const payload = {};

  for (const field of fields) {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      payload[field] = body[field];
    }
  }

  ["releaseYear", "rating", "duration"].forEach((field) => {
    if (payload[field] === "" || payload[field] === null) {
      delete payload[field];
      return;
    }

    if (payload[field] !== undefined) {
      payload[field] = Number(payload[field]);
    }
  });

  return payload;
}

function validateObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

router.get("/", async (_req, res, next) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.json(movies);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const movie = await Movie.create(normalizePayload(req.body));
    res.status(201).json(movie);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: buildValidationMessage(error) });
    }

    return res.status(500).json({ message: "Could not create movie" });
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid movie ID" });
    }

    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    return res.json(movie);
  } catch (error) {
    return next(error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid movie ID" });
    }

    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      normalizePayload(req.body),
      {
        new: true,
        runValidators: true
      }
    );

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    return res.json(movie);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: buildValidationMessage(error) });
    }

    return res.status(500).json({ message: "Could not update movie" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid movie ID" });
    }

    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    return res.json({ message: "Movie deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Could not delete movie" });
  }
});

module.exports = router;
