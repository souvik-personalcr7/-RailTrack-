import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import OTP from '@/models/OTP';
import { validateEmail } from '@/lib/validations';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, message: 'Email and 6-digit OTP are required.' },
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
    const cleanOtp = otp.toString().trim();

    await connectToDatabase();

    const otpRecord = await OTP.findOne({
      email: normalizedEmail,
      otp: cleanOtp,
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired 6-digit OTP code.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'OTP code verified successfully.',
    });
  } catch (error) {
    console.error('Verify OTP API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to verify OTP code.' },
      { status: 500 }
    );
  }
}
