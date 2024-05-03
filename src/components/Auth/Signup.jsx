import React, { useRef, useState, useContext, useEffect } from "react";
import { useAuth } from "../Contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../firebase/firebase";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

export default function Signup() {
  const [loading, setLoading] = useState(false);
  const [aadharExists, setAadharExists] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const aadharRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const phoneRef = useRef();
  const bloodGroupRef = useRef();
  const dateOfBirthRef = useRef();
  const stateRef = useRef();
  const cityRef = useRef();
  const pincodeRef = useRef();
  const areaRef = useRef();
  const plotNumberRef = useRef();
  const FnameRef = useRef();
  const LnameRef = useRef();
  const GenderRef = useRef();
  const guardianAadharRef1 = useRef();
  const guardianNameRef1 = useRef();
  const guardianEmailRef1 = useRef();
  const guardianPhoneRef1 = useRef();
  const guardianStateRef1 = useRef();
  let fileId;

  useEffect(() => {
    const checkAadhar = async () => {
      const aadhar = aadharRef.current.value;
      const q = query(collection(db, "users"), where("aadhar", "==", aadhar));
      const querySnapshot = await getDocs(q);
      setAadharExists(querySnapshot.empty);
    };
    checkAadhar();
  }, [aadharRef.current?.value]);

  const validateDateOfBirth = (dateOfBirth) => {
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 18);
    return dateOfBirth <= minDate;
  };

  const createMedfile = async (uid) => {
    let isFileIdUnique = false;

    while (!isFileIdUnique) {
      fileId = Math.floor(Math.random() * 1000000000000);
      const q = query(collection(db, "medfile"), where("fileID", "==", fileId));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        isFileIdUnique = true;
      }
    }

    await setDoc(doc(collection(db, "medfile"), fileId.toString()), {
      uid: uid,
      state: stateRef.current.value,
      city: cityRef.current.value,
      fileId: fileId,
      timestamp: serverTimestamp(),
    });

    console.log(`New medfile created with ID: ${fileId}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Email:", emailRef.current.value);
  console.log("Password:", passwordRef.current.value);
  console.log("Confirm Password:", passwordConfirmRef.current.value);
  console.log("Aadhaar Number:", aadharRef.current.value);
  console.log("Phone Number:", phoneRef.current.value);
  console.log("Gender:", GenderRef.current.value);
  console.log("Date of Birth:", dateOfBirthRef.current.value);
  console.log("State:", stateRef.current.value);
  console.log("City:", cityRef.current.value);
  console.log("Pincode:", pincodeRef.current.value);
  console.log("Area:", areaRef.current.value);
  console.log("Plot Number:", plotNumberRef.current.value);
  console.log("First Name:", FnameRef.current.value);
  console.log("Last Name:", LnameRef.current.value);
  console.log("Blood Group:", bloodGroupRef.current.value);
  console.log("Guardian 1 Aadhaar Number:", guardianAadharRef1.current.value);
  console.log("Guardian 1 Name:", guardianNameRef1.current.value);
  console.log("Guardian 1 Email:", guardianEmailRef1.current.value);
  console.log("Guardian 1 Phone Number:", guardianPhoneRef1.current.value);
    const dateOfBirth = new Date(dateOfBirthRef.current.value);
    if (!validateDateOfBirth(dateOfBirth)) {
      return setError("You must be at least 18 years old to register");
    }
    if (!aadharExists) {
      return setError("An account with this Aadhaar number already exists.");
    }
    if (passwordRef.current.value!== passwordConfirmRef.current.value) {
      return setError("Passwords do not match");
    }
    if (
      aadharRef.current.value === guardianAadharRef1.current.value
    ) {
      return setError(
        "User Aadhaar number cannot be the same as guardian Aadhaar number."
      );
    }
    try {
      setError("");

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        emailRef.current.value,
        passwordRef.current.value
      );
      const user = userCredential.user;

      // Add Firestore document creation here
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fname: FnameRef.current.value,
        lname: LnameRef.current.value,
        email: user.email,
        aadhar: aadharRef.current.value,
        gender: GenderRef.current.value,
        timestamp: serverTimestamp(),
        phone: phoneRef.current.value,
        bloodGroup: bloodGroupRef.current.value,
        dateOfBirth: dateOfBirthRef.current.value,
        state: stateRef.current.value,
        city: cityRef.current.value,
        pincode: pincodeRef.current.value,
        area: areaRef.current.value,
        plotNumber: plotNumberRef.current.value,
        fileID: "",
            gaadhar: guardianAadharRef1.current.value,
            gname: guardianNameRef1.current.value,
            gemail: guardianEmailRef1.current.value,
            gphone: guardianPhoneRef1.current.value,
      });

      await createMedfile(user.uid);
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(
        userDocRef,
        {
          fileID: fileId,
        },
        { merge: true }
      );

      navigate("/");
      console.log("success");
    } catch (error) {
      console.log(error.message);
      setError("Failed to create an account");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        marginTop:"2rem"
      }}
    >
      <div
        style={{
         width:"fitcontent",
         maxWidth:"24rem",
          backgroundColor: "#e5d7d7",
          padding: "18px",
          borderRadius: "6%",
          alignItems:"center"
        }}
      >
        <h2 style={{ textAlign: "center" }}>Sign Up</h2>
        <Link
          to="/Docsignup"
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "10px 20px",
            textAlign: "center",
            textDecoration: "none",
            display: "inline-block",
            margin: "5px",
            borderRadius: "6%",
            marginLeft: "10%",
          }}
        >
          Doctor Signup
        </Link>
        <Link
          to="/pharma"
          style={{
            backgroundColor: "#007bff",
            color: "white",
            padding: "10px 20px",
            textAlign: "center",
            textDecoration: "none",
            display: "inline-block",
            margin: "5px",
            borderRadius: "6%",
          }}
        >
          Pharma Signup
        </Link>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            justifyItems: "space-around",
          }}
        >
          <div>
            <input
              type="text"
              placeholder="First Name"
              ref={FnameRef}
              required
              style={{ marginBottom: "10px", height:"2em" }}
            />
            <input
              type="text"
              placeholder="Last Name"
              ref={LnameRef}
              required
              style={{ marginBottom: "10px" , marginLeft:"10%",height:"2em"}}
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              ref={emailRef}
              required
              style={{ marginBottom: "10px", height:"2em",width:"29em" }}
            />
          </div>
          <div>
            <input
             type="password"
              placeholder="Password"
              ref={passwordRef}
              required
              style={{ marginBottom: "10px", height:"2em", }}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              ref={passwordConfirmRef}
              required
              style={{ marginBottom: "10px", height:"2em", marginLeft:"10%" }}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Aadhaar Number"
              ref={aadharRef}
              required
              style={{ marginBottom: "10px" , height:"2em"}}
            />
            <input
              type="text"
              placeholder="Phone Number"
              ref={phoneRef}
              required
              style={{ marginBottom: "10px", height:"2em", marginLeft:"10%" }}
            />
            </div>
            <div>
            <select ref={GenderRef} style={{ marginBottom: "10px", height:"2em", width:"13em" }} required>
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Others">Others</option>
            </select>
          
            <input
              type="date"
              ref={dateOfBirthRef}
              required
              style={{ marginBottom: "10px", width:"12.5em" , marginLeft:"10%",height:"1.7em"}}
            />
          </div>
          <div>
            <select ref={stateRef} style={{ marginBottom: "10px", maxWidth:"13em", height:"2em" }} required>
              <option value="">State</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Arunachal Pradesh">Arunachal Pradesh</option>
              <option value="Assam">Assam</option>
              <option value="Bihar">Bihar</option>
              <option value="Chhattisgarh">Chhattisgarh</option>
              <option value="Goa">Goa</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Haryana">Haryana</option>
              <option value="Himachal Pradesh">Himachal Pradesh</option>
              <option value="Jharkhand">Jharkhand</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Kerala">Kerala</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Manipur">Manipur</option>
              <option value="Meghalaya">Meghalaya</option>
              <option value="Mizoram">Mizoram</option>
              <option value="Nagaland">Nagaland</option>
              <option value="Odisha">Odisha</option>
              <option value="Punjab">Punjab</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Sikkim">Sikkim</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Telangana">Telangana</option>
              <option value="Tripura">Tripura</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Uttarakhand">Uttarakhand</option>
              <option value="West Bengal">West Bengal</option>
              <option value="Andaman and Nicobar Islands">
                Andaman and Nicobar Islands
              </option>
              <option value="Chandigarh">Chandigarh</option>
              <option value="Dadra and Nagar Haveli and Daman and Diu">
                Dadra and Nagar Haveli and Daman and Diu
              </option>
              <option value="Lakshadweep">Lakshadweep</option>
              <option value="Delhi">Delhi</option>
              <option value="Puducherry">Puducherry</option>
            </select>
            <input
              type="text"
             placeholder="City"
              ref={cityRef}
              required
              style={{ marginBottom: "10px", height:"1.5em", marginLeft:"10%" }}
            />
            <input
              type="text"
              placeholder="Pincode"
              ref={pincodeRef}
              required
              style={{ marginBottom: "10px", height:"2em" }}
            />
            <input
              type="text"
              placeholder="Area"
              ref={areaRef}
              required
              style={{ marginBottom: "10px" , marginLeft:"10%", height:"2em"}}
            />
            <input
              type="text"
              placeholder="Plot Number"
              ref={plotNumberRef}
              required
              style={{ marginBottom: "10px", height:"2em" }}
            />
          
          <select ref={bloodGroupRef} style={{ marginBottom: "10px", height:"2em", marginLeft:"10%" }} required>
            <option value="">Blood Group</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
          </div>
          <div>
            <input
              type="text"
              placeholder="Guardian 1 Aadhaar Number"
              ref={guardianAadharRef1}
              required
              style={{ marginBottom: "10px" , height:"2em"}}
            />
            <input
              type="text"
              placeholder="Guardian 1 Name"
              ref={guardianNameRef1}
              required
              style={{ marginBottom: "10px" , height:"2em", marginLeft:"10%"}}
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Guardian 1 Email"
              ref={guardianEmailRef1}
              required
              style={{ marginBottom: "10px" , height:"2em"}}
            />
            <input
              type="text"
              placeholder="Guardian 1 Phone Number"
              ref={guardianPhoneRef1}
              required
              style={{ marginBottom: "10px" , height:"2em", marginLeft:"10%"}}
            />
          </div>
          <button
            type="submit"
            className="submit"
            style={{
              marginBottom: "10px",
              width: "80%",
              padding: "10px",
              borderRadius: "5px",
              backgroundColor: "#33a3ff",
              color: "white",
              marginLeft:"7%"
            }}
          >
            Submit
          </button>
          <div style={{alignItems:"center", marginLeft:"17%"}}>
         Already have an account? <Link to="/login">Log In</Link>
          </div>
        </form>
      </div>
    </div>
  );
}