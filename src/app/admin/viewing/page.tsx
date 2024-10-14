"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Assign() {
  const [vanDriverOperators, setVanDriverOperators] = useState<{ id: string }[]>([]);
  const [schedules, setSchedules] = useState<{ id: string; date: string; assignments?: any[] }[]>([]);
  const [selectedVanDriverOperator, setSelectedVanDriverOperator] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const vanDriverOperatorsRes = await fetch('/api/vandriveroperators');
        const schedulesRes = await fetch('/api/schedule');
        setVanDriverOperators(await vanDriverOperatorsRes.json());
        setSchedules(await schedulesRes.json());
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    }
    fetchData();
  }, []);

  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const form = e.target as HTMLFormElement;
      const date = (form.elements.namedItem('date') as HTMLInputElement).value;
      const startTime = (form.elements.namedItem('startTime') as HTMLInputElement).value;
      const endTime = (form.elements.namedItem('endTime') as HTMLInputElement).value;
      await axios.post('/api/schedule', { date, startTime, endTime });
      setShowCreateModal(false);
      alert('Schedule created successfully');
    } catch (error) {
      console.error('Failed to create schedule:', error);
      alert('Failed to create schedule');
    }
  };

  const handleAssignSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await fetch('/api/vandriveroperators', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vanDriverOperatorId: selectedVanDriverOperator,
          scheduleId: selectedSchedule,
        }),
      });
      setSchedules(schedules.map(schedule => 
        schedule.id === selectedSchedule ? { ...schedule, assignments: [...(schedule.assignments || []), { VanDriverOperator: { id: selectedVanDriverOperator } }] } : schedule
      ));
      setShowAssignModal(false);
      alert('Assignment created successfully');
    } catch (error) {
      console.error('Failed to create assignment:', error);
      alert('Failed to create assignment');
    }
  };

  const handleRemoveSchedule = async (id: string) => {
    try {
      await axios.delete(`/api/schedule/${id}`);
      setSchedules(schedules.filter(schedule => schedule.id !== id));
      alert('Schedule removed successfully');
    } catch (error) {
      console.error('Failed to remove schedule:', error);
      alert('Failed to remove schedule');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-lg w-full max-w-3xl">
        <div className="flex justify-end mb-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mr-2"
            onClick={() => setShowCreateModal(true)}
          >
            Create Schedule
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            onClick={() => setShowAssignModal(true)}
          >
            Assign Schedule
          </button>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Scheduled Times</h2>
          <div className="flex flex-wrap gap-4">
            {schedules.filter(schedule => schedule.assignments && schedule.assignments.length > 0).map((schedule) => (
              <div key={schedule.id} className="p-4 bg-gray-100 rounded-lg shadow w-1/3">
                <p><strong>Date:</strong> {schedule.date}</p>
                <p><strong>Assignments:</strong></p>
                <ul>
                  {schedule.assignments?.map((assignment) => (
                    <li key={assignment.id}>
                      {assignment.VanDriverOperator.id}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {showCreateModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Create Schedule</h2>
              <form onSubmit={handleCreateSubmit}>
                <div className="mb-4">
                  <label htmlFor="date" className="block text-gray-700">Date</label>
                  <input type="date" id="date" name="date" className="w-full border rounded-lg p-2" required />
                </div>
                <div className="mb-4">
                  <label htmlFor="startTime" className="block text-gray-700">Start Time</label>
                  <input type="time" id="startTime" name="startTime" className="w-full border rounded-lg p-2" required />
                </div>
                <div className="mb-4">
                  <label htmlFor="endTime" className="block text-gray-700">End Time</label>
                  <input type="time" id="endTime" name="endTime" className="w-full border rounded-lg p-2" required />
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">Create</button>
                  <button
                    type="button"
                    className="ml-2 bg-red-500 text-white px-4 py-2 rounded-lg"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showAssignModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">Assign Schedule</h2>
              <form onSubmit={handleAssignSubmit}>
                <div className="mb-4">
                  <label htmlFor="vanDriverOperator" className="block text-gray-700">Van Driver Operator</label>
                  <select
                    id="vanDriverOperator"
                    value={selectedVanDriverOperator}
                    onChange={(e) => setSelectedVanDriverOperator(e.target.value)}
                    className="w-full border rounded-lg p-2"
                    required
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
                  <label htmlFor="schedule" className="block text-gray-700">Schedule</label>
                  <select
                    id="schedule"
                    value={selectedSchedule}
                    onChange={(e) => setSelectedSchedule(e.target.value)}
                    className="w-full border rounded-lg p-2"
                    required
                  >
                    <option value="">Select Schedule</option>
                    {schedules.map((schedule) => (
                      <option key={schedule.id} value={schedule.id}>
                        {schedule.date}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">Assign</button>
                  <button
                    type="button"
                    className="ml-2 bg-red-500 text-white px-4 py-2 rounded-lg"
                    onClick={() => setShowAssignModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}