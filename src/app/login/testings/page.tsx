"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';

const Assignments = () => {
  const [vans, setVans] = useState([]);
  const [operators, setOperators] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedOperator, setSelectedOperator] = useState('');
  const [selectedVans, setSelectedVans] = useState({});

  useEffect(() => {
    // Fetch vans, operators, drivers, and assignments from the API
    const fetchData = async () => {
      try {
        const vansResponse = await axios.get('/api/vans');
        const operatorsResponse = await axios.get('/api/operators');
        const driversResponse = await axios.get('/api/drivers');
        const assignmentsResponse = await axios.get('/api/assignments');
        setVans(vansResponse.data);
        setOperators(operatorsResponse.data);
        setDrivers(driversResponse.data);
        setAssignments(assignmentsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleAssign = async () => {
    try {
      await axios.post('/api/assignments', {
        operator_id: selectedOperator,
        vanDriverAssignments: selectedVans,
      });
      alert('Assignment successful');
    } catch (error) {
      console.error('Error assigning vans:', error);
      alert('Failed to assign vans');
    }
  };

  const handleEdit = async (assignmentId, driverId) => {
    try {
      await axios.put('/api/assignments', {
        id: assignmentId,
        driver_id: driverId,
      });
      alert('Driver assignment updated successfully');
    } catch (error) {
      console.error('Error updating driver assignment:', error);
      alert('Failed to update driver assignment');
    }
  };

  const handleVanSelection = (vanId, driverId) => {
    setSelectedVans((prev) => ({
      ...prev,
      [vanId]: driverId,
    }));
  };

  const getAssignedDriver = (vanId) => {
    const assignment = assignments.find((assignment) => assignment.van_id === vanId);
    return assignment ? assignment.driver_id : '';
  };

  const getAssignedOperator = (vanId) => {
    const assignment = assignments.find((assignment) => assignment.van_id === vanId);
    return assignment ? assignment.operator_id : '';
  };

  const getAssignedDrivers = () => {
    return assignments.map((assignment) => assignment.driver_id);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Assign Vans to Operator and Driver</h1>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Select Operator:</label>
        <select
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          onChange={(e) => setSelectedOperator(e.target.value)}
          value={selectedOperator}
        >
          <option value="">Select Operator</option>
          {operators.map((operator) => (
            <option key={operator.id} value={operator.id}>
              {operator.firstname} {operator.lastname}
            </option>
          ))}
        </select>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Select</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Van ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plate Number</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Make</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operator</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {vans.map((van) => {
            const assignedDriver = getAssignedDriver(van.id);
            const assignedOperator = getAssignedOperator(van.id);
            const isAssigned = assignedOperator;
            const assignedDrivers = getAssignedDrivers();
            const assignment = assignments.find((assignment) => assignment.van_id === van.id);

            return (
              <tr key={van.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={!!selectedVans[van.id]}
                    onChange={(e) => handleVanSelection(van.id, e.target.value)}
                    disabled={isAssigned}
                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{van.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{van.plate_number}</td>
                <td className="px-6 py-4 whitespace-nowrap">{van.make}</td>
                <td className="px-6 py-4 whitespace-nowrap">{van.series}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    onChange={(e) => handleVanSelection(van.id, e.target.value)}
                    value={selectedVans[van.id] || assignedDriver || ''}
                    disabled={isAssigned && assignedDriver}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Select Driver</option>
                    {drivers
                      .filter((driver) => !assignedDrivers.includes(driver.id) || driver.id === assignedDriver)
                      .map((driver) => (
                        <option key={driver.id} value={driver.id}>
                          {driver.firstname} {driver.lastname}
                        </option>
                      ))}
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {operators.find((operator) => operator.id === assignedOperator)?.firstname || 'Not Assigned'}{' '}
                  {operators.find((operator) => operator.id === assignedOperator)?.lastname || ''}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {assignedOperator && !assignedDriver && assignment && (
                    <button
                      onClick={() => handleEdit(assignment.id, selectedVans[van.id])}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      Add Driver
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button
        onClick={handleAssign}
        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Assign
      </button>
    </div>
  );
};

export default Assignments;