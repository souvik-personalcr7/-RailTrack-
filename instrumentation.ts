export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { connectToDatabase } = await import('@/lib/db');
    try {
      await connectToDatabase();
    } catch (error) {
      console.error('Initial MongoDB connection error:', error);
    }
  }
}
