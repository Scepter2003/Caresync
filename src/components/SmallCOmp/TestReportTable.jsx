import { useState, useEffect } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, getDocs } from "firebase/firestore";
import { db, storage } from "../firebase/firebase";
import Modal from "react-modal";
import Select from "react-select";

// TestReportTable component with props medfileId
const TestReportTable = ({ medfileId }) => {
  const [testReports, setTestReports]= useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");

  // Sort options array
  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "duration", label: "Specific Duration" },
  ];

  // Handle sort change function
  const handleSortChange = (selectedOption) => {
    setSortBy(selectedOption.value);
    if (selectedOption.value === "duration") {
      setModalIsOpen(true);
    }
  };

  // Handle modal close function
  const handleModalClose = () => {
    setModalIsOpen(false);
  };

  // Fetch test reports function
  const fetchTestReports = async () => {
    const querySnapshot = await getDocs(collection(db, "medfile", medfileId, "testReports"));
    const fetchedTestReports = [];
    querySnapshot.forEach((doc) => {
      fetchedTestReports.push({ ...doc.data(), id: doc.id });
    });
    const filteredTestReports = fetchedTestReports.filter((testReport) => {
      if (minDate && maxDate) {
        const testReportDate = new Date(testReport.date.seconds * 1000);
        return testReportDate >= minDate && testReportDate <= maxDate;
      }
      return true;
    });
    const sortedTestReports = filteredTestReports.sort((a, b) => {
      if (sortBy === "newest") {
        return b.date.seconds - a.date.seconds;
      } else if (sortBy === "oldest") {
        return a.date.seconds - b.date.seconds;
      } else if (sortBy === "duration") {
        return 0;
      }
    });
    setTestReports(sortedTestReports);
  };

  // Component useEffect
  useEffect(() => {
    if (medfileId) {
      fetchTestReports();
    }
  }, [medfileId, sortBy, minDate, maxDate]);

  // Fetch test reports when modalIsOpen changes
  useEffect(() => {
    if (modalIsOpen) {
      fetchTestReports();
    }
  }, [modalIsOpen]);

  return (
    <table>
      <thead>
        <tr>
          <th>Test Name</th>
          <th>Doctor's Name</th>
          <th>Doctor's Email</th>
          <th>Clinic Name</th>
          <th>Comment</th>
          <th>Date
            {/* Select component for sorting */}
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
          <th>Download</th>
          <th>View</th>
        </tr>
      </thead>
      <tbody>
        {testReports.map((testReport) => (
          <tr key={testReport.id}>
            <td>{testReport.testName}</td>
            <td>{testReport.name}</td>
            <td>{testReport.email}</td>
            <td>{testReport.clinicName}</td>
            <td>{testReport.comment}</td>
            <td>{testReport.date.toDate().toLocaleString("en-US", { date: "long", time: "short" })}</td>
            <td>
              <a href={testReport.downloadURL} download>
                Download
              </a>
            </td>
            <td>
              <a href={testReport.downloadURL} target="_blank" rel="noopener noreferrer">
                View
              </a>
            </td>
          </tr>
        ))}
      </tbody>
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
          {/* Apply button */}
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
    </table>
  );
};

export default TestReportTable;