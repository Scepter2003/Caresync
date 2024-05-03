import React, { useState } from "react";
import Modal from "react-modal";
import Select from "react-select";
const DiagnosisTable = ({ diagnoses }) => {
  const [sortBy, setSortBy] = useState("newest");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "duration", label: "Specific Duration" },
  ];

  const handleSortChange = (selectedOption) => {
    setSortBy(selectedOption.value);
    if (selectedOption.value === "duration") {
      setModalIsOpen(true);
    }
  };

  const handleModalClose = () => {
    setModalIsOpen(false);
  };

  const filteredDiagnoses = React.useMemo(() => {
    if (sortBy === "newest") {
      return [...diagnoses].sort((a, b) => b.dateTime.seconds - a.dateTime.seconds);
    } else if (sortBy === "oldest") {
      return [...diagnoses].sort((a, b) => a.dateTime.seconds - b.dateTime.seconds);
    } else if (sortBy === "duration") {
      if (minDate && maxDate) {
        const minDateObj = new Date(minDate);
        const maxDateObj = new Date(maxDate);
        return diagnoses.filter(diagnosis => {
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
      <table style={{ borderCollapse: "collapse", fontFamily: "Roboto Mono", width: "80%", marginTop: "1rem", border: "2px solid #000", wordWrap:"break-word", marginLeft:"10%" }}>
        <thead>
          <tr>
            <th style={{ borderBottom: "2px solid #000", borderRight: "2px solid #000", padding: "0.5rem", wordWrap: "break-word" }}>Diagnosis</th>
            <th style={{ borderBottom: "2px solid #000", borderRight: "2px solid #000", padding: "0.5rem", wordWrap: "break-word" }}>Doctor</th>
            <th style={{ borderBottom: "2px solid #000",borderRight: "2px solid #000", padding: "0.5rem", wordWrap: "break-word" }}>Medicines</th>
            <th style={{ borderBottom: "2px solid #000", padding: "0.5rem", wordWrap: "break-word" }}>
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
                    height:"100%",
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
                    backgroundColor: state.isSelected? "#000" : "transparent",
                    color: state.isSelected ? "#fff" : "#000",
                    "&:hover": {
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
          {filteredDiagnoses && filteredDiagnoses.map((diagnosis, index) => (
            <tr key={index} style={{fontSize:"110%"}}>
              <td style={{ borderRight: "2px solid #000", padding: "0.5rem", wordWrap: "break-word" }}>{diagnosis.diagnosisType}{diagnosis.diagnosis}</td>
              <td style={{ borderRight: "2px solid #000", padding: "0.5rem", wordWrap: "break-word" }}>
                {diagnosis.doctor.name} <br/> {diagnosis.doctor.email} <br/><b>{diagnosis.doctor.speciality} </b>
              </td>
              <td style={{ padding: "0.5rem", wordWrap: "break-word", borderRight: "2px solid #000", }}>
                {diagnosis.medicine.map((medicine, index) => (
                  <div key={index}>
                    <b>{medicine.name}</b> - {medicine.dosage} {medicine.type} {medicine.days} days <br/> <b>{medicine.despensed ? "Despensed by" : "Not Despensed"} {medicine.despensedby} - {medicine.despensedmed} </b>
                  </div>
                ))}
              </td>
              <td style={{ padding: "0.5rem", wordWrap: "break-word" }}>{new Date(diagnosis.dateTime.seconds * 1000).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleModalClose}
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
            height:"70%",
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
              style={{ flexGrow: 1, marginRight: "12px", }}
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
            onClick={handleModalClose}
          >
            Apply
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default DiagnosisTable;