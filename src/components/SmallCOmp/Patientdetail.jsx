import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const Patientdetails =({medfileId}) =>{
    const [medfileData, setMedfileData] = useState(null);
    const [userfileData, setUserfileData] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [diagnosisInput, setDiagnosisInput] = useState("");
    const [doctorName, setDoctorName] = useState("");
    const [doctorEmail, setDoctorEmail] = useState("");
    const [medicineName, setMedicineName] = useState("");
    const [medicineDosage, setMedicineDosage] = useState("");
    const [medicineType, setMedicineType] = useState("");
    const [selectedTab, setSelectedTab] = useState(null);
useEffect(() => {
    if (medfileId) {
      setIsSearching(true);
      const fetchData = async () => {
        const medfileDocRef = doc(db, "medfile", medfileId);
        const medfileDocSnap = await getDoc(medfileDocRef);

        if (medfileDocSnap.exists()) {
          const medfileData = medfileDocSnap.data();

          const userDocRef = doc(db, "users", medfileData.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            setMedfileData(medfileData);
            setUserfileData([userDocSnap.data()]);
          } else {
            setMedfileData(null);
            setUserfileData([]);
          }
        } else {
          setMedfileData(null);
          setUserfileData([]);
        }
      };

      fetchData();
    } else {
      setIsSearching(false);
    }
  }, [medfileId]);

  return(<>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "2rem",
            width:"70%",
          }}
        >
          <h3 style={{ marginTop: "2rem" }}>Userfile Data:</h3>
          <table
            style={{
              borderCollapse: "collapse",
              fontFamily: "Roboto Mono",
              width: "80%",
              marginTop: "1rem",
              textAlign: "left",
              fontSize:"120%"
            }}
          >
            <thead>
              <tr>
                <th style={{ borderBottom: "2px solid #000" }}>Field</th>
                <th style={{ borderBottom: "2px solid #000" }}>Data</th>
              </tr>
            </thead>
            <tbody>
              {userfileData.map((item, index) => (
                <>
                  <tr key={`userfileData-${index}-name`}>
                    <td>Full Name</td>
                    <td>
                      {item.fname} {item.lname}
                    </td>
                  </tr>
                  <tr key={`userfileData-${index}-gender`}>
                    <td>Gender</td>
                    <td>{item.gender}</td>
                  </tr>
                  <tr key={`userfileData-${index}-email`}>
                    <td>Email</td>
                    <td>{item.email}</td>
                  </tr>
                  <tr key={`userfileData-${index}-phone`}>
                    <td>Contact No.</td>
                    <td>{item.phone}</td>
                  </tr>
                  <tr key={`userfileData-${index}-address`}>
                    <td>Address</td>
                    <td>
                      {item.plotNumber}, {item.area}, {item.pincode},{""}
                      {item.city}, {item.state}
                    </td>
                  </tr>
                  <tr key={`userfileData-${index}-dob`}>
                    <td>Date Of Birth</td>
                    <td>{item.dateOfBirth}</td>
                  </tr>
                  <tr key={`userfileData-${index}-bloodGroup`}>
                    <td>Blood Group</td>
                    <td>{item.bloodGroup}</td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
          <h3 style={{ marginTop: "5rem" }}>Medfile Data:</h3>
          <table
            style={{
              borderCollapse: "collapse",
              fontFamily: "Roboto Mono",
              width: "80%",
              marginTop: "1rem",textAlign: "left",
              fontSize:"120%"
            }}
          >
            <thead>
              <tr>
                <th style={{ borderBottom: "2px solid #000" }}>Field</th>
                <th style={{ borderBottom: "2px solid #000" }}>Data</th>
              </tr>
            </thead>
            <tbody>
              {medfileData && (
                <>
                  <tr>
                    <td>UID</td>
                    <td>{medfileData.uid}</td>
                  </tr>
                  <tr>
                    <td>Symptoms</td>
                    <td>{medfileData.fileId}</td>
                  </tr>
                  <tr>
                    <td>Treatment</td>
                    <td>{medfileData.treatment}</td>
                  </tr>
                  <tr>
                    <td>Medicines</td>
                    <td>{medfileData.medicines}</td>
                  </tr>
                  <tr>
                    <td>Remarks</td>
                    <td>{medfileData.remarks}</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </>
  );
};

export default Patientdetails;