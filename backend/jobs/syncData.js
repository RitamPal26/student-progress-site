// jobs/syncData.js
const cron = require('node-cron');

const syncAllStudents = async () => {
  const students = await Student.find({});
  for (const student of students) {
    await syncStudentData(student.codeforcesHandle);
  }
};

// Default: Run at 2 AM daily
cron.schedule('0 2 * * *', syncAllStudents);
