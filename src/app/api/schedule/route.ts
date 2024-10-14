import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    const { date, startTime, endTime } = await request.json();

    if (!date || !startTime || !endTime) {
        return NextResponse.json({ error: 'Date, start time, and end time are required' }, { status: 400 });
    }

    const scheduleDate = new Date(date);
    scheduleDate.setHours(0, 0, 0, 0);

    try {
        const existingSchedule = await prisma.schedule.findUnique({
            where: { date: scheduleDate },
        });

        if (existingSchedule) {
            return NextResponse.json({ error: 'Schedule for this date already exists' }, { status: 400 });
        }

        const schedule = await prisma.schedule.create({
            data: {
                date: scheduleDate,
                startTime,
                endTime,
            },
        });

        return NextResponse.json(schedule);
    } catch (error) {
        console.error('Failed to create schedule:', error);
        return NextResponse.json({ error: 'Failed to create schedule' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const schedules = await prisma.schedule.findMany({
            include: {
                assignments: {
                    include: {
                        VanDriverOperator: true,
                    },
                },
            },
        });
        return NextResponse.json(schedules);
    } catch (error: any) {
        console.error('Error retrieving schedules:', error);
        return NextResponse.json({ message: 'Failed to retrieve schedules', error: error.message }, { status: 500 });
    }
}