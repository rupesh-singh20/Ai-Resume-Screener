const nodemailer = require('nodemailer');

const createTransporter = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) {
    return null;
  }

  // Generic transporter setup
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass }
  });
};

const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.log('\n========================================================================');
    console.log(`📧 SIMULATED EMAIL DISPATCH`);
    console.log(`TO:      ${to}`);
    console.log(`SUBJECT: ${subject}`);
    console.log('------------------------------------------------------------------------');
    console.log(text || 'HTML Content (logged to console)');
    console.log('========================================================================\n');
    return { simulated: true, success: true };
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return { success: false, error: error.message };
  }
};

const sendInterviewScheduleEmail = async (candidateEmail, candidateName, jobTitle, companyName, date, time, meetingLink) => {
  const subject = `Interview Invitation: ${jobTitle} at ${companyName}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
      <h2 style="color: #4f46e5; margin-bottom: 20px;">Interview Schedule Invitation</h2>
      <p>Hello <strong>${candidateName}</strong>,</p>
      <p>Congratulations! You have been shortlisted for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>.</p>
      <p>We would like to invite you for an interview. Here are the scheduled details:</p>
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; width: 100px;">Date:</td>
          <td style="padding: 8px 0;">${date}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Time:</td>
          <td style="padding: 8px 0;">${time}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold;">Meeting Link:</td>
          <td style="padding: 8px 0;"><a href="${meetingLink}" style="color: #4f46e5; text-decoration: underline;">Join Interview Room</a></td>
        </tr>
      </table>
      <p>Please log into your dashboard if you wish to run an AI Mock Interview simulation ahead of time to practice your answers.</p>
      <p>If you have any questions or need to reschedule, please reply directly to this email.</p>
      <br>
      <p>Best Regards,</p>
      <p><strong>Recruitment Team</strong><br>${companyName}</p>
    </div>
  `;

  const text = `
Hello ${candidateName},

Congratulations! You have been shortlisted for the ${jobTitle} position at ${companyName}.
We would like to invite you for an interview. Here are the details:

Date: ${date}
Time: ${time}
Meeting Link: ${meetingLink}

Please log into your dashboard to run an AI Mock Interview simulation ahead of time to prepare.

Best Regards,
Recruitment Team
${companyName}
  `;

  return await sendEmail({ to: candidateEmail, subject, html, text });
};

const sendShortlistEmail = async (candidateEmail, candidateName, jobTitle, companyName) => {
  const subject = `Application Status Update: ${jobTitle} at ${companyName}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
      <h2 style="color: #10b981; margin-bottom: 20px;">Application Shortlisted</h2>
      <p>Hello <strong>${candidateName}</strong>,</p>
      <p>We are pleased to inform you that your resume has been shortlisted for the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong>.</p>
      <p>Our recruitment team will review your profile details and reach out shortly to schedule the next rounds of interview.</p>
      <p>Thank you for your interest in joining our team!</p>
      <br>
      <p>Best Regards,</p>
      <p><strong>Recruitment Team</strong><br>${companyName}</p>
    </div>
  `;

  const text = `
Hello ${candidateName},

We are pleased to inform you that your resume has been shortlisted for the position of ${jobTitle} at ${companyName}.
Our recruitment team will review your profile details and reach out shortly to schedule the next rounds of interview.

Best Regards,
Recruitment Team
${companyName}
  `;

  return await sendEmail({ to: candidateEmail, subject, html, text });
};

const sendRegistrationEmail = async (userEmail, userName, role) => {
  const subject = `Welcome to AI Resume Screener, ${userName}!`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
      <h2 style="color: #4f46e5; margin-bottom: 20px;">Welcome to Our Platform!</h2>
      <p>Hello <strong>${userName}</strong>,</p>
      <p>Thank you for registering on our AI Resume Screening Platform. We are thrilled to have you join us as a <strong>${role}</strong>!</p>
      ${
        role === 'Recruiter'
          ? `<p>You can now start posting job openings, screening incoming resumes using our AI tools, and inviting candidates to mock interviews.</p>`
          : `<p>You can now upload your resume, get detailed AI feedback, improve your match rate, and practice with our AI Mock Interview tool.</p>`
      }
      <p>Get started by logging into your dashboard today!</p>
      <br>
      <p>Best Regards,</p>
      <p><strong>The AI Resume Screening Team</strong></p>
    </div>
  `;

  const text = `
Hello ${userName},

Thank you for registering on our AI Resume Screening Platform. We are thrilled to have you join us as a ${role}!

Get started by logging into your dashboard today!

Best Regards,
The AI Resume Screening Team
  `;

  return await sendEmail({ to: userEmail, subject, html, text });
};

const sendLoginEmail = async (userEmail, userName) => {
  const subject = `New Login Detected: AI Resume Screener`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 8px;">
      <h2 style="color: #4f46e5; margin-bottom: 20px;">Successful Login Notification</h2>
      <p>Hello <strong>${userName}</strong>,</p>
      <p>This is a quick security alert to let you know that you have successfully logged in to your account on the AI Resume Screening Platform.</p>
      <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
      <p>If this was not you, please change your password immediately to protect your account.</p>
      <br>
      <p>Best Regards,</p>
      <p><strong>The AI Resume Screening Team</strong></p>
    </div>
  `;

  const text = `
Hello ${userName},

This is a quick security alert to let you know that you have successfully logged in to your account on the AI Resume Screening Platform.

Timestamp: ${new Date().toLocaleString()}

If this was not you, please change your password immediately to protect your account.

Best Regards,
The AI Resume Screening Team
  `;

  return await sendEmail({ to: userEmail, subject, html, text });
};

module.exports = {
  sendEmail,
  sendInterviewScheduleEmail,
  sendShortlistEmail,
  sendRegistrationEmail,
  sendLoginEmail
};
