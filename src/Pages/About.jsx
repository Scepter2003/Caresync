import React from 'react';
import Navbar from './Navbar';
import { useState } from 'react';
import Profile from '../components/SmallCOmp/Profile';
const Sidebar = ({ options, onSelectOption, selectedOption }) => {
  return (
    
    <div className="sidebar" style={{width: "200px", backgroundColor: "#b9cdd5", padding: "20px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)"}}>
      {options.map((option) => (
        <div
          key={option}
          className={`sidebar-option ${selectedOption === option ? 'selected' : ''}`}
          onClick={() => onSelectOption(option)}
        >
          {option}
        </div>
      ))}
    </div>
  );
};



const MainContent = ({ selectedOption }) => {
  return (
    <div className="main-content">
      <h2>{selectedOption}</h2>
      {/* Add content for each option */}
      {selectedOption === 'Profile' && <p>  <Profile /> </p>}
      {selectedOption === 'Guardians' && <p>Guardians content</p>}
      {selectedOption === 'Last Diagnosis' && <p>Last Diagnosis content </p>}
      {selectedOption === 'Upload Prescription' && <p>Upload Prescription................................................................................................................................................................................................................................................................................................................................................................................................</p>}
      {selectedOption === 'Test Reports' && <p>Test Reports content</p>}
      {selectedOption === 'Medicine History' && <p>Medicine History content</p>}
    </div>
  );
};


const About = () => {
  const [selectedOption, setSelectedOption] = useState('Profile');

  const options = [
    'Profile',
    'Guardians',
    'Last Diagnosis',
    'Upload Prescription',
    'Test Reports',
    'Medicine History',
  ];

  const handleSelectOption = (option) => {
    setSelectedOption(option);
  };

  return (
    <>
    <Navbar />
    <div className="dashboard-container" style={{display:"flex"}}>
      <Sidebar options={options} onSelectOption={handleSelectOption} selectedOption={selectedOption} />
      <MainContent selectedOption={selectedOption} />
    </div>
    </>
  );
};

export default About;