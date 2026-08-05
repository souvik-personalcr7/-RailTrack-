import nodemailer from 'nodemailer';

const host = process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com';
const port = parseInt(process.env.EMAIL_SERVER_PORT || '587', 10);
const user = process.env.EMAIL_SERVER_USER || '';
const pass = process.env.EMAIL_SERVER_PASSWORD || '';
const from = process.env.EMAIL_FROM || '"RailTrack Auth" <noreply@railtrack.in>';

export const transporter = nodemailer.createTransport({
  host,
  port,
  secure: port === 465,
  auth: {
    user,
    pass,
  },
});

export async function sendOTPEmail(toEmail: string, otp: string): Promise<boolean> {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0f172a; color: #ffffff; border-radius: 16px;">
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #1e293b;">
        <h2 style="color: #0284c7; margin: 0; font-size: 24px;">RailTrack Security</h2>
        <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">Password Reset Request</p>
      </div>

      <div style="padding: 24px 0; text-align: center;">
        <p style="font-size: 15px; color: #cbd5e1; margin-bottom: 20px;">Use the following 6-digit OTP code to verify and reset your RailTrack account password:</p>
        
        <div style="display: inline-block; background: rgba(2, 132, 199, 0.15); border: 2px dashed #0284c7; border-radius: 12px; padding: 14px 32px; letter-spacing: 8px; font-size: 32px; font-weight: bold; color: #38bdf8;">
          ${otp}
        </div>

        <p style="font-size: 13px; color: #f59e0b; margin-top: 20px;">⏱ This OTP code is valid for <strong>10 minutes</strong>. Do not share this code with anyone.</p>
      </div>

      <div style="text-align: center; border-top: 1px solid #1e293b; padding-top: 16px; font-size: 12px; color: #64748b;">
        <p>If you did not request a password reset, please ignore this email.</p>
        <p>© ${new Date().getFullYear()} RailTrack. All rights reserved.</p>
      </div>
    </div>
  `;

  try {
    if (!user || !pass) {
      console.warn('Nodemailer SMTP credentials missing in .env.local. OTP code:', otp);
      return true; // Pretend success in test/local environments if SMTP unconfigured
    }

    await transporter.sendMail({
      from,
      to: toEmail,
      subject: `${otp} is your RailTrack verification code`,
      html: htmlContent,
    });
    return true;
  } catch (error) {
    console.error('Failed to send OTP email via Nodemailer:', error);
    // Log OTP to console in dev mode so developer is never blocked
    console.log(`[DEVELOPMENT OTP BACKUP] OTP for ${toEmail}: ${otp}`);
    return false;
  }
}
