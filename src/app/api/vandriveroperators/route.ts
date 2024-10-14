import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const vanDriverOperators = await prisma.vanDriverOperator.findMany();
    return NextResponse.json(vanDriverOperators);
  } catch (error: any) {
    console.error('Error retrieving van driver operators:', error);
    return NextResponse.json({ message: 'Failed to retrieve van driver operators', error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
    const { vanDriverOperatorId, scheduleId } = await req.json();
  
    try {
    const newAssignment = await prisma.assignment.create({
      data: {
        van_driver_operator_id: parseInt(vanDriverOperatorId, 10),
        schedule_id: parseInt(scheduleId, 10),
      },
    });
  
      return NextResponse.json(newAssignment, { status: 201 });
    } catch (error: any) {
      console.error('Error creating assignment:', error);
      return NextResponse.json({ message: 'Failed to create assignment', error: error.message }, { status: 500 });
    }
  }