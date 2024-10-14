import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { operator_id, vanDriverAssignments } = await req.json();

  if (!operator_id || !vanDriverAssignments || typeof vanDriverAssignments !== 'object') {
    return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
  }

  try {
    const newAssignments = await Promise.all(
      Object.entries(vanDriverAssignments).map(async ([van_id, driver_id]) => {
        const existingAssignment = await prisma.vanDriverOperator.findFirst({
          where: { van_id: parseInt(van_id), operator_id: parseInt(operator_id) },
        });

        if (existingAssignment) {
          throw new Error(`Van with ID ${van_id} is already assigned to this operator`);
        }

        return prisma.vanDriverOperator.create({
          data: {
            van_id: parseInt(van_id),
            driver_id: driver_id ? parseInt(driver_id) : null,
            operator_id: parseInt(operator_id),
          },
        });
      })
    );

    return NextResponse.json(newAssignments, { status: 201 });
  } catch (error: any) {
    console.error('Error creating assignments:', error.message);
    return NextResponse.json({ message: 'Failed to add assignment', error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { id, driver_id } = await req.json();

  if (!id || driver_id === undefined) {
    return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
  }

  try {
    const updatedAssignment = await prisma.vanDriverOperator.update({
      where: { id: parseInt(id) },
      data: { driver_id: driver_id ? parseInt(driver_id) : null },
    });

    return NextResponse.json(updatedAssignment, { status: 200 });
  } catch (error: any) {
    console.error('Error updating assignment:', error.message);
    return NextResponse.json({ message: 'Failed to update assignment', error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const assignments = await prisma.vanDriverOperator.findMany({
      include: {
        Operator: true, // Ensure this matches the model name in your schema
        Van: true,      // Ensure this matches the model name in your schema
        Driver: true,   // Ensure this matches the model name in your schema
      },
    });
    return NextResponse.json(assignments);
  } catch (error: any) {
    console.error('Error retrieving assignments:', error.message);
    return NextResponse.json({ message: 'Failed to retrieve assignments', error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();

  try {
    const deletedAssignment = await prisma.vanDriverOperator.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Assignment deleted successfully', assignment: deletedAssignment }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting assignment:', error.message);
    return NextResponse.json({ message: 'Failed to delete assignment', error: error.message }, { status: 500 });
  }
}