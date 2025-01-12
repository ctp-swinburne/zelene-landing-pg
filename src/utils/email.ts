// src/utils/email.ts

import nodemailer from 'nodemailer';

interface EmailConfig {
  service: string;  
  auth: {
    user: string;
    pass: string;
  };
}

if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
  throw new Error('SMTP configuration is missing. Please check your environment variables.');
}

const emailConfig: EmailConfig = {
  service: 'gmail',  
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

const transporter = nodemailer.createTransport(emailConfig);

// Verify connection
transporter.verify(function(error, success) {
  if (error) {
    console.log('SMTP connection error:', error instanceof Error ? error.message : String(error));
  } else {
    console.log("SMTP server is ready to send emails");
  }
});

interface SendEmailParams {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export const sendEmail = async ({ to, subject, text, html }: SendEmailParams) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error('SMTP configuration is missing');
    }

    console.log('Attempting to send email to:', to);
    
    const info = await transporter.sendMail({
      from: {
        name: 'Zelene Platform',
        address: process.env.SMTP_FROM || 'zeleneiotplatform@gmail.com'
      },
      to,
      subject,
      text,
      html,
    });

    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Email sending failed:', errorMessage);
    throw new Error(`Failed to send email: ${errorMessage}`);
  }
};

// Enhanced email template with more detailed information
export const generateQueryConfirmationEmail = (
  queryId: string,
  queryType: string,
  userName: string
) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
      <div style="text-align: center; padding: 20px;">
        <h1 style="color: #2c3e50; margin-bottom: 20px;">${queryType} Confirmation</h1>
      </div>
      
      <div style="padding: 20px; background-color: #f8f9fa; border-radius: 5px;">
        <p style="color: #2c3e50;">Dear ${userName},</p>
        <p style="color: #2c3e50;">Thank you for submitting your ${queryType.toLowerCase()}. We have received your submission and our team will review it shortly.</p>
        
        <div style="background-color: #e9ecef; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 0; color: #2c3e50;">Your Query ID: <span style="color: #0bdc84; font-weight: bold;">${queryId}</span></p>
          <p style="margin: 10px 0 0 0; font-size: 14px; color: #6c757d;">Please keep this ID for future reference.</p>
        </div>
        
        <div style="margin: 20px 0;">
          <p style="color: #2c3e50; margin-bottom: 10px;"><strong>What happens next?</strong></p>
          <ul style="color: #2c3e50; margin: 0; padding-left: 20px;">
            <li>Our team will review your submission</li>
            <li>You will receive updates on any progress</li>
            <li>We may contact you if we need additional information</li>
          </ul>
        </div>

        <p style="color: #2c3e50;">You can track the status of your ${queryType.toLowerCase()} using the Query ID above.</p>
      </div>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
        <p style="color: #2c3e50; margin: 0;">Best regards,</p>
        <p style="color: #0bdc84; font-weight: bold; margin: 5px 0;">Zelene Platform Team</p>
      </div>

      <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #6c757d; text-align: center;">
        <p>This is an automated message, please do not reply to this email.</p>
        <p>For any questions, please contact our support team.</p>
      </div>
    </div>
  `;

  const text = `
    ${queryType} Confirmation
    
    Dear ${userName},

    Thank you for submitting your ${queryType.toLowerCase()}. We have received your submission and our team will review it shortly.

    Your Query ID: ${queryId}
    Please keep this ID for future reference.

    What happens next?
    - Our team will review your submission
    - You will receive updates on any progress
    - We may contact you if we need additional information

    You can track the status of your ${queryType.toLowerCase()} using the Query ID above.

    Best regards,
    Zelene Platform Team

    Note: This is an automated message, please do not reply to this email.
    For any questions, please contact our support team.
  `;

  return { html, text };
};