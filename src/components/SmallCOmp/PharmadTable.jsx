import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import Select from "react-select";
import { doc, updateDoc, getDoc, getDocs, collection } from "firebase/firestore";
import { db, auth } from "../firebase/firebase";

const PharmadTable = ({ medfileId }) => {
  const [sortBy, setSortBy] = useState("newest");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modisopen, setmodisopen] = useState(false);
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const [modalMedicineIndex, setModalMedicineIndex] = useState(null);
  const [modalDiagnosisIndex, setModalDiagnosisIndex] = useState(null);
  const [despensedBy, setDespensedBy] = useState("");
  const [despensedMed, setDespensedMed] = useState("");
  const [doctor, setDoctor] = useState(null);
  const [diagnoses, setDiagnoses] = useState([]);

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "duration", label: "Specific Duration" },
  ];

  const handleSortChange = (selectedOption) => {
    setSortBy(selectedOption.value);
    if (selectedOption.value === "duration") {
      setmodisopen(true);
    }
  };

  const handleModClose = () => {
    setmodisopen(false);
  };

  const handleModalClose = () => {
    setModalIsOpen(false);
  };

  const handleCheckboxChange = (diagnosisIndex, medicineIndex) => {
    setModalMedicineIndex(medicineIndex);
    setModalDiagnosisIndex(diagnosisIndex);
    setModalIsOpen(true);
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const getDoctorDetails = async () => {
        const doctorRef = doc(db, "verified_doctors", user.uid);
        const docSnap = await getDoc(doctorRef);

        if (docSnap.exists()) {
          setDoctor(docSnap.data());
        } else {
          console.log("No such doctor found!");
        }
      };

      getDoctorDetails();
    }
  }, []);

  useEffect(() => {
    const fetchDiagnoses = async () => {
      try {
        const medfileDocRef = doc(db, "medfile", medfileId);
        const medfileDocSnap = await getDoc(medfileDocRef);

        if (medfileDocSnap.exists()) {
          const medfileData = medfileDocSnap.data();
          setDiagnoses(medfileData.diagnosis || []);
        } else {
          console.log("No such medical file found!");
          setDiagnoses([]);
        }
      } catch (error) {
        console.error("Error fetching diagnoses:", error);
      }
    };

    if (medfileId) {
      fetchDiagnoses();
    } else {
      setDiagnoses([]);
    }
  }, [medfileId]);

  const handleModalSubmit = async () => {
    try {
      if (
        diagnoses &&
        modalDiagnosisIndex !== null &&
        modalMedicineIndex !== null &&
        medfileId
      ) {
        const updatedDiagnoses = [...diagnoses];
        const diagnosis = updatedDiagnoses[modalDiagnosisIndex];
        const medicine = diagnosis.medicine[modalMedicineIndex];
        if (diagnosis && medicine) {
          const updatedMedicine = {
            ...medicine,
            despensed: true,
            despensedby: despensedBy,
            despensedmed: despensedMed,
          };

          const updatedDiagnosis = {
            ...diagnosis,
            medicine: diagnosis.medicine.map((med, index) =>
              index === medicine.mindex ? updatedMedicine : med
            ),
          };

          updatedDiagnoses[diagnosis.dindex] = updatedDiagnosis;

          await updateDoc(doc(db, "medfile", medfileId), {
            diagnosis: updatedDiagnoses,
          });

          setModalIsOpen(false);
          setDespensedBy("");
          setDespensedMed("");
        } else {
          console.error("Invalid diagnosis or medicine data.");
        }
      } else {
        console.error("Missing required data.");
      }
    } catch (error) {
      console.error("Error updating medicine:", error);
    }
  };

  const filteredDiagnoses = React.useMemo(() => {
    if (sortBy === "newest") {
      return [...diagnoses].sort(
        (a, b) => b.dateTime.seconds - a.dateTime.seconds
      );
    } else if (sortBy === "oldest") {
      return [...diagnoses].sort(
        (a, b) => a.dateTime.seconds - b.dateTime.seconds
      );
    } else if (sortBy === "duration") {
      if (minDate && maxDate) {
        const minDateObj = new Date(minDate);
        const maxDateObj = new Date(maxDate);
        return diagnoses.filter((diagnosis) => {
          const diagnosisDate = new Date(diagnosis.dateTime.seconds * 1000);
          return diagnosisDate >= minDateObj && diagnosisDate <= maxDateObj;
        });
      }
      return diagnoses;
    } else {
      return diagnoses;
    }
  }, [sortBy, diagnoses, minDate, maxDate]);

  return (
    <div>
      <table
        style={{
          borderCollapse: "collapse",
          fontFamily: "Roboto Mono",
          width: "80%",
          marginTop: "1rem",
          border: "2px solid #000",
          wordWrap: "break-word",
          marginLeft: "10%",
        }}
      >
        {/* Table header */}
        <thead>
          <tr>
            <th
              style={{
                borderBottom: "2px solid #000",
                borderRight: "2px solid #000",
                padding: "0.5rem",
                wordWrap: "break-word",
              }}
            >
              Diagnosis
            </th>
            <th
              style={{
                borderBottom: "2px solid #000",
                borderRight: "2px solid #000",
                padding: "0.5rem",
                wordWrap: "break-word",
              }}
            >
              Doctor
            </th>
            <th
              style={{
                borderBottom: "2px solid #000",
                borderRight: "2px solid #000",
                padding: "0.5rem",
                wordWrap: "break-word",
              }}
            >
              Medicines
            </th>
            <th
              style={{
                borderBottom: "2px solid #000",
                padding: "0.5rem",
                wordWrap: "break-word",
              }}
            >
              Date
              <Select
                options={sortOptions}
                value={sortOptions.find((option) => option.value === sortBy)}
                onChange={handleSortChange}
                styles={{
                  control: (provided) => ({
                    ...provided,
                    border: "none",
                    borderRadius: "0",
                    boxShadow: "none",
                    padding: "0",
                    minHeight: "2rem",
                    height: "100%",
                  }),
                  menu: (provided) => ({
                    ...provided,
                    border: "none",
                    boxShadow: "none",
                  }),
                  menuList: (provided) => ({
                    ...provided,
                    padding: "0",
                  }),
                  option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected ? "#000" : "transparent",
                    color: state.isSelected ? "#FFF":"#000", "&:hover": {
                      backgroundColor: "#000",
                      color: "#fff",
                    },
                  }),
                }}
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredDiagnoses &&
            filteredDiagnoses.map((diagnosis) => (
              <tr key={diagnosis.dindex} style={{ fontSize: "110%" }}>
                <td
                  style={{
                    borderRight: "2px solid #000",
                    padding: "0.5rem",
                    wordWrap: "break-word",
                  }}
                >
                  {diagnosis.diagnosis}
                </td>
                <td
                  style={{
                    borderRight: "2px solid #000",
                    padding: "0.5rem",
                    wordWrap: "break-word",
                  }}
                >
                  {diagnosis.doctor.name} <br /> {diagnosis.doctor.email} <br />
                  <b>{diagnosis.doctor.speciality} </b>
                  {diagnosis.dindex}
                </td>
                <td
                  style={{
                    padding: "0.5rem",
                    wordWrap: "break-word",
                    borderRight: "2px solid #000",
                  }}
                >
                  {diagnosis.medicine.map((medicine, index) => (
                    <div key={index}>
                      <b><font style={{display:"none"}}>{medicine.mindex}</font> {medicine.name}</b> - {medicine.dosage}{" "}
                      {medicine.type} {medicine.days} days <br />{" "}
                      <b>
                        {medicine.despensed ? "Despensed by" : "Not Despensed"}{" "}
                        {medicine.despensedby} - {medicine.despensedmed}{" "}
                      </b>
                      {!medicine.despensed && (
                        <div>
                          <input
                            type="checkbox"
                            onChange={() => handleCheckboxChange(diagnosis.dindex, medicine.mindex)}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </td>
                <td style={{ padding: "0.5rem", wordWrap: "break-word" }}>
                  {new Date(diagnosis.dateTime.seconds * 1000).toLocaleString()}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <Modal
        isOpen={modisopen}
        onRequestClose={handleModClose}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.75)",
          },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            borderRadius: "0",
            border: "none",
            padding: "0px 30px",
            maxWidth: "500px",
            width: "60%",
            height: "70%",
          },
        }}
      >
        <div style={{ padding: "1rem", display: "flex", flexDirection: "column" }}>
          <h2 style={{ marginTop: "0" }}>Select Date Range</h2>
          <div style={{ display: "flex", marginTop: "1rem" }}>
            <input
              type="datetime-local"
              value={minDate}
              onChange={(e) => setMinDate(e.target.value)}
              style={{ flexGrow: 1, marginRight: "12px" }}
            />
            <input
              type="datetime-local"
              value={maxDate}
              onChange={(e) => setMaxDate(e.target.value)}
              style={{ flexGrow: 1 }}
            />
          </div>
          <button
            style={{
              backgroundColor: "#000",
              color: "#fff",
              border: "none",
              borderRadius: "0.25rem",
              padding: "0.5rem 1rem",
              cursor: "pointer",
              marginTop: "1rem",
            }}
            onClick={handleModClose}
          >
            Apply
          </button>
          <button onClick={handleModClose}>Close</button>
        </div>
      </Modal>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.75)",
          },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            borderRadius: "0",
            border: "none",
            padding: "0px 30px",
            maxWidth: "500px",
            width: "60%",
            height: "70%",
          },
        }}
      >
        <h2>Dispense Medicine</h2>
        <div>
          <label htmlFor="despensedBy">Dispensed By:</label>
          <input
            type="text"
            id="despensedBy"
            value={despensedBy}
            onChange={(e) => setDespensedBy(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="despensedMed">Dispensed Medicine:</label>
          <input
            type="text"
            id="despensedMed"
            value={despensedMed}
            onChange={(e) => setDespensedMed(e.target.value)}
          />
        </div>
        <button onClick={handleModalSubmit}>Submit</button>
        <button onClick={() => setModalIsOpen(false)}>Cancel</button>
      </Modal>
    </div>
  );
};

export default PharmadTable;