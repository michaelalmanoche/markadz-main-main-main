import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  try {
    console.log('Received login request for username:', username);

    // Perform the query using Prisma
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      console.log('User not found:', username);
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.log('Password mismatch for username:', username);
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, role_id: user.role_id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    console.log('Login successful for username:', username);
    return NextResponse.json({ token, role_id: user.role_id }, { status: 200 });
  } catch (error: any) {
    console.error('Error during authentication:', error);
    return NextResponse.json({ message: 'Failed to authenticate', error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}