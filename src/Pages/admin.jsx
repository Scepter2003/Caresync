  import React, { useEffect, useState } from "react";
  import {
    db1,
    auth,
    generateRandomPassword,
  } from "../components/firebase/firebase";
  import {
    ref,
    onValue,
    update,
    remove,
    set,  
    get,
    snapshot,
  } from "firebase/database";
  import { collection, doc, setDoc, getDoc, getDocs } from "firebase/firestore";
  import { db } from "../components/firebase/firebase";
  import { createUserWithEmailAndPassword } from "firebase/auth";
  import emailjs from "@emailjs/browser";
import Addadmin from "./addadmin";
import Addnews from "./addnews";
import Addreporter from "./addreporter";

  const AdminPage = () => {
    const [shouldFinalApprove, setShouldFinalApprove] = useState(false);
    const [userCount, setUserCount] = useState(0);
    const [docCount, setDocCount] = useState(0);
    const [pharmaCount, setPharmaCount] = useState(0);
    const [verifiedDoctorsCount, setVerifiedDoctorsCount] = useState(0);
    const [verifiedPharmasCount, setVerifiedPharmasCount] = useState(0);
    const [selectedTable, setSelectedTable] = useState("doctor");
    const [unverifiedDoctors, setUnverifiedDoctors] = useState([]);
    const [unverifiedPharma, setUnverifiedPharma] = useState([]);
    const [doctorsToApprove, setDoctorsToApprove] = useState([]);
    const [pharmatoapprove, setPharmasToApprove] = useState([]);

    useEffect(() => {
      const unverifiedDoctorsRef = ref(db1, "unverified_doctors");
      const unverifiedPharmaRef = ref(db1, "unverified_pharma");
      const verifiedDoctorsRef = collection(db, "verified_doctors");
      const verifiedPharmasRef = collection(db, "verified_pharma");
      const UsersRef = collection(db, "users");

      const unsubscribeDoctors = onValue(unverifiedDoctorsRef, (snapshot) => {
        const doctors = snapshot.val() || [];
        const doctorValues = Object.values(doctors);
        setUnverifiedDoctors(doctorValues);
        setDoctorsToApprove(
          doctorValues.filter((doctor) => !doctor.licenseverified)
        );
      });

      const unsubscribePharma = onValue(unverifiedPharmaRef, (snapshot) => {
        const pharmas = snapshot.val() || [];
        const pharmaValues = Object.values(pharmas);
        setUnverifiedPharma(pharmaValues);
        setPharmasToApprove(
          pharmaValues.filter((pharma) => !pharma.licenceverified)
        );
      });

      const unsubscribeDocCount = onValue(ref(db1, "doctors"), (snapshot) => {
        setDocCount(snapshot.numChildren());
      });

      const getVerifiedDoctorsCount = async () => {
        const querySnapshot = await getDocs(verifiedDoctorsRef);
        setVerifiedDoctorsCount(querySnapshot.size);
      };

      getVerifiedDoctorsCount();

      const getUsersCount = async () => {
        const querySnapshot = await getDocs(UsersRef);
        setUserCount(querySnapshot.size);
      };
      getUsersCount();

      const getverifiedPharmasCount = async () => {
        const querySnapshot = await getDocs(verifiedPharmasRef);
        setVerifiedPharmasCount(querySnapshot.size);
      };
      getverifiedPharmasCount();

      const unsubscribePharmaCount = onValue(ref(db1, "pharmas"), (snapshot) => {
        setPharmaCount(snapshot.numChildren());
      });

      return () => {
        unsubscribeDoctors();
        unsubscribePharma();
        unsubscribeDocCount();
        unsubscribePharmaCount();
        if (shouldFinalApprove) {
          finalApprove();
        }
      };
    }, [shouldFinalApprove]);

    const finalApprove = async (docid) => {
      try {
        console.log(docid);
        const docRef = ref(db1, `unverified_doctors/${docid}`);
        let docSnap;

        const unsubscribeDoc = onValue(
          docRef,
          (snapshot) => {
            docSnap = snapshot;
          },
          {
            onlyOnce: true,
          }
        );

        await new Promise((resolve) => setTimeout(resolve, 1000));

        unsubscribeDoc();

        if (docSnap.exists()) {
          const userData = docSnap.val();
          const email = userData.email;
          const name = userData.firstName;
          const nam = userData.lastName;
          const emailParts = email.split("@");
          const newEmail = `${emailParts[0]}@doc.caresync.com`;
          console.log("New email:", newEmail);

          // Generate a random password
          const rpassword = Math.random().toString(36).slice(-8);
          console.log("Random password:", rpassword);

          // Authenticate with Firebase using the new email and password
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            newEmail,
            rpassword
          );
          const user = userCredential.user;
          // Move the data to a new Firestore database
          const newDocRef = doc(db, `verified_doctors/${user.uid}`);
          const newUserData = { ...userData, hasChangedPassword: false, workemail: newEmail };
          await setDoc(newDocRef, newUserData);

          // Delete the data from the old Firestore database
          await remove(docRef);

          /* const templateParams = {
            subject: "Account Created Successfully",
            nameq: name,
            namer: nam,
            recipient: email ,
            message: `Your account has been created successfully after verifying all the data sent through signup application form. \n Your Login details are given below. \nLogin-Id : ${newEmail} \nPassword : ${rpassword}\n You can change yoour password after your login.`
            };
            emailjs.send('service_4mdueyv', 'template_ipny01f', templateParams, '_PJ3-S34LJ3-pqxIp')
          .then((response) => {
            console.log('Email sent successfully!', response.status, response.text);
          }, (error) => {
            console.log('Error sending email:', error);
          });
    */
          console.log("Data moved to new Firestore database");
        } else {
          console.log("Document not found in unverified collection");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const finalApprovep = async (pharmaid) => {
      try {
        console.log(pharmaid);
        const phaRef = ref(db1, `unverified_pharma/${pharmaid}`);
        let phaSnap;

        const unsubscribeDoc = onValue(
          phaRef,
          (snapshot) => {
            phaSnap = snapshot;
          },
          {
            onlyOnce: true,
          }
        );

        await new Promise((resolve) => setTimeout(resolve, 1000));

        unsubscribeDoc();

        if (phaSnap.exists()) {
          const userData = phaSnap.val();
          const email = userData.email;
          const emailParts = email.split("@");
          const newEmail = `${emailParts[0]}@pharma.caresync.com`;
          console.log("New email:", newEmail);

          // Generate a random password
          const rpassword = Math.random().toString(36).slice(-8);
          console.log("Random password:", rpassword);

          // Authenticate with Firebase using the new email and password
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            newEmail,
            rpassword
          );
          const user = userCredential.user;
          // Move the data to a new Firestore database
          const newDocRef = doc(db, `verified_pharma/${user.uid}`);
          const newUserData = { ...userData, hasChangedPassword: false, workemail: newEmail };
          await setDoc(newDocRef, newUserData);

          // Delete the data from the old Firestore database
          await remove(phaRef);

          console.log("Data moved to new Firestore database");
        } else {
          console.log("Document not found in unverified collection");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const handleTableChange = (event) => setSelectedTable(event.target.value);

    const approve = async (docid, attribute) => {
      try {
        await update(ref(db1, `unverified_doctors/${docid}`), {
          [attribute]: true,
          [`${attribute}_timestamp`]: new Date().toISOString(),
        });
        setDoctorsToApprove(
          doctorsToApprove.filter((doctor) => doctor.docid !== docid)
        );
      } catch (error) {
        console.error(`Error approving ${attribute}:`, error);
      }
    };

    const reject = async (docid, attribute) => {
      try {
        await update(ref(db1, `unverified_doctors/${docid}`), {
          [attribute]: "Rejected",
          [`${attribute}_timestamp`]: new Date().toISOString(),
        });
        setDoctorsToApprove(
          doctorsToApprove.filter((doctor) => doctor.docid !== docid)
        );

        // Delete the user's document
        await remove(ref(db1, `unverified_doctors/${docid}`));
      } catch (error) {
        console.error(`Error rejecting ${attribute}:`, error);
      }
    };

    const approvepp = async (pharmaid, attribute) => {
      try {
        await update(ref(db1, `unverified_pharma/${pharmaid}`), {
          [attribute]: true,
          [`${attribute}_timestamp`]: new Date().toISOString(),
        });
        setPharmasToApprove(
          pharmatoapprove.filter((pharma) => pharma.pharmaid !== pharmaid)
        );
      } catch (error) {
        console.error(`Error approving ${attribute}:`, error);
      }
    };

    const rejectpp = async (pharmaid, attribute) => {
      try {
        await update(ref(db1, `unverified_pharma/${pharmaid}`), {
          [attribute]: "Rejected",
          [`${attribute}_timestamp`]: new Date().toISOString(),
        });
        setPharmasToApprove(
          pharmatoapprove.filter((pharma) => pharma.pharmaid !== pharmaid)
        );

        // Delete the user's document
        await remove(ref(db1, `unverified_pharma/${pharmaid}`));
      } catch (error) {
        console.error(`Error rejecting ${attribute}:`, error);
      }
    };

    const logout = () => auth.signOut();

    return (
      <>
        <div style={{ margin: "0", backgroundColor:"#6bdef5" }}>
          <h1>
            Admin Page <button onClick={logout} style={{marginLeft:"75%"}}>Log out</button>
          </h1>

          <table style={{ height: "10%", width: "100%", textAlign: "center" }}>
            <tr>
              <th> Users </th>
              <th>
                {" "}
                Verified <br /> Doctors
              </th>
              <th>
                {" "}
                Unverified <br /> Doctors
              </th>
              <th>
                {" "}
                Verified <br /> Pharma
              </th>
              <th>
                {" "}
                Unverified <br /> Pharma
              </th>
            </tr>
            <tr style={{ fontSize: "4rem", fontFamily: "fantasy" }}>
              <td> {userCount} </td>
              <td> {verifiedDoctorsCount} </td>
              <td> {unverifiedDoctors.length} </td>
              <td> {verifiedPharmasCount} </td>
              <td> {unverifiedPharma.length} </td>
            </tr>
          </table>
        </div>
        <div><Addadmin/></div>
        <div><Addreporter/></div>
        
        <select
          value={selectedTable}
          onChange={handleTableChange}
          style={{
            width: "100%",
            textAlign: "center",
            height: "2rem",
            fontFamily: "sans-serif",
            fontSize: "1rem",
            backgroundColor: "#e0eca7",
          }}
        >
          <option value="doctor">Doctor List</option>
          <option value="pharma">Pharma List</option>
        </select>

        {selectedTable === "doctor" && (
          <div style={{ width: "100%" }}>
            <p>Doctor list</p>
            <table
              style={{
                width: "100%",
                height: "30%",
                border: "1px solid",
                borderCollapse: "collapse",
                textAlign: "center",
              }}
            >
              <thead>
                <tr style={{ border: "1px solid", borderCollapse: "collapse" }}>
                  <th style={{ border: "1px solid", borderCollapse: "collapse" }}>
                    Name
                  </th>
                  <th style={{ border: "1px solid", borderCollapse: "collapse" }}>
                    License Number
                  </th>
                  <th style={{ border: "1px solid", borderCollapse: "collapse" }}>
                    Work Setting
                  </th>
                  <th style={{ border: "1px solid", borderCollapse: "collapse" }}>
                    Contact Details
                  </th>
                  <th style={{ border: "1px solid", borderCollapse: "collapse" }}>
                    Address
                  </th>
                  <th style={{ border: "1px solid", borderCollapse: "collapse" }}>
                    Specialization
                  </th>
                  <th style={{ border: "1px solid", borderCollapse: "collapse" }}>
                    Final
                  </th>
                </tr>
              </thead>
              <tbody>
                {unverifiedDoctors.map((doctor) => (
                  <tr
                    key={doctor.email}
                    style={{ border: "1px solid", borderCollapse: "collapse" }}
                  >
                    <td
                      style={{ border: "1px solid", borderCollapse: "collapse" }}
                    >
                      {doctor.firstName} {doctor.lastName}
                    </td>
                    <td
                      style={{ border: "1px solid", borderCollapse: "collapse" }}
                    >
                      {doctor.licensenumber} <br/>
                      {doctor.licenseverified === true ? (
                        <span>Approved</span>
                      ) : doctor.licenseverified === "Rejected" ? (
                        <span>Rejected</span>
                      ) : (
                        <>
                          {!doctor.licenseverified && (
                            <>
                              <button
                                onClick={() =>
                                  approve(doctor.docid, "licenseverified")
                                }
                                style={{backgroundColor:"#c7d5f0", borderColor:"#c7d5f0"}}
                              >
                                Approve
                              </button>
                              <br /> 
                              <button
                                onClick={() =>
                                  reject(doctor.docid, "licenseverified")
                                }
                                style={{backgroundColor:"#e67a7a", borderColor:"#e67a7a"}}
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </>
                      )}
                    </td>
                    <td
                      style={{ border: "1px solid", borderCollapse: "collapse" }}
                    >
                      {doctor.worksetting} <br/>
                      {doctor.doctorverified === true ? (
                        <span>Approved</span>
                      ) : doctor.doctorverified === "Rejected" ? (
                        <span>Rejected</span>
                      ) : (
                        <>
                          {!doctor.doctorverified && (
                            <>
                              <button
                                onClick={() =>
                                  approve(doctor.docid, "doctorverified")
                                }
                                style={{backgroundColor:"#c7d5f0", borderColor:"#c7d5f0"}}
                              >
                                Approve
                              </button>
                              <br />
                              <button
                                onClick={() =>
                                  reject(doctor.docid, "doctorverified")
                                }
                                style={{backgroundColor:"#e67a7a", borderColor:"#e67a7a"}}
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </>
                      )}
                    </td>
                    <td
                      style={{ border: "1px solid", borderCollapse: "collapse" }}
                    >
                      {doctor.email}<br/>
                      {doctor.contact}
                    </td>
                    <td
                      style={{ border: "1px solid", borderCollapse: "collapse" }}
                    >{`${doctor.settingname}, ${doctor.plotno}, ${doctor.street}, ${doctor.landmark}, ${doctor.pin}, ${doctor.state}, ${doctor.country}`}</td>
                    <td
                      style={{ border: "1px solid", borderCollapse: "collapse" }}
                    >
                      {doctor.speciality}{" "}<br/>
                      {doctor.settingverified === true ? (
                        <span>Approved</span>
                      ) : doctor.settingverified === "Rejected" ? (
                        <span>Rejected</span>
                      ) : (
                        <>
                          {!doctor.settingverified && (
                            <>
                              <button
                                onClick={() =>
                                  approve(doctor.docid, "settingverified")
                                }
                                style={{backgroundColor:"#c7d5f0", borderColor:"#c7d5f0"}}
                              >
                                Approve
                              </button>
                              <br />
                              <button
                                onClick={() =>
                                  reject(doctor.docid, "settingverified")
                                }
                                style={{backgroundColor:"#e67a7a", borderColor:"#e67a7a"}}
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </>
                      )}
                    </td>
                    <td
                      style={{ border: "1px solid", borderCollapse: "collapse" }}
                    >
                      <button
                        onClick={() => {
                          finalApprove(doctor.docid);
                        }}
                        style={{backgroundColor:"#c7d5f0", borderColor:"#c7d5f0"}}
                      >
                        Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedTable === "pharma" && (
          <div>
            <p>Pharma List</p>
            <table style={{
                width: "100%",
                height: "30%",
                border: "1px solid",
                borderCollapse: "collapse",
                textAlign: "center",
              }}>
              <thead>
                <tr style={{ border: "1px solid", borderCollapse: "collapse" }}>
                  <th style={{ border: "1px solid", borderCollapse: "collapse" }}>Name</th>
                  <th style={{ border: "1px solid", borderCollapse: "collapse" }}>License Number</th>
                  <th style={{ border: "1px solid", borderCollapse: "collapse" }}>Email</th>
                  <th style={{ border: "1px solid", borderCollapse: "collapse" }}>Phone</th>
                  <th style={{ border: "1px solid", borderCollapse: "collapse" }}>Address</th>
                  <th style={{ border: "1px solid", borderCollapse: "collapse" }}>Final</th>
                </tr>
              </thead>
              <tbody >
                {unverifiedPharma.map((pharma) => (
                  <tr key={pharma.email}>
                    <td style={{ border: "1px solid", borderCollapse: "collapse" }}>
                      {pharma.firstName} {pharma.lastName}
                    </td>
                    <td style={{ border: "1px solid", borderCollapse: "collapse" }}>
                      {pharma.licensenumber} <br/>
                      {pharma.licenseverified === true ? (
                        <span>Approved</span>
                      ) : pharma.licenseverified === "Rejected" ? (
                        <span>Rejected</span>
                      ) : (
                        <>
                          {!pharma.licenseverified && (
                            <>
                              <button
                                onClick={() =>
                                  approvepp(pharma.pharmaid, "licenseverified")
                                }
                                style={{backgroundColor:"#c7d5f0", borderColor:"#c7d5f0"}}
                              >
                                Approve
                              </button><br/>
                              <button
                                onClick={() =>
                                  rejectpp(pharma.pharmaid, "licenseverified")
                                }
                                style={{backgroundColor:"#e67a7a", borderColor:"#e67a7a"}}
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </>
                      )}
                    </td>
                    <td style={{ border: "1px solid", borderCollapse: "collapse" }}>{pharma.email}</td>
                    <td style={{ border: "1px solid", borderCollapse: "collapse" }}>{pharma.contact}</td>
                    <td style={{ border: "1px solid", borderCollapse: "collapse" }}>
                      {`${pharma.settingname}, ${pharma.plotno}, ${pharma.street}, ${pharma.landmark}, ${pharma.pin}, ${pharma.state}, ${pharma.country}`}<br/>
                      {pharma.pharmaverified === true ? (
                        <span>Approved</span>
                      ) : pharma.pharmaverified === "Rejected" ? (
                        <span>Rejected</span>
                      ) : (
                        <>
                          {!pharma.pharmaverified && (
                            <>
                              <button
                                onClick={() =>
                                  approvepp(pharma.pharmaid, "pharmaverified")
                                }
                                style={{backgroundColor:"#c7d5f0", borderColor:"#c7d5f0"}}
                              >
                                Approve
                              </button>
                              <br/>
                              <button
                                onClick={() =>
                                  rejectpp(pharma.pharmaid, "pharmaverified")
                                }
                                style={{backgroundColor:"#e67a7a", borderColor:"#e67a7a"}}
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </>
                      )}
                    </td>
                    
                    <td style={{ border: "1px solid", borderCollapse: "collapse" }}>
                      <button
                        onClick={() => {
                          finalApprovep(pharma.pharmaid);
                        }}
                        style={{backgroundColor:"#c7d5f0", borderColor:"#c7d5f0"}}
                      >
                        Approve
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </>
    );
  };

  export default AdminPage;
