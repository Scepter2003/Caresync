import React, { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";

const Searchfeed = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [doctors, setDoctors] = React.useState([]);
  const [pharmas, setPharmas] = React.useState([]);
  const [selectedOption, setSelectedOption] = React.useState("doctor");

  const handleSearch = async (e) => {
    e.preventDefault();
    const selectedCollection = selectedOption === "doctor" ? "verified_doctors" : "verified_pharmas";
    const q = query(collection(db, selectedCollection), where("workemail", ">=", searchTerm), where("workemail", "<=", searchTerm + "\uf8ff"));
    const snapshot = await getDocs(q);
    const searchResults = [];
    snapshot.forEach((doc) => {
      searchResults.push({ id: doc.id, ...doc.data() });
    });
    selectedOption === "doctor" ? setDoctors(searchResults) : setPharmas(searchResults);
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  return (
    <html>
      <body>
    <div >
      <form onSubmit={handleSearch} style={{margin:"0% 20%", display:"flex", flexDirection:"column", borderRadius:"5%", padding:"5%"}}>
        
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for a patient or doctor"
          style={{boxShadow:"0 1px"}}
        />
        <div style={{alignItems:"center", margin:"0% 30%"}}>
        <label>
          Doctor
          <input type="radio" value="doctor" checked={selectedOption === "doctor"} onChange={handleOptionChange} />
        </label>
        <label style={{marginLeft:"30%"}}>
          Pharmacy
          <input type="radio" value="pharma" checked={selectedOption === "pharma"} onChange={handleOptionChange} />
        </label></div><div style={{ alignItems:"center"}}>
        <button type="submit" style={{backgroundColor:"#5aadce", width:"5em", margin:"1% 41.5%", alignContent:"center"}}>Search</button>
        </div>
      </form>
      {doctors.length > 0}
      {doctors.map((doctor) => (
        <div key={doctor.id} style={{textAlign:"justify", margin:"0% 25%", backgroundColor:"#80d0ea", padding:"10px 10px", borderRadius:"0.5rem", boxShadow:"0px 0px 10px"}}>
          <table style={{wordWrap:"break-word", padding:"2em" , fontSize:"large", border:"0px 0px 10px"}}>
            <tr>
              <td style={{textAlign:"left"}}><b>Name: </b></td>
              <td style={{textAlign:"left"}}> {doctor.firstName} {doctor.lastName}</td>
            </tr>
            <tr>
              <td style={{textAlign:"left"}}><b>Speciality: </b></td>
              <td style={{textAlign:"left"}}> {doctor.speciality}</td>
            </tr>
            <tr>
              <td style={{textAlign:"left"}}><b>Email: </b></td>
              <td style={{textAlign:"left"}}> {doctor.email}</td>
            </tr>
            <tr>
              <td style={{textAlign:"left"}}><b>Work Setting: </b></td>
              <td style={{textAlign:"left"}}> {doctor.worksetting} {doctor.settingname}</td>
            </tr>
            <tr>
              <td style={{textAlign:"left"}}><b>Work Address: </b></td>
              <td style={{textAlign:"left"}}> {doctor.street}, {doctor.landmark}, {doctor.state}, {doctor.country}</td>
            </tr>
          </table>
          {/* display other doctor fields as needed */}
        </div>
      ))}
      {pharmas.length > 0 && <h2>Pharmacies</h2>}
      {pharmas.map((pharma) => (
        <div key={pharma.id}>
          <p>{pharma.name}</p>
          <p>{pharma.workemail}</p>
          {/* display other pharma fields as needed */}
        </div>
      ))}
    </div>
    </body>
    </html>
  );
};

export default Searchfeed;