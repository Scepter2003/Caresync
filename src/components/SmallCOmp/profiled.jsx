import React from "react";
import { useDoctorData } from "../Contexts/doctorcontext";

const Profiled = () => {
  const doctordata = useDoctorData();
  return (
    <>
    {doctordata &&(
      <div>
      <table className="tbl" style={{fontSize:"large"}} >
        <tr>
            <td className="tdr" style={{backgroundColor:"#bfd9df", height:"100px", borderRadius:"50%", boxShadow:"inset 0 -5px 5px -5px rgba(0, 0, 0, 0.5)", width:"100px", alignItems:"center", alignContent:"center" }}> 
            <font style={{ fontSize:"300%", paddingLeft:"10%"}}>UM</font>
        </td>
        <td className="tddr" style={{ paddingLeft:"5%"}}>User Name <br/> {doctordata.email}<br/><button>View Card</button></td>
        </tr>
        <tr style={{}}>
          <td colSpan="2" style={{borderTop:"1px inset"}}> <button className="edit-button">Edit</button></td>
        </tr>
        <tr>
          <td>Name:</td>
          <td>{doctordata.firstName} {doctordata.lastName}</td>
        </tr>
        <tr>
          <td>Phone:</td>
          <td>{doctordata.contact}</td>
        </tr>
        <tr>
          <td>Email:</td>
          <td>{doctordata.email}</td>
        </tr>
        <tr>
          <td>License</td>
          <td>{doctordata.licensenumber}</td>
        </tr>
        <tr>
          <td>Speciality</td>
          <td>{doctordata.speciality}</td>
        </tr>
        <tr>
          <td>Work Setting</td>
          <td>{doctordata.worksetting}</td>
        </tr>
        <tr>
          <td>City</td>
          <td>{doctordata.city}</td>
        </tr>
        <tr>
          <td>Pincode</td>
          <td>{doctordata.pin}</td>
        </tr>
        <tr>
          <td>Area</td>
          <td>{doctordata.street}</td>
        </tr>
        <tr>
          <td>Plot Number</td>
          <td>{doctordata.plotno}</td>
        </tr>
        </table>
      </div>
    )}
    </>
  );
};

export default Profiled;
