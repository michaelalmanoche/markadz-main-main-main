"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';

const fetchAssignments = async (status: string, terminal: string) => {
  const response = await axios.get(`/api/scheduling?terminal=${terminal}&status=${status}`);
  return response.data;
};

const fetchIdleAssignments = async (terminal: string) => {
  const response = await axios.get(`/api/scheduling?terminal=${terminal}&status=idle`);
  return response.data;
};

const updateAssignment = async (id: number, status: string, terminal: string, order?: number, arrivalTime?: string, departureTime?: string) => {
  await axios.put('/api/scheduling', { id, status, terminal, order, arrivalTime, departureTime });
};

const Terminal2 = () => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [idleAssignments, setIdleAssignments] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('queued');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [countdownAssignmentId, setCountdownAssignmentId] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleTimeString());
  const [estimatedDepartureTime, setEstimatedDepartureTime] = useState<string | null>(null);
  const [estimatedArrivalTime, setEstimatedArrivalTime] = useState<string | null>(null);

  useEffect(() => {
    const loadAssignments = async () => {
      const data = await fetchAssignments(statusFilter, 'terminal1');
      data.sort((a: any, b: any) => a.queue_order - b.queue_order); // Sort by queue_order
      setAssignments(data);
    };

    const loadIdleAssignments = async () => {
      const data = await fetchIdleAssignments('terminal1');
      data.sort((a: any, b: any) => a.queue_order - b.queue_order); // Sort by queue_order
      setIdleAssignments(data);
    };

    loadAssignments();
    loadIdleAssignments();
    const intervalId = setInterval(() => {
      loadAssignments();
      loadIdleAssignments();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [statusFilter]);

  useEffect(() => {
    if (assignments.length > 0 && assignments[0].status === 'queued' && assignments[0].id !== countdownAssignmentId) {
      setCountdown(5);
      setCountdownAssignmentId(assignments[0].id);
      const estimatedTime = new Date(new Date().getTime() + 5000).toLocaleTimeString();
      setEstimatedDepartureTime(estimatedTime);
    }
  }, [assignments]);

  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      if (assignments[0] && assignments[0].id === countdownAssignmentId) {
        handleStatusChange(assignments[0].id, 'departed');
      }
    } else {
      const timerId = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timerId);
    }
  }, [countdown, assignments]);

  useEffect(() => {
    const timeIntervalId = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timeIntervalId);
  }, []);

  const handleStatusChange = async (id: number, newStatus: string) => {
    const currentTerminal = 'terminal1';
    const currentTime = new Date().toLocaleTimeString();

    try {
      if (newStatus === 'queued') {
        // Fetch current queued assignments to determine the next order
        const assignmentsData = await fetchAssignments('queued', currentTerminal);
        const nextOrder = assignmentsData.length + 1; // Next order number

        // Update status to queued with the new order
        await updateAssignment(id, 'queued', currentTerminal, nextOrder);
      } else if (newStatus === 'departed') {
        const assignmentsData = await fetchAssignments('queued', currentTerminal);
        const firstInQueueId = assignmentsData.length > 0 ? assignmentsData[0].id : null;

        if (id !== firstInQueueId) {
          alert('Only the first van in the queue can be marked as departed.');
          return;
        }

        // Change status to departed
        await updateAssignment(id, 'departed', currentTerminal, undefined, undefined, currentTime);

        // Calculate estimated arrival time (assuming 10 seconds travel time for example)
        const estimatedArrival = new Date(new Date().getTime() + 10000).toLocaleTimeString();
        setEstimatedArrivalTime(estimatedArrival);

        // Wait for 5 seconds before changing status to idle in the new terminal
        setTimeout(async () => {
          await updateAssignment(id, 'idle', 'terminal2');
          const data = await fetchAssignments(statusFilter, currentTerminal);
          setAssignments(data);
        }, 10000);
      } else if (newStatus === 'arrived') {
        await updateAssignment(id, 'arrived', currentTerminal, undefined, currentTime);
      } else {
        await updateAssignment(id, newStatus, currentTerminal);
      }

      // Refresh assignments after any status change
      const data = await fetchAssignments(statusFilter, currentTerminal);
      setAssignments(data);
    } catch (error) {
      console.error('Error changing status:', error);
    }
  };

  const getDestination = (terminal: string) => {
    switch (terminal) {
      case 'terminal1':
        return 'Gensan Terminal';
      case 'terminal2':
        return 'Palimbang Terminal';
      default:
        return 'Unknown Destination';
    }
  };

  return (
    <div className="p-6  ">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Palimbang Terminal</h1>
      <div className="text-center mb-6">
        <span className="text-xl font-semibold text-gray-700">Current Time: {currentTime}</span>
      </div>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Idle Vans</h2>
        <ul className="bg-white shadow-md rounded-lg divide-y divide-gray-200">
          {idleAssignments.map((assignment: any) => (
            <li key={assignment.id} className="p-4 flex justify-between items-center">
              <span className="font-medium text-gray-900">
                Driver: {assignment.VanDriverOperator.Driver.firstname} {assignment.VanDriverOperator.Driver.lastname} - Plate Number: {assignment.VanDriverOperator.Van.plate_number} - Status: {assignment.status}
              </span>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                onClick={() => handleStatusChange(assignment.id, 'queued')}
              >
                Queue
              </button>
            </li>
          ))}
        </ul>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Other Statuses</h2>
        <div className="mb-4 flex space-x-4">
          <button
            className={`px-4 py-2 rounded-lg font-semibold ${statusFilter === 'queued' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setStatusFilter('queued')}
          >
            Show Queued
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-semibold ${statusFilter === 'departed' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setStatusFilter('departed')}
          >
            Show Departed
          </button>
        </div>
        <ul className="bg-white shadow-md rounded-lg divide-y divide-gray-200">
          {assignments.map((assignment: any, index: number) => (
            <li key={assignment.id} className="p-4 flex justify-between items-center">
              <span className="font-medium text-gray-900">
                Driver: {assignment.VanDriverOperator.Driver.firstname} {assignment.VanDriverOperator.Driver.lastname} - Plate Number: {assignment.VanDriverOperator.Van.plate_number} - Status: {assignment.status} - Destination: {getDestination('terminal1')}
              </span>
              <div className="flex space-x-2">
                {assignment.status !== 'queued' && (
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                    onClick={() => handleStatusChange(assignment.id, 'queued')}
                  >
                    Queue
                  </button>
                )}
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                  onClick={() => handleStatusChange(assignment.id, 'departed')}
                >
                  Depart
                </button>
              </div>
              {assignment.status === 'queued' && (
                index === 0 && countdown !== null ? (
                  <>
                    <span className="ml-4 text-red-500 font-bold">{countdown}</span>
                    <span className="ml-4 text-green-500 font-bold">Est. Departure: {estimatedDepartureTime}</span>
                  </>
                ) : (
                  <span className="ml-4 text-yellow-500 font-bold">W</span>
                )
              )}
              {assignment.status === 'departed' && estimatedArrivalTime && (
                <span className="ml-4 text-green-500 font-bold">Est. Arrival: {estimatedArrivalTime}</span>
              )}
              {assignment.arrivalTime && (
                <span className="ml-4 text-green-500 font-bold">Arrived at: {assignment.arrivalTime}</span>
              )}
              {assignment.departureTime && (
                <span className="ml-4 text-blue-500 font-bold">Departed at: {assignment.departureTime}</span>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Terminal2;