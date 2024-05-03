import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const UpdateMedicine = ({ fileId, diagnosisIndex, medicineIndex }) => {
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const medfileDocRef = doc(db, "medfile", fileId);
      const medfileDocSnap = await getDoc(medfileDocRef);

      if (medfileDocSnap.exists()) {
        const medfileData = medfileDocSnap.data();
        setMedicines(medfileData.diagnosis[diagnosisIndex].medicine);
      } else {
        console.log("No such medfile found!");
      }
    };

    fetchData();
  }, [fileId, diagnosisIndex]);

  const handleUpdate = async (updatedMedicine) => {
    try {
      const newMedicines = medicines.map((medicine, index) =>
        index === medicineIndex ? updatedMedicine : medicine
      );

      await updateDoc(doc(db, "medfile", fileId), {
        diagnosis: [
          {
            ...medicines[diagnosisIndex],
            medicine: newMedicines,
          },
        ],
      });

      alert("Medicine updated successfully");
    } catch (error) {
      console.error("Error updating medicine:", error);
      alert("Error updating medicine. Please try again.");
    }
  };

  return (
    <div>
      <input
        type="text"
        value={medicines[medicineIndex].name}
        onChange={(e) => {
          const updatedMedicine = { ...medicines[medicineIndex] };
          updatedMedicine.name = e.target.value;
          handleUpdate(updatedMedicine);
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

      <input
        type="number"
        value={medicines[medicineIndex].days}
        onChange={(e) => {
          const updatedMedicine = { ...medicines[medicineIndex] };
          updatedMedicine.days = e.target.value;
          handleUpdate(updatedMedicine);
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
        type="text"
        value={medicines[medicineIndex].despensedBy}
        onChange={(e) => {
          const updatedMedicine = { ...medicines[medicineIndex] };
          updatedMedicine.despensedBy = e.target.value;
          handleUpdate(updatedMedicine);
        }}
        placeholder="Despensed By"
        style={{
          padding: "0.5rem",
          marginBottom: "1rem",
          fontSize: "1rem",
          borderRadius: "0.25rem",
          border: "1px solid #ccc",
        }}
      />
      <input
        type="text"
        value={medicines[medicineIndex].despensedMed}
        onChange={(e) => {
          const updatedMedicine = { ...medicines[medicineIndex] };
          updatedMedicine.despensedMed = e.target.value;
          handleUpdate(updatedMedicine);
        }}
        placeholder="Despensed Medicine"
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
        checked={medicines[medicineIndex].despensed}
        onChange={(e) => {
          const updatedMedicine = { ...medicines[medicineIndex] };
          updatedMedicine.despensed = e.target.checked;
          handleUpdate(updatedMedicine);
        }}
        style={{
          marginBottom: "1rem",
        }}
      />
    </div>
  );
};

export default UpdateMedicine;