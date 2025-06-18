const axios   = require('axios');
const Student = require('../models/student');
const Contest = require('../models/contest');
const Submission = require('../models/submission');

const BASE = 'https://codeforces.com/api';

// util: safe GET with basic retry
async function cfGet(url, tries = 3) {
  while (tries--) {
    try {
      const { data } = await axios.get(url);
      if (data.status === 'OK') return data.result;
      throw new Error(data.comment || 'CF error');
    } catch (err) {
      if (!tries) throw err;
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}

/* ---------------- core sync logic ---------------- */

// 1) fetch rating + contest info
async function fetchUserRating(handle) {
  return await cfGet(`${BASE}/user.rating?handle=${handle}`);
}

// 2) fetch all submissions
async function fetchUserSubmissions(handle) {
  return await cfGet(`${BASE}/user.status?handle=${handle}`);
}

// master function that stores everything
async function syncStudentData(student) {
  const { codeforcesHandle } = student;

  // 1. rating + contests
  const ratingArr = await fetchUserRating(codeforcesHandle);
  if (ratingArr.length) {
    const latest   = ratingArr[ratingArr.length - 1];
    student.currentRating = latest.newRating;
    student.maxRating     = Math.max(...ratingArr.map(r => r.newRating));
    student.lastUpdated   = new Date();

    // bulk-upsert contests
    const contestDocs = ratingArr.map(r => ({
      updateOne: {
        filter: { studentId: student._id, contestId: r.contestId },
        update: {
          studentId: student._id,
          contestId: r.contestId,
          contestName: r.contestName,
          rank: r.rank,
          ratingChange: r.newRating - r.oldRating,
          newRating: r.newRating,
          contestDate: new Date(r.ratingUpdateTimeSeconds * 1000),
          problemsSolved: 0            // will fix later from submissions
        },
        upsert: true
      }
    }));
    if (contestDocs.length) await Contest.bulkWrite(contestDocs);
    await student.save();
  }

  // 2. submissions
  const subs = await fetchUserSubmissions(codeforcesHandle);
  if (subs.length) {
    const submissionDocs = subs.map(s => ({
      updateOne: {
        filter: { submissionId: s.id },
        update: {
          studentId      : student._id,
          submissionId   : s.id,
          problemId      : `${s.problem.contestId}-${s.problem.index}`,
          problemName    : s.problem.name,
          problemRating  : s.problem.rating || null,
          verdict        : s.verdict,
          submissionTime : new Date(s.creationTimeSeconds * 1000),
          contestId      : s.contestId
        },
        upsert: true
      }
    }));
    await Submission.bulkWrite(submissionDocs);

    /* optional: set problemsSolved count per contest */
    const solvedByContest = {};
    subs.forEach(s => {
      if (s.verdict === 'OK' && s.contestId)
        solvedByContest[s.contestId] = (solvedByContest[s.contestId] || 0) + 1;
    });
    const bulk = Object.entries(solvedByContest).map(([cid, solved]) => ({
      updateOne: {
        filter: { studentId: student._id, contestId: cid },
        update: { problemsSolved: solved }
      }
    }));
    if (bulk.length) await Contest.bulkWrite(bulk);
  }

  return student;
}

module.exports = { syncStudentData };
