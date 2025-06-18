const cron    = require('node-cron');
const Student = require('../models/student');
const { syncStudentData } = require('../services/codeforcesService');
const { sendReminderEmail } = require('../services/emailService');

// run at 2 AM server time
cron.schedule('0 2 * * *', async () => { 
  console.log('[cron] nightly sync started');
  const students = await Student.find();
  for (const s of students) {
    await syncStudentData(s);
    /* inactivity detection */
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const lastSub = await Submission
      .findOne({ studentId: s._id })
      .sort({ submissionTime: -1 })
      .select('submissionTime')
      .lean();

    if (s.emailRemindersEnabled &&
        (!lastSub || lastSub.submissionTime < sevenDaysAgo)) {
      await sendReminderEmail(s.email, s.name);
      s.reminderCount += 1;
      await s.save();
    }
  }
  console.log('[cron] nightly sync done');
});
