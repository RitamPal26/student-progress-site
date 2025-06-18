// backend/models/student.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true },
  phone: String,
  codeforcesHandle: { type: String, unique: true },
  currentRating: { type: Number, default: 0 },
  maxRating: { type: Number, default: 0 },
  emailRemindersEnabled: { type: Boolean, default: true },
  reminderCount: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
});

/* ➊ Register only if it doesn’t exist already */
module.exports =
  mongoose.models.Student || mongoose.model('Student', studentSchema);   // ← safe[2][4]
