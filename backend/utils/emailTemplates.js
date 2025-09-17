const { sendEmail } = require('./emailService');

const sendStudentCredentials = async (to, studentName, email, password) => {
  const subject = 'Your Student Account Credentials';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #4CAF50;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          padding: 20px;
          background-color: #f9f9f9;
          border: 1px solid #ddd;
          border-top: none;
          border-radius: 0 0 5px 5px;
        }
        .credentials {
          background-color: #eee;
          padding: 15px;
          border-radius: 5px;
          margin: 15px 0;
        }
        .footer {
          margin-top: 20px;
          font-size: 12px;
          color: #777;
          text-align: center;
        }
        .warning {
          color: #ff0000;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Welcome to Our Learning Platform</h1>
      </div>
      <div class="content">
        <p>Dear ${studentName},</p>
        <p>Your student account has been created successfully. Below are your login credentials:</p>
        
        <div class="credentials">
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Password:</strong> ${password}</p>
        </div>
        
        <p class="warning">Please change your password after your first login for security reasons.</p>
        
        <p>To access your account, visit our portal at: <a href="https://yourlearningplatform.com/login">https://yourlearningplatform.com/login</a></p>
        
        <p>If you have any questions, please contact your teacher or the support team.</p>
        
        <p>Best regards,<br>The Education Team</p>
      </div>
      <div class="footer">
        <p>This is an automated message. Please do not reply to this email.</p>
      </div>
    </body>
    </html>
  `;
  
  const text = `
    Welcome to Our Learning Platform
    
    Dear ${studentName},
    
    Your student account has been created successfully. Below are your login credentials:
    
    Email: ${email}
    Password: ${password}
    
    Please change your password after your first login for security reasons.
    
    To access your account, visit our portal at: https://yourlearningplatform.com/login
    
    If you have any questions, please contact your teacher or the support team.
    
    Best regards,
    The Education Team
    
    This is an automated message. Please do not reply to this email.
  `;
  
  return sendEmail(to, subject, text, html);
};

module.exports = {
  sendStudentCredentials
};