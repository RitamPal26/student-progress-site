const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  submissionId: { type: Number, required: true, unique: true },
  problemId: { type: String, required: true },
  problemName: { type: String, required: true },
  problemRating: { type: Number },
  verdict: { type: String, required: true },
  submissionTime: { type: Date, required: true },
  contestId: { type: Number }
}, {
  timestamps: true
});

module.exports = mongoose.model('Submission', submissionSchema);
