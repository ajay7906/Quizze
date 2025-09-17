const nodemailer = require('nodemailer');

// Create transporter (configure with your email service)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log('SMTP server is ready to take our messages');
  }
});

const sendEmail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'noreply@yourlearningplatform.com',
      to,
      subject,
      text,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully to:', to, info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email to:', to, error);
    throw error;
  }
};

module.exports = {
  sendEmail,
  transporter
};