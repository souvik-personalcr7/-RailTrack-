import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import { verifyToken } from '@/lib/jwt';

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, user: null, message: 'Not authenticated.' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      const response = NextResponse.json(
        { success: false, user: null, message: 'Invalid or expired session token.' },
        { status: 401 }
      );
      response.cookies.set({
        name: 'token',
        value: '',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
        expires: new Date(0),
      });
      return response;
    }

    await connectToDatabase();

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      const response = NextResponse.json(
        { success: false, user: null, message: 'User account no longer exists.' },
        { status: 404 }
      );
      response.cookies.set({
        name: 'token',
        value: '',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
        expires: new Date(0),
      });
      return response;
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Me API Error:', error);
    return NextResponse.json(
      { success: false, user: null, message: 'Failed to authenticate user.' },
      { status: 500 }
    );
  }
}
