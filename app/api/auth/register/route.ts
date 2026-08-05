import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { validateEmail, validatePhone, validateStrongPassword } from '@/lib/validations';
import { signToken } from '@/lib/jwt';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, phoneNumber, email, password, confirmPassword } = body;

    if (!fullName || !phoneNumber || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'All fields are required.' },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    if (!validatePhone(phoneNumber)) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid phone number (10-15 digits).' },
        { status: 400 }
      );
    }

    const passwordCheck = validateStrongPassword(password);
    if (!passwordCheck.isValid) {
      return NextResponse.json(
        { success: false, message: passwordCheck.message },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Passwords do not match.' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'An account with this email address already exists.' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'user',
      isVerified: true,
    });

    const token = signToken({
      userId: newUser._id.toString(),
      email: newUser.email,
      role: newUser.role,
    });

    const userResponse = {
      id: newUser._id.toString(),
      fullName: newUser.fullName,
      email: newUser.email,
      phoneNumber: newUser.phoneNumber,
      role: newUser.role,
      isVerified: newUser.isVerified,
    };

    const response = NextResponse.json(
      {
        success: true,
        message: 'Account registered successfully.',
        user: userResponse,
      },
      { status: 201 }
    );

    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Registration API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error during registration. Please try again.' },
      { status: 500 }
    );
  }
}
