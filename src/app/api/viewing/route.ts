import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const assignments = await prisma.assignment.findMany({
      include: {
        VanDriverOperator: {
          include: {
            Van: {
              select: {
                plate_number: true,
              },
            },
          },
        },
      },
      orderBy: {
        departureTime: 'asc',
      },
    });
    console.log('Fetched assignments:', assignments); // Debugging log
    return NextResponse.json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error); // Debugging log
    return NextResponse.json({ error: 'Failed to fetch assignments' }, { status: 500 });
  }
}