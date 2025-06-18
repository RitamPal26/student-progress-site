const router = require("express").Router(); // Express router[2]
const mongoose = require("mongoose"); // ODM validation[3]
const Submission = require("../models/submission"); // AC-only data[4]

/*  GET  /api/summary/problems?studentId=<id>&range=<days>            */
/*  Returns totals, averages and hardest-problem info                */
router.get("/problems", async (req, res) => {
  try {
    const { studentId, range = 30 } = req.query; // Query params[5]
    if (!mongoose.Types.ObjectId.isValid(studentId))
      // Guard invalid ids[6]
      return res.status(400).json({ message: "Invalid studentId" });

    const from = new Date(Date.now() - range * 24 * 60 * 60 * 1000); // Time window[7]
    const sid = new mongoose.Types.ObjectId(studentId); // Cast once[8]

    const pipe = [
      {
        $match: {
          studentId: sid,
          verdict: "OK",
          submissionTime: { $gte: from },
        },
      }, // Filter[9]
      {
        $group: {
          _id: null,
          totalSolved: { $sum: 1 },
          avgRating: { $avg: "$problemRating" },
          maxRating: { $max: "$problemRating" },
        },
      }, // Aggregates[10]
      {
        $lookup: {
          // Hardest problem[11]
          from: "submissions",
          let: { sId: sid, max: "$maxRating" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$studentId", "$$sId"] },
                    { $eq: ["$problemRating", "$$max"] },
                    { $eq: ["$verdict", "OK"] },
                  ],
                },
              },
            },
            { $limit: 1 },
            {
              $project: {
                _id: 0,
                problemId: 1,
                problemName: 1,
                problemRating: 1,
              },
            },
          ],
          as: "top",
        },
      },
      { $unwind: { path: "$top", preserveNullAndEmptyArrays: true } }, // Flatten[12]
      {
        $project: {
          _id: 0,
          totalSolved: 1,
          avgRating: { $ifNull: ["$avgRating", 0] },
          maxRating: { $ifNull: ["$maxRating", 0] },
          top: "$top",
        },
      }, // Final shape[13]
    ];

    const [doc] = await Submission.aggregate(pipe); // Execute[14]
    res.json(doc || { totalSolved: 0, avgRating: 0, maxRating: 0, top: null }); // Fallback[15]
  } catch (e) {
    res.status(500).json({ message: e.message }); // Error path[16]
  }
});

module.exports = router; // Export[17]
