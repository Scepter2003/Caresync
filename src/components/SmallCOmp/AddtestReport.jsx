import { useState , useEffect} from "react";
import { v4 as uuidv4 } from "uuid";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, getDoc,doc } from "firebase/firestore";
import { db, storage, auth } from "../firebase/firebase";
const user = auth.currentUser;
const AddTestReport = ({ medfileId }) => {
const [file, setFile] = useState(null);
const [testName, setTestName] = useState("");
const [doctorName, setDoctorName] = useState("");
const [clinicName, setClinicName] = useState("");
const [date, setDate] = useState(new Date());
const [comment, setComment] = useState("");
const [isLoading, setIsLoading] = useState(false);
const [doctor, setDoctor] = useState(null);

useEffect(() => {
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
}, [user]);

const handleFileChange = (event) => {
setFile(event.target.files[0]);
};

const handleTestNameChange = (event) => {
setTestName(event.target.value);
};

const handleDoctorNameChange = (event) => {
setDoctorName(event.target.value);
};

const handleClinicNameChange = (event) => {
setClinicName(event.target.value);
};

const handleDateChange = (event) => {
setDate(event.target.value);
};

const handleCommentChange = (event) => {
setComment(event.target.value);
};

const handleSubmit = async (event) => {
event.preventDefault();

if (!file || !comment) {
alert("Please fill in all required fields");
return;
}

setIsLoading(true);
try {
// Create a reference to the location where you want to store the file
const storageRef = ref(storage, `medfile/${medfileId}/${file.name}`);

// Upload the file to Firebase Storage
await uploadBytes(storageRef, file);

// Get the download URL for the uploaded file
const downloadURL = await getDownloadURL(storageRef);

// Add the test report as a subcollection to the medfile document
await addDoc(collection(db, "medfile", medfileId, "testReports"), {
id: uuidv4(),
downloadURL,
comment,
date: new Date(),
testName,
name: doctor.firstName + " " + doctor.lastName,
email: doctor.workemail,
clinicName,
});

setFile(null);
setComment("");
setTestName("");
setDoctorName("");
setClinicName("");
setDate(new Date());

alert("Test report added successfully");
  } catch (error) {
    console.error("Error adding test report:", error);
    alert("Error adding test report. Please try again.");
  } finally {
    setIsLoading(false);
  }
};

return (
<form onSubmit={handleSubmit} style={{display:"flex", flexDirection:"column", maxWidth:"25rem", padding:"1em", fontSize:"110%"}}>

  <input type="file" id="file" onChange={handleFileChange} required />
  <label htmlFor="testName">Test Name:</label>
  <input type="text" style={{height:"1.5em"}} id="testName" value={testName} onChange={handleTestNameChange} required />
  <label htmlFor="clinicName">Clinic Name:</label>
  <input type="text" id="clinicName" value={clinicName} onChange={handleClinicNameChange} required />
  <label htmlFor="comment">Comment:</label>
  <textarea id="comment" value={comment} onChange={handleCommentChange} required></textarea>
  <br/>
  <button type="submit" disabled={isLoading} style={{height:"2em"}}>
      {isLoading ? "Adding Test Report..." : "Add Test Report"}
    </button>
</form>
);
};

export default AddTestReport;