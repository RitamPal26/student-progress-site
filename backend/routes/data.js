const express   = require('express');
const Contest   = require('../models/contest');
const Submission= require('../models/submission');
const router    = express.Router();

/* GET /api/data/contests?studentId=…&range=90 */
router.get('/contests', async (req,res)=>{
  const { studentId, range = 365 } = req.query;
  const from  = new Date(Date.now() - range*24*60*60*1000);
  const data = await Contest
    .find({ studentId, contestDate:{ $gte: from } })
    .sort('contestDate')
    .lean();
  res.json(data);
});

/* GET /api/data/submissions?studentId=…&after=2025-05-01 */
router.get('/submissions', async (req,res)=>{
  const { studentId, after } = req.query;
  const filter = { studentId };
  if (after) filter.submissionTime = { $gte: new Date(after) };
  const subs = await Submission.find(filter).lean();
  res.json(subs);
});

/* GET /api/data/summary/problems?studentId=…&range=30 */
router.get('/summary/problems', async (req,res)=>{
  const { studentId, range = 30 } = req.query;
  const from = new Date(Date.now() - range*24*60*60*1000);

  const pipeline = [
    { $match:{ studentId: mongoose.Types.ObjectId(studentId),
               verdict:'OK',
               submissionTime:{ $gte: from } } },
    { $group:{
        _id:null,
        totalSolved:{ $sum:1 },
        avgRating:{ $avg:'$problemRating' },
        maxRating:{ $max:'$problemRating' },
      }}
  ];
  const [stats = { totalSolved:0, avgRating:0, maxRating:0 }] =
      await Submission.aggregate(pipeline);
  res.json(stats);
});

module.exports = router;
