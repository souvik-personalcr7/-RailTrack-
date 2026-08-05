import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import OTP from '@/models/OTP';
import { validateEmail, validateStrongPassword } from '@/lib/validations';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, otp, newPassword, confirmPassword } = body;

    if (!email || !otp || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'All fields are required.' },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const passwordCheck = validateStrongPassword(newPassword);
    if (!passwordCheck.isValid) {
      return NextResponse.json(
        { success: false, message: passwordCheck.message },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Passwords do not match.' },
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
        { success: false, message: 'Invalid or expired OTP code.' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User account not found.' },
        { status: 404 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Delete OTP after successful reset
    await OTP.deleteMany({ email: normalizedEmail });

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully. You can now log in with your new password.',
    });
  } catch (error) {
    console.error('Reset Password API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to reset password. Please try again.' },
      { status: 500 }
    );
  }
}
