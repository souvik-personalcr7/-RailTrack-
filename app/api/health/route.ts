import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';

export async function GET() {
  try {
    await connectToDatabase();
    return NextResponse.json({
      status: 'ok',
      message: 'data base succfully connect',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to connect to database',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
