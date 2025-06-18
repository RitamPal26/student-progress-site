const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendReminderEmail(to, name) {
  const info = await transporter.sendMail({
    from: `"Prog-Mentor Bot" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Time to solve some Codeforces problems! 💪',
    html: `<p>Hi ${name},</p>
           <p>We noticed you haven't submitted anything on Codeforces in the last week. 
           Jump back in and keep the streak alive!</p>
           <p>Happy coding,<br/>Student Progress System</p>`
  });
  console.log('Reminder email sent:', info.messageId);
}

module.exports = { sendReminderEmail };
