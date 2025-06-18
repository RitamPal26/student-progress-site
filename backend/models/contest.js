const mongoose = require("mongoose");

const contestSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    contestId: { type: Number, required: true },
    contestName: String,
    rank: Number,
    ratingChange: Number,
    newRating: Number,
    problemsSolved: { type: Number, default: 0 },
    contestDate: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Contest || mongoose.model("Contest", contestSchema); // ✅ prevents overwrite
