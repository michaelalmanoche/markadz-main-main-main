"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';

// Define the interfaces for the data
interface Van {
  id: string;
  plate_number: string;
  make: string;
  series: string;
  // Add other properties if needed
}

interface Operator {
  id: string;
  firstname: string;
  lastname: string;
  // Add other properties if needed
}

interface Driver {
  id: string;
  firstname: string;
  lastname: string;
  // Add other properties if needed
}

interface Assignment {
  van_id: string;
  driver_id: string;
  operator_id: string;
  id: string;
  // Add other properties if needed
}

const Assignments = () => {
  const [vans, setVans] = useState<Van[]>([]);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [selectedOperator, setSelectedOperator] = useState<string>('');
  const [selectedVans, setSelectedVans] = useState<{ [key: string]: string }>({});

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

  const handleEdit = async (assignmentId: string, driverId: string) => {
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

  const handleVanSelection = (vanId: string, driverId: string) => {
    setSelectedVans((prev) => ({
      ...prev,
      [vanId]: driverId,
    }));
  };

  const getAssignedDriver = (vanId: string) => {
    const assignment = assignments.find((assignment) => assignment.van_id === vanId);
    return assignment ? assignment.driver_id : '';
  };

  const getAssignedOperator = (vanId: string) => {
    const assignment = assignments.find((assignment) => assignment.van_id === vanId);
    return assignment ? assignment.operator_id : '';
  };

  const getAssignedDrivers = () => {
    return assignments.map((assignment) => assignment.driver_id);
  };

  const isAssignButtonDisabled = !selectedOperator || !Object.values(selectedVans).some((value) => value);

  return (
    <div className="container mx-auto p-4">
      <div className="p-4 sm:p-6 lg:p-8 ml-[11rem] mt-[-2rem] mb-[-2rem]">
          <h2 className="text-2xl font-normal text-gray-600 ">Assign Vans to Operator and Driver</h2>
          <p className="text-gray-500 dark:text-gray-400">Efficiently manage and assign Vans to Operators and Drivers for smooth operations.</p>
        </div>

      <div className="mb-3 mx-auto w-full max-w-md flex ml-[60rem] items-center">
        <div className="flex-grow">
          
          <select
            className="mt-6 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
        <button
          onClick={handleAssign}
          disabled={isAssignButtonDisabled}
          className={`ml-4 inline-flex mt-6 items-center px-5 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
            isAssignButtonDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
          }`}
        >
          Assign
        </button>
      </div>
      
      <div className="inline-block max-w-full overflow-x-auto relative">
  <table className="bg-white rounded-lg mx-auto ml-52 overflow-hidden w-full" style={{ tableLayout: 'fixed', width: '85.8%', minWidth: '1000px' }}>
    <thead className="bg-blue-400 text-xs text-center">
      <tr className="text-white">
        <th className="px-4 py-2 text-left font-normal rounded-l-lg" >Select</th>
        <th className="px-4 py-2 text-left font-normal" >Plate Number</th>
        <th className="px-4 py-2 text-left font-normal" >Make</th>
        <th className="px-4 py-2 text-left font-normal" >Model</th>
        <th className="px-4 py-2 text-left font-normal" >Driver</th>
        <th className="px-4 py-2 text-left font-normal" >Operator</th>
        <th className="px-4 py-2 text-center font-normal rounded-r-lg" >Actions</th>
      </tr>
    </thead>
    <tbody className="text-xs">
      {vans.length === 0 ? (
        <tr>
          <td colSpan={7} className="px-4 py-52 text-center text-lg font-medium text-gray-400">
            No Vans Available
          </td>
        </tr>
      ) : (
        vans.map((van) => {
          const assignedDriver = getAssignedDriver(van.id);
          const assignedOperator = getAssignedOperator(van.id);
          const isAssigned = assignedOperator;
          const assignedDrivers = getAssignedDrivers();
          const assignment = assignments.find((assignment) => assignment.van_id === van.id);

          return (
            <tr key={van.id} className="border-b">
              <td className="px-4 py-2" style={{ wordBreak: 'break-word' }}>
                <input
                  type="checkbox"
                  checked={!!selectedVans[van.id]}
                  onChange={(e) => handleVanSelection(van.id, e.target.value)}
                  disabled={!!isAssigned}
                  className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                />
              </td>
              <td className="px-4 py-2" style={{ wordBreak: 'break-word' }}>{van.plate_number}</td>
              <td className="px-4 py-2" style={{ wordBreak: 'break-word' }}>{van.make}</td>
              <td className="px-4 py-2" style={{ wordBreak: 'break-word' }}>{van.series}</td>
              <td className="px-4 py-2" style={{ wordBreak: 'break-word' }}>
                <select
                  onChange={(e) => handleVanSelection(van.id, e.target.value)}
                  value={selectedVans[van.id] || assignedDriver || ''}
                  disabled={!!isAssigned && !!assignedDriver}
                  className="mt-1 ml-[-2.6rem] block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
              <td className="px-4 py-2" style={{ wordBreak: 'break-word' }}>
                {operators.find((operator) => operator.id === assignedOperator)?.firstname || 'Not Assigned'}{' '}
                {operators.find((operator) => operator.id === assignedOperator)?.lastname || ''}
              </td>
                <td className="px-4 py-2">
                {assignedOperator && assignment && (
                  <button
                  onClick={() => handleEdit(assignment.id, selectedVans[van.id])}
                  className={`text-indigo-600 border border-indigo-600 px-2 py-1 rounded ${assignedDriver ? 'cursor-not-allowed opacity-50' : 'hover:text-indigo-900 hover:bg-indigo-100'}`}
                  disabled={!!assignedDriver}
                  >
                  {assignedDriver ? 'Driver Assigned' : 'Add Driver'}
                  </button>
                )}
                </td>
            </tr>
          );
        })
      )}
    </tbody>
  </table>
</div>
    </div>
  );
};

export default Assignments;