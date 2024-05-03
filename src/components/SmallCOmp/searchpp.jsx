import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import DiagnosisTable from "./DiagnosisTable";
import PatientDetails from "./Patientdetail";
import { auth } from "../firebase/firebase";
import AddTestReport from "./AddtestReport";
import TestReportTable from "./TestReportTable";
import Navbarp from "../../Pages/Navbarp";
import PharmadTable from "./PharmadTable";
const user = auth.currentUser;
const Searchpp = () => {
  const [medfileId, setMedfileId] = useState("");
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
  const [doctor, setDoctor] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [medicineTypes, setMedicineTypes] = useState([
    "Oral Medications (Tablets/Capsules)",
    "Topical Medications (Ointments/Creams)",
    "Inhaled Medications",
    "Injectable Medications",
    "Liquid Medications (Syrups/Suspensions)",
    "Bandages and Dressings",
    "Medical Devices",
  ]);
  const [dosageOptions, setDosageOptions] = useState([
    "Monthly",
    "Yearly",
    "Quarterly",
    "Weekly",
    "Every other week",
    "Before breakfast (1/D)",
    "After breakfast (1/D)",
    "Before lunch (1/D)",
    "After lunch (1/D)",
    "Before dinner (1/D)",
    "After dinner (1/D)",
    "With breakfast and dinner (2/D)",
    "With breakfast, lunch, and dinner (3/D)",
    "Before breakfast and dinner (2/D)",
    "Before lunch and dinner (2/D)",
    "Before breakfast, lunch, and dinner (3/D)",
    "After breakfast and dinner (2/D)",
    "After lunch and dinner (2/D)",
    "After breakfast, lunch, and dinner (3/D)",
    "Before and after breakfast (2/D)",
    "Before and after lunch (2/D)",
    "Before and after dinner (2/D)",
    "Before and after breakfast, lunch, and dinner (6/D)",
  ]);
  const [recognition, setRecognition] = useState(null);
  const [resultText, setResultText] = useState("");

  const startRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in your browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript;
      setResultText(result);
    };

    recognition.onerror = (event) => {
      console.log("Error:", event.error);
    };

    recognition.start();
    setRecognition(recognition);
  };
  const addMedicine = () => {
    setMedicines([
      ...medicines,
      { name: "", dosage: "", type: "", days: "", despensed: false },
    ]);
  };
  useEffect(() => {
    if (user) {
      const getDoctorDetails = async () => {
        const doctorRef = doc(db, "verified_pharmas", user.uid);
        const docSnap = await getDoc(doctorRef);

        if (docSnap.exists()) {
          setDoctor(docSnap.data());
        } else {
          console.log("No such doctor found!");
        }
      };

      getDoctorDetails();
    }
  }, [user]);

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
  const addDiagnosis = async () => {
    if (!medfileData) {
      alert("Please search for a patient first");
      return;
    }

    if (!medfileData.diagnosis) {
      medfileData.diagnosis = [];
    }

    const diagnosis = {
      diagnosis: diagnosisInput || resultText,
      doctor: {
        name: doctor.firstName + " " + doctor.lastName,
        email: doctor.email,
        speciality: doctor.speciality,
      },
      medicine: medicines,
      dateTime: new Date(),
    };

    try {
      const newMedfileData = {
        ...medfileData,
        diagnosis: [...medfileData.diagnosis, diagnosis],
      };
      await updateDoc(doc(db, "medfile", medfileId), newMedfileData);
      setDiagnosisInput("");
      setDoctorName("");
      setDoctorEmail("");
      setMedicines([]);
      alert("Diagnosis added successfully");
    } catch (error) {
      console.error("Error adding diagnosis:", error);
      alert("Error adding diagnosis. Please try again.");
    }
  };

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };
  const handleCancelClick = () => {
    setIsSearching(false);
    setMedfileId("");
    setMedfileData(null);
    setUserfileData([]);
    setSelectedTab(null);
  };

  return (
    <div>
      <Navbarp />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          margin: "40%% 5%",
          height: "100vh",
        }}
      >
        <div
          style={{
            justifyContent: "space-around",
            marginTop: "5%",
            width: "80%",
          }}
        >
          <input
            type="text"
            value={medfileId}
            placeholder="Enter Med-File ID"
            onChange={(e) => setMedfileId(e.target.value)}
            style={{
              padding: "0.5rem",
              marginBottom: "1rem",
              fontSize: "1rem",
              borderRadius: "0.25rem",
              border: "1px solid #ccc",
              marginRight: "2%",
              marginLeft: "27%",
            }}
          />
          <button
            onClick={() => setMedfileId(medfileId)}
            style={{
              padding: "0.5rem 1rem",
              fontSize: "1rem",
              borderRadius: "0.25rem",
              border: "none",
              backgroundColor: "#4CAF50",
              color: "white",
              cursor: "pointer",
              marginRight: "2%",
            }}
          >
            Search
          </button>

          {isSearching && (
            <button
              onClick={handleCancelClick}
              style={{
                padding: "0.5rem",
                fontSize: "1rem",
                borderRadius: "0.25rem",
                border: "1px solid #ccc",
                backgroundColor: "transparent",
                cursor: "pointer",
                top: "10px",
                right: "10px",
              }}
            >
              Cancel
            </button>
          )}
        </div>
        {isSearching && (
          <div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                width: "100%",
                marginTop: "2rem",
              }}
            >
              <div
                onClick={() => handleTabClick("patient-details")}
                style={{
                  border: "1px solid #ccc",
                  padding: "1rem",
                  cursor: "pointer",
                  borderRadius: "0.25rem",
                }}
              >
                Patient Details
              </div>
              <div
                onClick={() => handleTabClick("diagnosis-history")}
                style={{
                  border: "1px solid #ccc",
                  padding: "1rem",
                  cursor: "pointer",
                  borderRadius: "0.25rem",
                }}
              >
                Diagnosis History
              </div>
              <div
                onClick={() => handleTabClick("add-diagnosis")}
                style={{
                  border: "1px solid #ccc",
                  padding: "1rem",
                  cursor: "pointer",
                  borderRadius: "0.25rem",
                }}
              >
                Add Diagnosis
              </div>
            </div>
          </div>
        )}
        {isSearching && selectedTab === "patient-details" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "2rem",
              width: "100%",
              overflowHeight: "scroll",
              height: "80vh",
            }}
          >
            <PatientDetails medfileId={medfileId} />
          </div>
        )}
        {isSearching && selectedTab === "diagnosis-history" && (
          <div style={{ overflowHeight: "scroll", height: "80vh" }}>
            <h3 style={{ marginTop: "2rem", textAlign: "center" }}>
              Diagnosis History:
            </h3>
            <table>
              <tbody>
                {medfileData && (
                  <>
                    <tr>
                      <td>
                        <PharmadTable diagnoses={medfileData.diagnosis} medfileId={medfileId}/>
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        )}
        {isSearching && selectedTab === "add-diagnosis" && (
          <div
            style={{
              overflowHeight: "scroll",
              height: "80vh",
              width: "80vw",
              justifyContent: "center",
              marginLeft: "16%",
            }}
          >
            <h3 style={{ marginTop: "2rem", textAlign: "center" }}>
              Add Diagnosis:
            </h3>
            <table
              style={{
                borderCollapse: "collapse",
                fontFamily: "Roboto Mono",
                width: "80%",
                marginTop: "1rem",
              }}
            >
              <thead>
                <tr>
                  <th style={{ borderBottom: "2px solid #000" }}>Field</th>
                  <th style={{ borderBottom: "2px solid #000" }}>Input</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ paddingRight: "12px" }}>Diagnosis</td>
                  <td>
                    <input
                      type="text"
                      defaultValue={diagnosisInput}
                      onChange={(e) => setDiagnosisInput(e.target.value)}
                      placeholder={resultText}
                      style={{
                        padding: "0.5rem",
                        marginBottom: "1rem",
                        fontSize: "1rem",
                        borderRadius: "0.25rem",
                        border: "1px solid #ccc",
                        flexGrow: 1,
                      }}
                    />
                    <button
                      className="btn btn-primary mt-3"
                      onClick={startRecognition}
                      style={{
                        padding: "0.5rem 1rem",
                        fontSize: "1rem",
                        borderRadius: "0.25rem",
                        marginLeft: "1rem",
                      }}
                    >
                      Start Speech
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>Medicine</td>
                  <td>
                    {medicines.map((medicine, index) => (
                      <div key={index}>
                        <input
                          type="text"
                          value={medicine.name}
                          onChange={(e) => {
                            const newMedicines = [...medicines];
                            newMedicines[index].name = e.target.value;
                            setMedicines(newMedicines);
                          }}
                          placeholder="Medicine Name"
                          style={{
                            padding: "0.5rem",
                            marginBottom: "1rem",
                            fontSize: "1rem",
                            borderRadius: "0.25rem",
                            border: "1px solid #ccc",
                          }}
                        />
                        <select
                          value={medicine.type}
                          onChange={(e) => {
                            const newMedicines = [...medicines];
                            newMedicines[index].type = e.target.value;
                            setMedicines(newMedicines);
                          }}
                          style={{
                            padding: "0.5rem",
                            marginBottom: "1rem",
                            fontSize: "1rem",
                            borderRadius: "0.25rem",
                            border: "1px solid #ccc",
                            placeholder: "Medicine Type",
                          }}
                        >
                          <option value="">Select medicine type</option>
                          {medicineTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                        <select
                          value={medicine.dosage}
                          onChange={(e) => {
                            const newMedicines = [...medicines];
                            newMedicines[index].dosage = e.target.value;
                            setMedicines(newMedicines);
                          }}
                          placeholder="Dosage"
                          style={{
                            padding: "0.5rem",
                            marginBottom: "1rem",
                            fontSize: "1rem",
                            borderRadius: "0.25rem",
                            border: "1px solid #ccc",
                          }}
                        >
                          <option value="">Select medicine Dosage</option>
                          {dosageOptions.map((dosage) => (
                            <option key={dosage} value={dosage}>
                              {dosage}
                            </option>
                          ))}
                        </select>

                        <input
                          type="number"
                          value={medicine.days}
                          onChange={(e) => {
                            const newMedicines = [...medicines];
                            newMedicines[index].days = e.target.value;
                            setMedicines(newMedicines);
                          }}
                          placeholder="Days"
                          style={{
                            padding: "0.5rem",
                            marginBottom: "1rem",
                            fontSize: "1rem",
                            borderRadius: "0.25rem",
                            border: "1px solid #ccc",
                          }}
                        />
                        <input
                          type="checkbox"
                          checked={medicine.despensed}
                          onChange={(e) => {
                            const newMedicines = [...medicines];
                            newMedicines[index].despensed = e.target.checked;
                            setMedicines(newMedicines);
                          }}
                          style={{
                            marginBottom: "1rem",
                          }}
                        />
                        <button
                          onClick={() => {
                            const newMedicines = [...medicines];
                            newMedicines.splice(index, 1);
                            setMedicines(newMedicines);
                          }}
                          style={{
                            padding: "0.5rem 1rem",
                            fontSize: "1rem",
                            borderRadius: "0.25rem",
                            border: "none",
                            backgroundColor: "#4CAF50",
                            color: "white",
                            cursor: "pointer",
                            justifyContent: "center",
                            marginLeft: "30%",
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addMedicine}
                      style={{
                        padding: "0.5rem 1rem",
                        fontSize: "1rem",
                        borderRadius: "0.25rem",
                        border: "none",
                        backgroundColor: "#4CAF50",
                        color: "white",
                        cursor: "pointer",
                        justifyContent: "center",
                      }}
                    >
                      Add Medicine
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            <button
              onClick={addDiagnosis}
              style={{
                padding: "0.5rem 1rem",
                fontSize: "1rem",
                borderRadius: "0.25rem",
                border: "none",
                backgroundColor: "#4CAF50",
                color: "white",
                cursor: "pointer",
                justifyContent: "center",
                marginLeft: "30%",
              }}
            >
              Add Diagnosis
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Searchpp;
