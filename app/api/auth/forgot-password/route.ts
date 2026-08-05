import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import OTP from '@/models/OTP';
import { validateEmail } from '@/lib/validations';
import { sendOTPEmail } from '@/lib/email';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email address is required.' },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    await connectToDatabase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'No account found with this email address.' },
        { status: 404 }
      );
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete existing OTPs for this email
    await OTP.deleteMany({ email: normalizedEmail });

    // Save new OTP
    await OTP.create({
      email: normalizedEmail,
      otp: otpCode,
      expiresAt,
    });

    // Send Email
    await sendOTPEmail(normalizedEmail, otpCode);

    return NextResponse.json({
      success: true,
      message: 'A 6-digit OTP has been sent to your email address.',
    });
  } catch (error) {
    console.error('Forgot Password API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process forgot password request.' },
      { status: 500 }
    );
  }
}
