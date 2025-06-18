// routes/data.js
router.get('/submissions', async (req, res) => {
  const { studentId, after } = req.query;
  const filter = { studentId };
  if (after) filter.submissionTime = { $gte: new Date(after) };

  const docs = await Submission.find(filter).lean();
  res.json(docs);
});
