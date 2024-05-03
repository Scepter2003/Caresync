import React from "react";
import { useUserData } from "../Contexts/UserDataContext";
const Profile = () => {
  const userData = useUserData();
  return (
    <>
    {userData &&(
      <div>
      <table className="tbl" style={{fontSize:"large"}} >
        <tr>
            <td className="tdr" style={{backgroundColor:"#bfd9df", height:"100px", borderRadius:"50%", boxShadow:"inset 0 -5px 5px -5px rgba(0, 0, 0, 0.5)", width:"100px", alignItems:"center", alignContent:"center" }}> 
            <font style={{ fontSize:"300%", paddingLeft:"10%"}}>UM</font>
        </td>
        <td className="tddr" style={{ paddingLeft:"5%"}}>User Name <br/> {userData.email}<br/><button>View Card</button></td>
        </tr>
        <tr style={{}}>
          <td colSpan="2" style={{borderTop:"1px inset"}}> <button className="edit-button">Edit</button></td>
        </tr>
        <tr>
          <td>Name:</td>
          <td>{userData.fname} {userData.lname}</td>
        </tr>
        <tr>
          <td>Phone:</td>
          <td>{userData.phone}</td>
        </tr>
        <tr>
          <td>Email:</td>
          <td>{userData.email}</td>
        </tr>
        <tr>
          <td>Blood Group</td>
          <td>{userData.bloodGroup}</td>
        </tr>
        <tr>
          <td>DOB</td>
          <td>{userData.dateOfBirth}</td>
        </tr>
        <tr>
          <td>State</td>
          <td>{userData.state}</td>
        </tr>
        <tr>
          <td>City</td>
          <td>{userData.city}</td>
        </tr>
        <tr>
          <td>Pincode</td>
          <td>{userData.pincode}</td>
        </tr>
        <tr>
          <td>Area</td>
          <td>{userData.area}</td>
        </tr>
        <tr>
          <td>Plot Number</td>
          <td>{userData.plotNumber}</td>
        </tr>
        <tr>
          <td>File Id</td>
          <td>{userData.fileID}</td>
        </tr>
        </table>
      </div>
    )}
    </>
  );
};

export default Profile;
