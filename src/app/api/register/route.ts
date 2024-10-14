import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { username, password, role_id, terminal_id } = await req.json();

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Convert role_id and terminal_id to integers
    const roleId = parseInt(role_id, 10);
    const terminalId = parseInt(terminal_id, 10);

    // Insert user into the database
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role_id: roleId,
        terminal_id: terminalId,
      },
    });

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error: any) {
    console.error('Error during registration:', error);
    return NextResponse.json({ message: 'Failed to register user', error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // Fetch all users from the database
    const users = await prisma.user.findMany({
      where: { archived: false },
      select: { id: true, username: true, role_id: true },
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ message: 'Failed to fetch users', error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { archived: true },
    });

    if (user) {
      return NextResponse.json({ message: 'User archived successfully' });
    } else {
      return NextResponse.json({ message: 'User not found or already archived' }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ message: 'Failed to archive user', error: error.message }, { status: 500 });
  }
}