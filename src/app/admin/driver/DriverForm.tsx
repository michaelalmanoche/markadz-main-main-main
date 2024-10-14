"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import Modal from './Modal'; // Import the Modal component
import data from './data';

const dlOptions = ['A', 'A1', 'B', 'B1', 'B2', 'C', 'D', 'BE', 'CE'];
const conditionOptions = ['1', '2', '3', '4', '5'];


interface Operator {
  id?: number;
  firstname: string;
  middlename: string;
  lastname: string;
  license_no: string;
  contact: string;
  region: string;
  city: string;
  brgy: string;
  street: string;
  dl_codes: string[]; // Ensure dl_codes is of type string[]
  conditions: string[]; // Ensure conditions is of type string[]
  expiration_date: string;
  birth_date: string;
  emergency_firstname: string;
  emergency_middlename: string;
  emergency_lastname: string;
  emergency_region: string;
  emergency_city: string;
  emergency_brgy: string;
  emergency_street: string;
  emergency_contact: string;
  archived: boolean;
}

const DriverForm = () => {
  const [operator, setOperator] = useState<Operator>({
    firstname: "",
    middlename: "",
    lastname: "",
    license_no: "",
    contact: "",
    region: "",
    city: "",
    brgy: "",
    street: "",
    dl_codes: [], // Initialize as an empty array of strings
    conditions: [], // Initialize as an empty array of strings
    expiration_date: "",
    birth_date: "",
    emergency_firstname: "",
    emergency_middlename: "",
    emergency_lastname: "",
    emergency_region: "",
    emergency_city: "",
    emergency_brgy: "",
    emergency_street: "",
    emergency_contact: "",
    archived: false,
  });

  const [operatorList, setOperatorList] = useState<Operator[]>([]);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedOperator, setSelectedOperator] = useState<Operator | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;
  const totalPages = Math.ceil(operatorList.length / rowsPerPage);
  const [isConfirmArchiveOpen, setIsConfirmArchiveOpen] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState(""); // State for alert message
  const [isRegisterAlertVisible, setIsRegisterAlertVisible] = useState(false); // State for register alert visibility
  const [operatorIdToArchive, setOperatorIdToArchive] = useState<number | null>(null);

  useEffect(() => {
    // Check if the current page has rows
    if (!hasRows(currentPage, rowsPerPage, operatorList) && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage, rowsPerPage, operatorList]);


  const handleRegionChange = (e: { target: { value: any; }; }) => {
    setOperator({
      ...operator,
      region: e.target.value,
      city: '',
      brgy: '',
    });
  };

  const handleCityChange = (e: { target: { value: any; }; }) => {
    setOperator({
      ...operator,
      city: e.target.value,
      brgy: '',
    });
  };

  const handleBarangayChange = (e: { target: { value: any; }; }) => {
    setOperator({
      ...operator,
      brgy: e.target.value,
    });
  };

  // Function to check if the current page has rows
  const hasRows = (currentPage: number, rowsPerPage: number, data: Operator[]) => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return data.slice(startIndex, endIndex).length > 0;
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const currentRows = operatorList.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  useEffect(() => {
    const fetchOperators = async () => {
      try {
        const response = await axios.get("/api/drivers");
        setOperatorList(response.data);
      } catch (error) {
        console.error("Failed to fetch operators:", error);
      }
    };

    fetchOperators();
  }, []);

  const handleRegisterModalClose = () => {
    setIsRegisterModalOpen(false);
  };

  const handleViewModalClose = () => {
    setIsViewModalOpen(false);
    setIsEditMode(false);
    setSelectedOperator(null);
  };

  const handleView = (operator: Operator) => {
    setSelectedOperator(operator);
    setIsViewModalOpen(true);
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleArchive = (operator: Operator) => {
    if (operator.id !== undefined) {
      setOperatorIdToArchive(operator.id);
    }
    setIsConfirmArchiveOpen(true);
  };

  const confirmArchiveUser = async () => {
    if (operatorIdToArchive === null) return;

    try {
      // Perform the archive request
      const response = await axios.delete(`/api/drivers`, {
        data: { id: operatorIdToArchive } // Include data if needed by your server
      });

      // Check the response status
      if (response.status === 200) {
        showAlert("User archived successfully"); // Show the alert
        setOperatorList((prev) =>
          prev.filter((op) => op.id !== operatorIdToArchive)
        );
        setIsConfirmArchiveOpen(false); // Close the confirmation dialog
      } else {
        console.error('Unexpected response status:', response.status);
        alert('Failed to archive operator');
      }
    } catch (error: any) {
      // Log error details
      console.error('Error during archive:', error.response?.data || error.message);
      alert('Failed to archive operator');
    }
  };

  const handleRegisterChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = event.target;
    if (name === 'dl_codes' || name === 'conditions') {
      setOperator(prevState => {
        const updatedArray = checked
          ? [...prevState[name as 'dl_codes' | 'conditions'], value]
          : prevState[name as 'dl_codes' | 'conditions'].filter(code => code !== value);
        return { ...prevState, [name]: updatedArray };
        
      });
    } else {
      setOperator((prevOperator) => ({
        ...prevOperator,
        [name]: value,
      }));
    }
  };

  const handleRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/drivers", operator);
      setAlertMessage("Operator Registered Successfully"); // Set alert message
      setIsRegisterAlertVisible(true); // Show the register alert
      setTimeout(() => setIsRegisterAlertVisible(false), 3000); // Hide the alert after 3 seconds
      setOperator({
        firstname: "",
        middlename: "",
        lastname: "",
        license_no: "",
        contact: "",
        region: "",
        city: "",
        brgy: "",
        street: "",
        dl_codes: [], // Reset to empty array
        conditions: [], // Reset to empty array
        expiration_date: "",
        birth_date: "",
        emergency_firstname: "",
        emergency_middlename: "",
        emergency_lastname: "",
        emergency_region: "",
        emergency_city: "",
        emergency_brgy: "",
        emergency_street: "",
        emergency_contact: "",
        archived: false,
      });
      const response = await axios.get("/api/drivers");
      setOperatorList(response.data);
      handleRegisterModalClose(); // Close the modal after successful submission
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          alert("License number already registered");
        } else {
          alert("Failed to register Driver");
        }
      }
    }
  };

  const Editdropdown = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSelectedOperator((prevState,) => ({
      ...prevState!,
      [name]: value,
    }));
  };

  const Registerdropdown = (event: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = event.target;
    setOperator((prevOperator) => ({
      ...prevOperator,
      [name]: value,
    }));
  };

 

  const handleViewChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = event.target;
    if (name === 'dl_codes' || name === 'conditions') {
      setSelectedOperator(prevState => {
        if (!prevState) return prevState; // Ensure prevState is not null
        const updatedArray = checked
          ? [...prevState[name as keyof Operator] as string[], value]
          : (prevState[name as keyof Operator] as string[]).filter(item => item !== value);
        return { ...prevState, [name]: updatedArray };
      });
    } else {
      setSelectedOperator(prevState => {
        if (!prevState) return prevState; // Ensure prevState is not null
        return { ...prevState, [name]: value };
      });
    }
  };


  const handleViewSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedOperator) return;

    try {
      await axios.put(`/api/drivers/${selectedOperator.id}`, selectedOperator);
      showAlert("Operator updated successfully"); // Show the alert
      const response = await axios.get("/api/drivers");
      setOperatorList(response.data);
      handleViewModalClose(); // Close the modal after successful update
    } catch (error) {
      showAlert("Failed to update operator"); // Show the alert
    }
  };

  const showAlert = (message: string) => {
    setAlertMessage(message);
    setIsAlertVisible(true);
    setTimeout(() => setIsAlertVisible(false), 3000);
  };


  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
        <button onClick={() => setIsRegisterModalOpen(true)}
        className="bg-blue-500 text-white font-light text-sm px-2 
        py-2 rounded-md ml-auto flex items-center  sm:mb-6 
        hover:bg-blue-600 transition duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" className="mr-1">
          <path d="M12 8V16M16 12L8 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        Add Driver
      </button>

    
     {/* Register Modal */}
<Modal isOpen={isRegisterModalOpen} onClose={handleRegisterModalClose} title="Register Driver">
  <form onSubmit={handleRegisterSubmit} className="space-y-8 p-2 sm:p-2">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2" style={{marginBottom:'-1.2rem'}}>
      <div >
        <label className="block mb-2 text-sm font-medium text-gray-900 uppercase">First Name</label>
        <input type="text" name="firstname" value={operator.firstname} onChange={handleRegisterChange} required
          className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase" placeholder="first name"/>
      </div>
      
      <div className="">
        <label className="block mb-2 text-sm font-medium text-gray-900 uppercase">Middle Name</label>
        <input type="text" name="middlename" value={operator.middlename} onChange={handleRegisterChange} className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase" placeholder="middle name" required />
      </div>
      <div className="">
        <label className="block mb-2 text-sm font-medium text-gray-900 uppercase">Last Name</label>
        <input type="text" name="lastname" value={operator.lastname} onChange={handleRegisterChange} required 
        className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase" placeholder="last name" />
      </div>
    </div>
    
      
          {/*Contact Information */}
       <div className="flex justify-between items-center pb-4 mb-4 rounded-t  border-b sm:mb-5 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
        </div>

    
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  <div className="">
    <label className="block mb-2 text-sm font-medium text-gray-900 uppercase">Region</label>
    <select
      name="region"
      value={operator.region}
      onChange={handleRegionChange}
      required
      className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase"
    >
      <option value="" disabled>Select Region</option>
      {Object.keys(data).map((region) => (
        <option key={region} value={region}>
          {region}
        </option>
      ))}
    </select>
  </div>

  <div className="">
    <label htmlFor="city" className="block mb-2 text-sm font-medium text-gray-900 uppercase">City</label>
    <select
      id="city"
      name="city"
      value={operator.city}
      onChange={handleCityChange}
      disabled={!operator.region}
      className={`bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase ${!operator.region ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <option value="" disabled>Select City</option>
      {operator.region && Object.keys(data[operator.region]).map((city) => (
        <option key={city} value={city}>
          {city}
        </option>
      ))}
    </select>
  </div>

  <div className="">
    <label htmlFor="brgy" className="block mb-2 text-sm font-medium text-gray-900 uppercase">Barangay</label>
    <select
      id="brgy"
      name="brgy"
      value={operator.brgy}
      onChange={handleBarangayChange}
      disabled={!operator.city}
      className={`bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase ${!operator.city ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <option value="" disabled>Select Barangay</option>
      {operator.city && data[operator.region][operator.city].map((brgy) => (
        <option key={brgy} value={brgy}>
          {brgy}
        </option>
      ))}
    </select>
  </div>
</div>

<div className="mt-4">
  <label className="block mb-2 text-sm font-medium text-gray-900 uppercase">Street</label>
  <input
    type="text"
    name="street"
    value={operator.street}
    onChange={handleRegisterChange}
    required
    className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase"
    placeholder="street name"
  />
</div>

  <div className="grid grid-cols-1 gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="">
            <label className="block mb-2 text-sm font-medium text-gray-900 uppercase">Contact Number</label>
          <input   type="text"   name="contact"  value={operator.contact}   onChange={handleRegisterChange}  onInput={(e) => { const target = e.target as HTMLInputElement; target.value = target.value.replace(/[^0-9]/g, '');}} maxLength={11} required className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-[22em] p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase" placeholder="contact no."  />
         </div>
  </div>
  
    </div>


       {/* License Information  */}
       <div className="flex justify-between items-center pb-4 mb-4 rounded-t  border-b sm:mb-5 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900">License Information</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  <div className="">
    <label className="block mb-2 text-sm font-medium text-gray-900 uppercase">License No</label>
    <input  type="text" name="license_no" value={operator.license_no} onChange={handleRegisterChange}required className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block  p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase"placeholder="license no." />
  </div>

  <div className="ml-[-5rem]">
    <label className="block mb-2 text-sm font-medium text-gray-900 uppercase">Birth Date</label>
    <input 
      type="date" 
      name="birth_date" 
      value={operator.birth_date} 
      onChange={(e) => {
        const selectedDate = new Date(e.target.value);
        const today = new Date();
        let age = today.getFullYear() - selectedDate.getFullYear();
        const monthDifference = today.getMonth() - selectedDate.getMonth();
        if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < selectedDate.getDate())) {
          age--;
        }
        if (age < 18) {
          alert("Driver must be at least 18 years old.");
          return;
        }
        handleRegisterChange(e);
      }}
      required 
      className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase"
      placeholder="expiration date" 
    />
  </div>

  <div className="ml-[-14rem]">
    <label className="block mb-2 text-sm font-medium text-gray-900 uppercase">Expiration Date</label>
    <input type="date" name="expiration_date"value={operator.expiration_date}onChange={handleRegisterChange}required className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase" placeholder="expiration date"/>
  </div>

</div>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mt-4">
  
<div className="">
    <label className="block mb-2 text-sm font-medium text-gray-900 uppercase">DL Codes</label>
    <div style={{width:'13.4rem'}}  
    className="bg-gray-50 border-2 border-gray-300
     text-gray-900 text-sm rounded-lg block  p-2.5 placeholder-gray-400
      uppercase">
      <div className="grid grid-cols-3 ">
        {dlOptions.map(option => (
          <div key={option} className="flex items-center mb-2">
            <input
              type="checkbox"
              name="dl_codes"
              value={option}
              checked={operator.dl_codes.includes(option)}
              onChange={handleRegisterChange}
              className="mr-2"
            />
            <label className="text-sm font-medium text-gray-900">{option}</label>
          </div>
        ))}
      </div>
    </div>
  </div>

  <div className="ml-[-14rem]">
    <label className="block mb-2 text-sm font-medium text-gray-900 uppercase ">Conditions</label>
    <div style={{width:'9rem'}}  
     className="bg-gray-50 border-2 border-gray-300
     text-gray-900 text-sm rounded-lg block w-96 p-2.5 placeholder-gray-400
       uppercase">
      <div className="grid grid-cols-3">
        {conditionOptions.map(option => (
          <div key={option} className="flex items-center mb-2 mr-4">
            <input
              type="checkbox"
              name="conditions"
              value={option}
              checked={operator.conditions.includes(option)}
              onChange={handleRegisterChange}
              className="mr-2"
            />
            <label className="text-sm font-medium text-gray-900">{option}</label>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>
      

 {/* Incase of emergency  */}
  <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900">Incase of emergency</h3>
        </div>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

      <div className="">
        <label className="block mb-2 text-sm font-medium text-gray-900 uppercase"> First Name</label>
        <input type="text" name="emergency_firstname" value={operator.emergency_firstname} onChange={handleRegisterChange} required
          className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase" placeholder="emergency name" />
      </div>
      
      
      <div className="">
        <label className="block mb-2 text-sm font-medium text-gray-900 uppercase"> Middle Name</label>
        <input type="text" name="emergency_middlename" value={operator.emergency_middlename} onChange={handleRegisterChange} required
          className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase" placeholder="emergency name" />
      </div>
      <div className="">
        <label className="block mb-2 text-sm font-medium text-gray-900 uppercase"> Last Name</label>
        <input type="text" name="emergency_lastname" value={operator.emergency_lastname} onChange={handleRegisterChange} required
          className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase" placeholder="emergency name" />
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    <div>
    <label className="block mb-2 text-sm font-medium text-gray-900 uppercase">Region</label>
    <select
      name="emergency_region"
      value={operator.emergency_region}
      onChange={Registerdropdown}
      required
      className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase"
    >
      <option value="" disabled>Select Region</option>
      {Object.keys(data).map((region) => (
        <option key={region} value={region}>
          {region}
        </option>
      ))}
    </select>
  </div>

  <div>
    <label htmlFor="emergency_city" className="block mb-2 text-sm font-medium text-gray-900 uppercase">City</label>
    <select
      id="emergency_city"
      name="emergency_city"
      value={operator.emergency_city}
      onChange={Registerdropdown}
      disabled={!operator.emergency_region}
      className={`bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase ${!operator.emergency_region ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <option value="" disabled>Select City</option>
      {operator.emergency_region && data[operator.emergency_region] && Object.keys(data[operator.emergency_region]).map((city) => (
        <option key={city} value={city}>
          {city}
        </option>
      ))}
    </select>
  </div>

  <div>
    <label htmlFor="emergency_brgy" className="block mb-2 text-sm font-medium text-gray-900 uppercase">Barangay</label>
    <select
      id="emergency_brgy"
      name="emergency_brgy"
      value={operator.emergency_brgy}
      onChange={Registerdropdown}
      disabled={!operator.emergency_city}
      className={`bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase ${!operator.emergency_city ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <option value="" disabled>Select Barangay</option>
      {operator.emergency_city && data[operator.emergency_region] && data[operator.emergency_region][operator.emergency_city] && data[operator.emergency_region][operator.emergency_city].map((brgy) => (
        <option key={brgy} value={brgy}>
          {brgy}
        </option>
      ))}
    </select>
  </div>
</div>
<div className="mt-4">
  <label className="block mb-2 text-sm font-medium text-gray-900 uppercase">Street</label>
  <input
    type="text"
    name="emergency_street"
    value={operator.emergency_street}
    onChange={handleRegisterChange}
    required
    className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase"
    placeholder="street name"
  />
</div>
    
    <div className="grid grid-cols-1 gap-4">
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 uppercase">Contact Number</label>
        <input type="text" name="emergency_contact" value={operator.emergency_contact} onChange={handleRegisterChange} 
          onInput={(e) => { const target = e.target as HTMLInputElement; target.value = target.value.replace(/[^0-9]/g, ''); }} maxLength={11} 
          required
          className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-[19rem] p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase" 
          placeholder="contact no." 
        />
      </div>
</div>
      
    <div className="flex justify-end space-x-4">
      <button type="submit" className="text-white inline-flex items-center bg-emerald-500 hover:bg-emerald-600 focus:ring-4 focus:ring-green-500 font-medium rounded-lg text-sm px-5 py-2.5">
        Save
      </button>
      <button type="button" onClick={handleRegisterModalClose} className="text-gray-700 bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5">
        Cancel
      </button>
    </div>
  </form>
</Modal>

        
        <div className="p-4 sm:p-6 lg:p-8 " style={{marginLeft:'-30rem',marginTop:'-7rem'}}>
          <h2 className="text-2xl font-normal text-gray-600 ">Driver Overview</h2>
          <p className="text-gray-500 dark:text-gray-400">View and manage all registered drivers or add new ones to the system</p>
        </div>

        <div className=" flex flex-col overflow-x-auto sm:-mx-6 lg:-mx-8" style={{marginTop:'1rem'}}>
            {/* TABLE */}
            <div className="inline-block min-w-full overflow-x-auto relative">
          <table className="bg-white rounded-lg mx-auto ml-56 overflow-hidden" style={{ tableLayout: 'fixed' }}>
            <thead className="bg-blue-400 text-xs">
              <tr className="text-white">
                <th className="px-4 py-2 w-32 text-left font-normal rounded-l-lg">First Name</th>
                <th className="px-4 py-2 w-32 text-left font-normal">Middle Name</th>
                <th className="px-4 py-2 w-32 text-left font-normal">Last Name</th>
                <th className="px-4 py-2 w-32 text-left font-normal">License No</th>
                <th className="px-4 py-2 w-32 text-left font-normal">Contact</th>
                <th className="px-4 py-2 w-32 text-left font-normal">Region</th>
                <th className="px-4 py-2 w-32 text-left font-normal">City</th>
                <th className="px-4 py-2 w-32 text-left font-normal">Brgy</th>
                <th className="px-4 py-2 w-32 text-left font-normal">Street</th>
                <th className="px-4 py-2 w-32 text-center font-normal rounded-r-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {currentRows.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-52 text-center text-lg font-medium text-gray-400 ">
                    No Operator Registered
                  </td>
                </tr>
              ) : (
                currentRows.map((op, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2 uppercase" style={{ wordBreak: 'break-word' }}>{op.firstname}</td>
                    <td className="px-4 py-2 uppercase" style={{ wordBreak: 'break-word' }}>{op.middlename}</td>
                    <td className="px-4 py-2 uppercase" style={{ wordBreak: 'break-word' }}>{op.lastname}</td>
                    <td className="px-4 py-2 uppercase" style={{ wordBreak: 'break-word' }}>{op.license_no}</td>
                    <td className="px-4 py-2 uppercase" style={{ wordBreak: 'break-word' }}>{op.contact}</td>
                    <td className="px-4 py-2 uppercase" style={{ wordBreak: 'break-word' }}>{op.region}</td>
                    <td className="px-4 py-2 uppercase" style={{ wordBreak: 'break-word' }}>{op.city}</td>
                    <td className="px-4 py-2 uppercase" style={{ wordBreak: 'break-word' }}>{op.brgy}</td>
                    <td className="px-4 py-2 uppercase" style={{ wordBreak: 'break-word' }}>{op.street}</td>
                    
                    <td className="px-4 py-2 uppercase">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleView(op)}
                          className="relative border border-green-400 text-green-400 p-2 rounded-md flex items-center justify-center bg-transparent hover:bg-green-400 hover:text-white transition-colors duration-300"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="20"
                            height="20"
                            className="stroke-current text-green-400 hover:text-white transition-colors duration-300"
                            fill="none"
                          >
                            <path d="M16.2141 4.98239L17.6158 3.58063C18.39 2.80646 19.6452 2.80646 20.4194 3.58063C21.1935 4.3548 21.1935 5.60998 20.4194 6.38415L19.0176 7.78591M16.2141 4.98239L10.9802 10.2163C9.93493 11.2616 9.41226 11.7842 9.05637 12.4211C8.70047 13.058 8.3424 14.5619 8 16C9.43809 15.6576 10.942 15.2995 11.5789 14.9436C12.2158 14.5877 12.7384 14.0651 13.7837 13.0198L19.0176 7.78591M16.2141 4.98239L19.0176 7.78591" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M21 12C21 16.2426 21 18.364 19.682 19.682C18.364 21 16.2426 21 12 21C7.75736 21 5.63604 21 4.31802 19.682C3 18.364 3 16.2426 3 12C3 7.75736 3 5.63604 4.31802 4.31802C5.63604 3 7.75736 3 12 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                          </svg>
                          <div className="absolute bottom-full mb-2 hidden text-xs text-white bg-green-400 p-1 rounded-md tooltip">
                            View/Edit
                          </div>
                        </button>

                        <style jsx>{`.relative:hover .tooltip { display: block;} `}</style>

                        <button
                          onClick={() => handleArchive(op)}
                          className="relative border border-red-500 text-red-500 p-2 rounded-md flex items-center justify-center bg-transparent hover:bg-red-500 hover:text-white transition-colors duration-300"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="20"
                            height="20"
                            className="stroke-current text-red-500 hover:text-white transition-colors duration-300"
                            fill="none"
                          >
                            <path d="M14 22H9.62182C7.27396 22 6.10003 22 5.28565 21.2945C4.47127 20.5889 4.27181 19.3991 3.87289 17.0194L2.66933 9.83981C2.48735 8.75428 2.39637 8.21152 2.68773 7.85576C2.9791 7.5 3.51461 7.5 4.58564 7.5H19.4144C20.4854 7.5 21.0209 7.5 21.3123 7.85576C21.6036 8.21152 21.5126 8.75428 21.3307 9.83981L21.0524 11.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                            <path d="M17.5 7.5C17.5 4.46243 15.0376 2 12 2C8.96243 2 6.5 4.46243 6.5 7.5" stroke="currentColor" stroke-width="1.5" />
                            <path d="M16.5 16.5C16.9915 15.9943 18.2998 14 19 14M21.5 16.5C21.0085 15.9943 19.7002 14 19 14M19 14V22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                          <div className="absolute bottom-full mb-2 hidden text-xs text-white bg-red-500 p-1 rounded-md tooltip">
                            Archive
                          </div>
                        </button>

                        <style jsx>{` .relative:hover .tooltip {  display: block; }`}</style>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

              {/* PAGINATION */}
                <nav className="pagination-bottom flex items-center -space-x-px ml-[700px] mb-10" aria-label="Pagination">
                  <button
                    type="button"
                    className="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center 
                    items-center gap-x-1.5 text-sm first:rounded-s-lg last:rounded-e-lg border border-blue-300
                    text-gray-800 hover:bg-blue-500 hover:text-white focus:outline-none disabled:opacity-50 disabled:pointer-events-none"
                    aria-label="Previous"
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                  >
                    <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="m15 18-6-6 6-6"></path>
                    </svg>
                    <span className="hidden sm:block">Previous</span>
                  </button>
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      className={`min-h-[38px] min-w-[38px] flex justify-center items-center border border-blue-300
                        py-2 px-3 text-sm first:rounded-s-lg last:rounded-e-lg focus:outline-none
                          ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'text-gray-800 hover:text-white hover:bg-blue-500'}`}
                      aria-current={currentPage === index + 1 ? 'page' : undefined}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    type="button"
                    className="min-h-[38px] min-w-[38px] py-2 px-2.5 inline-flex justify-center items-center
                    gap-x-1.5 text-sm first:rounded-s-lg last:rounded-e-lg border border-blue-300 text-gray-800
                      hover:bg-blue-500 hover:text-white focus:outline-none disabled:opacity-50 disabled:pointer-events-none"
                    aria-label="Next"
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                  >
                    <span className="hidden sm:block">Next</span>
                    <svg className="shrink-0 size-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="m9 18 6-6-6-6"></path>
                    </svg>
                  </button>
                </nav>
            </div>   
        </div>


      {/* View/Edit Modal */}
{isViewModalOpen && selectedOperator && (
  <Modal isOpen={isViewModalOpen} onClose={handleViewModalClose} title={isEditMode ? "Edit Driver" : "View Driver"} // Add the title prop here
>
    {!isEditMode ? (
      <div className="space-y-8 p-2 sm:p-2">
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 uppercase">First Name</label>
            <p className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase">
              {selectedOperator.firstname}
            </p>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 uppercase">Middle Name</label>
            <p className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase">
              {selectedOperator.middlename}
            </p>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 uppercase">Last Name</label>
            <p className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase">
              {selectedOperator.lastname}
            </p>
          </div>
        </div>

        
          {/* Contact Information  */}
       <div className="flex justify-between items-center pb-4 mb-4 rounded-t  border-b sm:mb-5 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
          
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 uppercase">Region</label>
            <p className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase">
              {selectedOperator.region}
            </p>
          </div>
          <div>
            <label htmlFor="city" className="block mb-2 text-sm font-medium text-gray-900 uppercase">City</label>
            <p className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase">
              {selectedOperator.city}
            </p>
          </div>
          <div>
            <label htmlFor="brgy" className="block mb-2 text-sm font-medium text-gray-900 uppercase">Barangay</label>
            <p className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase">
              {selectedOperator.brgy}
            </p>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 uppercase">Street</label>
            <p className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-[58.1rem] p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase">
              {selectedOperator.street}
            </p>
          </div>
        </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 uppercase">Contact Number</label>
                <p className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-[19rem] p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase">
                  {selectedOperator.contact}
                </p>
              </div>
          </div>

           {/* License Information  */}
       <div className="flex justify-between items-center pb-4 mb-4 rounded-t  border-b sm:mb-5 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900">License Information</h3>
        </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
        
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 uppercase">License No</label>
            <p className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase">
              {selectedOperator.license_no}
            </p>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 uppercase">Expiration Date</label>
            <p className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase">
              {selectedOperator.expiration_date ? selectedOperator.expiration_date.split('T')[0] : ''}
            </p>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 uppercase">Birth Date</label>
            <p className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase">
              {selectedOperator.birth_date ? selectedOperator.birth_date.split('T')[0] : ''}
            </p>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 uppercase">DL Codes</label>
            <p className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase">
              {selectedOperator.dl_codes}
            </p>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 uppercase">Conditions</label>
            <p className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase">
              {selectedOperator.conditions}
            </p>
          </div>
        </div>

          {/* EMERGENCY CONTACT  */}
        <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900">Incase of emergency</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 uppercase">First Name</label>
            <p className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase">
              {selectedOperator.emergency_firstname}
            </p>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 uppercase">Middle Name</label>
            <p className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase">
              {selectedOperator.emergency_middlename}
            </p>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 uppercase">Last Name</label>
            <p className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase">
              {selectedOperator.emergency_lastname}
            </p>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 uppercase">Region</label>
            <p className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase">
              {selectedOperator.emergency_region}
            </p>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 uppercase">City</label>
            <p className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase">
              {selectedOperator.emergency_city}
            </p>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 uppercase">Barangay</label>
            <p className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase">
              {selectedOperator.emergency_brgy}
            </p>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 uppercase">Street</label>
            <p className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-[58.1rem] p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase">
              {selectedOperator.emergency_street}
            </p>
          </div>  

        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 uppercase">Contact Number</label>
                <p className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-[19rem] p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase">
                  {selectedOperator.emergency_contact}
                </p>
              </div>
          </div>
        

      {/* EDIT MODAL */}
        <div className="flex space-x-4 justify-end">
          <button
            onClick={() => setIsEditMode(true)}
            className="border-2 border-transparent text-white bg-blue-500 p-2 rounded-lg flex items-center justify-center hover:bg-transparent hover:border-2 hover:border-blue-600 hover:text-blue-700 transition-colors duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              className="stroke-current"
              fill="none"
            >
              <path d="M14.0737 3.88545C14.8189 3.07808 15.1915 2.6744 15.5874 2.43893C16.5427 1.87076 17.7191 1.85309 18.6904 2.39232C19.0929 2.6158 19.4769 3.00812 20.245 3.79276C21.0131 4.5774 21.3972 4.96972 21.6159 5.38093C22.1438 6.37312 22.1265 7.57479 21.5703 8.5507C21.3398 8.95516 20.9446 9.33578 20.1543 10.097L10.7506 19.1543C9.25288 20.5969 8.504 21.3182 7.56806 21.6837C6.63212 22.0493 5.6032 22.0224 3.54536 21.9686L3.26538 21.9613C2.63891 21.9449 2.32567 21.9367 2.14359 21.73C1.9615 21.5234 1.98636 21.2043 2.03608 20.5662L2.06308 20.2197C2.20301 18.4235 2.27297 17.5255 2.62371 16.7182C2.97444 15.9109 3.57944 15.2555 4.78943 13.9445L14.0737 3.88545Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
              <path d="M13 4L20 11" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
              <path d="M14 22L22 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span className="ml-2">Update</span>
          </button>
          <button
            onClick={handleViewModalClose}
            className="border-2 border-transparent text-white bg-red-500 p-2 rounded-lg flex items-center justify-center hover:bg-transparent hover:border-2 hover:border-red-600 hover:text-red-700 transition-colors duration-300"
          >
            
            <span >Cancel</span>
          </button>
        </div>
        
      </div>
    ) : (
      <form onSubmit={handleViewSubmit} className="space-y-8 p-2 sm:p-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 uppercase">First Name</label>
            <input type="text" name="firstname" value={selectedOperator.firstname} onChange={handleViewChange} required
              className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase" placeholder="first name"/>
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 uppercase">Middle Name</label>
            <input type="text" name="middlename" value={selectedOperator.middlename} onChange={handleViewChange} className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase" placeholder="middle name" />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 uppercase">Last Name</label>
            <input type="text" name="lastname" value={selectedOperator.lastname} onChange={handleViewChange} required 
            className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase" placeholder="last name" />
          </div>
        </div>

         {/* Contact Information  */}
       <div className="flex justify-between items-center pb-4 mb-4 rounded-t  border-b sm:mb-5 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
        <div>
    <label htmlFor="region" className="block mb-2 text-sm font-medium text-gray-900 uppercase">Region</label>
    <select
        id="region"
        name="region"
        value={selectedOperator.region}
        onChange={Editdropdown}
        className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase"
    >
        <option value="" disabled>Select Region</option>
        {Object.keys(data).map((region) => (
            <option key={region} value={region}>
                {region}
            </option>
        ))}
    </select>
</div>

<div>
    <label htmlFor="city" className="block mb-2 text-sm font-medium text-gray-900 uppercase">City</label>
    <select
        id="city"
        name="city"
        value={selectedOperator.city}
        onChange={Editdropdown}
        disabled={!selectedOperator.region}
        className={`bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase ${!selectedOperator.region ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
        <option value="" disabled>Select City</option>
        {selectedOperator.region && data[selectedOperator.region] && Object.keys(data[selectedOperator.region]).map((city) => (
            <option key={city} value={city}>
                {city}
            </option>
        ))}
    </select>
</div>

<div>
    <label htmlFor="brgy" className="block mb-2 text-sm font-medium text-gray-900 uppercase">Barangay</label>
    <select
        id="brgy"
        name="brgy"
        value={selectedOperator.brgy}
        onChange={Editdropdown}
        disabled={!selectedOperator.city}
        className={`bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase ${!selectedOperator.city ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
        <option value="" disabled>Select Barangay</option>
        {selectedOperator.city && data[selectedOperator.region] && data[selectedOperator.region][selectedOperator.city] && data[selectedOperator.region][selectedOperator.city].map((brgy) => (
            <option key={brgy} value={brgy}>
                {brgy}
            </option>
        ))}
    </select>
</div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 uppercase">Street</label>
            <input type="text" name="street" value={selectedOperator.street} onChange={handleViewChange} required
              className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-[58.1rem] p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase" placeholder="street name" />
          </div>
        </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-900 uppercase">Contact Number</label>
          <input
            type="text"
            name="contact"
            value={selectedOperator.contact}
            onChange={handleViewChange}
            required
            maxLength={11}
            pattern="\d{11}"
            className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-[19rem] p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase"
            placeholder="contact no."
            onKeyPress={(e) => {
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
              }
            }}
          />
        </div>
    </div>

        {/* License Information */}
      <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900">License Information</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2" style={{marginBottom:'-1.2rem'}}>
          
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 uppercase">License No</label>
            <input type="text" name="license_no" value={selectedOperator.license_no} onChange={handleViewChange} required
             className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase" placeholder="license no." />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 uppercase">Birth Date</label>
            <input type="date" name="birth_date" value={selectedOperator.birth_date} onChange={handleViewChange} required
              className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase" placeholder="birth date" />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 uppercase">Expiration Date</label>
            <input type="date" name="expiration_date" value={selectedOperator.expiration_date} onChange={handleViewChange} required
              className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase" placeholder="expiration date" />
          </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 uppercase">DL Codes</label>
        <div className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase">
          {dlOptions.map(option => (
            <div key={option} className="flex items-center mb-2">
              <input
                type="checkbox"
                name="dl_codes"
                value={option}
                checked={selectedOperator?.dl_codes.includes(option) || false}
                onChange={handleViewChange}
                className="mr-2"
              />
              <label className="text-sm font-medium text-gray-900">{option}</label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 uppercase">Conditions</label>
        <div className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase">
          {conditionOptions.map(option => (
            <div key={option} className="flex items-center mb-2">
              <input
                type="checkbox"
                name="conditions"
                value={option}
                checked={selectedOperator?.conditions.includes(option) || false}
                onChange={handleViewChange}
                className="mr-2"
              />
              <label className="text-sm font-medium text-gray-900">{option}</label>
            </div>
          ))}
        </div>
      </div>
    </div>

       {/* EMERGENCY CONTACT  */}
      <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900">Incase of emergency</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2" style={{marginBottom:'-1.2rem'}}>
          
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 uppercase">First Name</label>
            <input type="text" name="emergency_firstname" value={selectedOperator.emergency_firstname} onChange={handleViewChange} required
              className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase" placeholder="emergency name" />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 uppercase">Middle Name</label>
            <input type="text" name="emergency_middlename" value={selectedOperator.emergency_middlename} onChange={handleViewChange} required
              className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase" placeholder="emergency middle name" />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 uppercase">Last Name</label>
            <input type="text" name="emergency_lastname" value={selectedOperator.emergency_lastname} onChange={handleViewChange} required
              className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase" placeholder="emergency last name" />
          </div>
        </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          <div>
    <label htmlFor="region" className="block mb-2 text-sm font-medium text-gray-900 uppercase">Region</label>
    <select
        id="region"
        name="emergency_region"
        value={selectedOperator.emergency_region}
        onChange={Editdropdown}
        className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase"
    >
        <option value="" disabled>Select Region</option>
        {Object.keys(data).map((region) => (
            <option key={region} value={region}>
                {region}
            </option>
        ))}
    </select>
</div>

<div>
    <label htmlFor="city" className="block mb-2 text-sm font-medium text-gray-900 uppercase">City</label>
    <select
        id="city"
        name="emergency_city"
        value={selectedOperator.emergency_city}
        onChange={Editdropdown}
        disabled={!selectedOperator.emergency_region}
        className={`bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase ${!selectedOperator.emergency_region ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
        <option value="" disabled>Select City</option>
        {selectedOperator.emergency_region && data[selectedOperator.emergency_region] && Object.keys(data[selectedOperator.emergency_region]).map((city) => (
            <option key={city} value={city}>
                {city}
            </option>
        ))}
    </select>
</div>

<div>
    <label htmlFor="brgy" className="block mb-2 text-sm font-medium text-gray-900 uppercase">Barangay</label>
    <select
        id="brgy"
        name="emergency_brgy"
        value={selectedOperator.emergency_brgy}
        onChange={Editdropdown}
        disabled={!selectedOperator.emergency_city}
        className={`bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase ${!selectedOperator.emergency_city ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
        <option value="" disabled>Select Barangay</option>
        {selectedOperator.emergency_city && data[selectedOperator.emergency_region] && data[selectedOperator.emergency_region][selectedOperator.emergency_city] && data[selectedOperator.emergency_region][selectedOperator.emergency_city].map((brgy) => (
            <option key={brgy} value={brgy}>
                {brgy}
            </option>
        ))}
    </select>
</div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 uppercase">Street</label>
            <input type="text" name="emergency_street" value={selectedOperator.emergency_street} onChange={handleViewChange} required
              className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-[58.1rem] p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase" placeholder="street name" />
          </div>
        </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <div>
  <label className="block mb-2 text-sm font-medium text-gray-900 uppercase">Contact Number</label>
  <input
    type="text"
    name="emergency_contact"
    value={selectedOperator.emergency_contact}
    onChange={(e) => {
      const value = e.target.value;
      if (/^\d*$/.test(value) && value.length <= 11) {
        handleViewChange(e);
      }
    }}
    required
    className="bg-gray-50 border-2 border-gray-300 text-gray-900 text-sm rounded-lg block w-[19rem] p-2.5 placeholder-gray-400 focus:border-green-600 focus:outline-none uppercase"
    placeholder="contact no."
  />
</div>
    </div>

    <div className="flex space-x-4 justify-end">
        <button type="submit"className="border-2 border-transparent text-white bg-blue-500 p-2 w-full sm:w-auto  rounded-lg flex items-center justify-center hover:bg-transparent hover:border-2 hover:border-blue-600 hover:text-blue-700 transition-colors duration-300" style={{width:'6rem'}} >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              className="stroke-current"
              fill="none"
            >
              <path d="M17.4776 9.01106C17.485 9.01102 17.4925 9.01101 17.5 9.01101C19.9853 9.01101 22 11.0294 22 13.5193C22 15.8398 20.25 17.7508 18 18M17.4776 9.01106C17.4924 8.84606 17.5 8.67896 17.5 8.51009C17.5 5.46695 15.0376 3 12 3C9.12324 3 6.76233 5.21267 6.52042 8.03192M17.4776 9.01106C17.3753 10.1476 16.9286 11.1846 16.2428 12.0165M6.52042 8.03192C3.98398 8.27373 2 10.4139 2 13.0183C2 15.4417 3.71776 17.4632 6 17.9273M6.52042 8.03192C6.67826 8.01687 6.83823 8.00917 7 8.00917C8.12582 8.00917 9.16474 8.38194 10.0005 9.01101" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              <path d="M12 21L12 13M12 21C11.2998 21 9.99153 19.0057 9.5 18.5M12 21C12.7002 21 14.0085 19.0057 14.5 18.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span className="ml-2">Save</span>
          </button>
          <button onClick={handleViewModalClose}
            className="border-2 border-transparent text-white bg-red-500 p-2 rounded-lg flex items-center justify-center hover:bg-transparent hover:border-2 hover:border-red-600 hover:text-red-700 transition-colors duration-300"
          >
            
            <span >Cancel</span>
          </button>
        </div>
      </form>
    )}
  </Modal>
)}


{isConfirmArchiveOpen && (
  <div className="fixed inset-0 flex items-center justify-center ml-48">
    <div className="bg-red-100 p-4 rounded-lg shadow-lg w-full max-w-sm mx-auto">
      <div className="flex bg-red-100 rounded-lg p-4 mb-4 text-sm text-red-700" role="alert">
        <svg className="w-5 h-5 inline mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
        </svg>
        <div>
          <span className="font-medium">Confirm Archive</span> Are you sure you want to archive this user?
        </div>
      </div>
      <div className="flex justify-end space-x-2 mt-4">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          onClick={confirmArchiveUser}
        >
          Yes
        </button>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          onClick={() => setIsConfirmArchiveOpen(false)}
        >
          No
        </button>
      </div>
    </div>
  </div>
)}
{isAlertVisible && (
  <div className="fixed bottom-4 right-4 flex bg-green-100 rounded-lg p-4 mb-4 text-sm text-green-700" role="alert">
    <svg className="w-5 h-5 inline mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
    </svg>
    <div>
      <span className="font-medium"></span> Operator archived successfully.
    </div>
  </div>
)}


{isRegisterAlertVisible && (
        <div className="fixed bottom-4 right-4 flex bg-blue-100 rounded-lg p-4 mb-4 text-sm text-blue-700" role="alert">
          <svg className="w-5 h-5 inline mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
          </svg>
          <div>
            <span className="font-medium"></span> Operator Registered successfully.
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverForm;