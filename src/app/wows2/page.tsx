"use client";

import { useState, useEffect } from 'react';

export default function Assign() {
  const [vanDriverOperators, setVanDriverOperators] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [selectedVanDriverOperator, setSelectedVanDriverOperator] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState('');

  useEffect(() => {
    async function fetchData() {
      const vanDriverOperatorsRes = await fetch('/api/vandriveroperators');
      const vanDriverOperatorsData = await vanDriverOperatorsRes.json();
      setVanDriverOperators(vanDriverOperatorsData);

      const schedulesRes = await fetch('/api/schedule');
      const schedulesData = await schedulesRes.json();
      setSchedules(schedulesData);
    }
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/vandriveroperators', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vanDriverOperatorId: selectedVanDriverOperator,
        scheduleId: selectedSchedule,
      }),
    });
    if (res.ok) {
      alert('Assignment created successfully');
    } else {
      alert('Failed to create assignment');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="mb-4">
        <label htmlFor="vanDriverOperator" className="block text-gray-700 font-bold mb-2">Van Driver Operator</label>
        <select
          id="vanDriverOperator"
          value={selectedVanDriverOperator}
          onChange={(e) => setSelectedVanDriverOperator(e.target.value)}
          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        >
          <option value="">Select Van Driver Operator</option>
          {vanDriverOperators.map((vdo) => (
            <option key={vdo.id} value={vdo.id}>
              {vdo.id} 
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="schedule" className="block text-gray-700 font-bold mb-2">Schedule</label>
        <select
          id="schedule"
          value={selectedSchedule}
          onChange={(e) => setSelectedSchedule(e.target.value)}
          className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        >
          <option value="">Select Schedule</option>
          {schedules.map((schedule) => (
            <option key={schedule.id} value={schedule.id}>
              {schedule.date}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200"
      >
        Assign
      </button>
    </form>
  );
}