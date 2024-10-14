"use client"
import React, { useEffect, useState } from 'react';

interface Schedule {
    time: string;
    destination: string;
    status: string;
    van: string;
}

const schedules: Schedule[] = [
    { time: '08:00', destination: 'Palimbang', status: 'On Boarding', van: 'Van 1' },
    { time: '08:35', destination: 'Gensan', status: 'Departed', van: 'Van 2' },
    { time: '09:10', destination: 'Palimbang', status: 'On Boarding', van: 'Van 3' },
    // Add more schedules as needed
];

const Dashboard: React.FC = () => {
    const [currentSchedules, setCurrentSchedules] = useState<Schedule[]>(schedules);

    useEffect(() => {
        const interval = setInterval(() => {
            // Update the schedules here if needed
            setCurrentSchedules(schedules);
        }, 35 * 60 * 1000); // 35 minutes interval

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Schedule</h1>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="py-3 px-6 text-left">Time</th>
                            <th className="py-3 px-6 text-left">Destination</th>
                            <th className="py-3 px-6 text-left">Status</th>
                            <th className="py-3 px-6 text-left">Van</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentSchedules.map((schedule, index) => (
                            <tr key={index} className="hover:bg-gray-100">
                                <td className="py-4 px-6 border-b border-gray-200">{schedule.time}</td>
                                <td className="py-4 px-6 border-b border-gray-200">{schedule.destination}</td>
                                <td className={`py-4 px-6 border-b border-gray-200 ${schedule.status === 'On Boarding' ? 'text-green-500' : 'text-red-500'}`}>
                                    {schedule.status}
                                </td>
                                <td className="py-4 px-6 border-b border-gray-200">{schedule.van}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;