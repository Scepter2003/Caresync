import React, { useRef, useState } from "react";
import {
  ref,
  push,
  query,
  orderByChild,
  equalTo,
  get,
  set,
} from "firebase/database";
import { db1 } from "../firebase/firebase";
import { useAuth } from "../Contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";

export default function PharmaSignup() {
  const emailRef = useRef();
  const pphone = useRef();
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const specialityRef = useRef();
  const medicalsetref = useRef();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const countryRef = useRef();
  const stateRef = useRef();
  const cityRef = useRef();
  const settingnameRef = useRef();
  const streetRef = useRef();
  const plotnoRef = useRef();
  const landmarkRef = useRef();
  const PINRef = useRef();
  const contactRef = useRef();
  const LicenseNumRef = useRef();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);

      const email = emailRef.current.value;
      const pharmaQuery = query(
        ref(db1, "unverified_pharma"),
        orderByChild("email"),
        equalTo(email)
      );
      const PharmaSnapshot = await get(pharmaQuery);

      if (PharmaSnapshot.exists()) {
        setError("Email already exists in the unverified Pharma list.");
        setLoading(false);
        return;
      }

      const phone = pphone.current.value;

      const phoneQuery = query(
        ref(db1, "unverified_pharma"),
        orderByChild("pcontact"),
        equalTo(phone)
      );
      const phoneSnapshot = await get(phoneQuery);

      if (phoneSnapshot.exists()) {
        setError("Phone number already exists in the unverified Pharma list.");
        setLoading(false);
        return;
      }

      const pharmaRef = push(ref(db1, "unverified_pharma"));
      const newphID = pharmaRef.key;
      await set(pharmaRef, {
        pharmaid: newphID,
        email: email,
        pcontact: phone,
        firstName: firstNameRef.current.value,
        lastName: lastNameRef.current.value,
        timestamp: new Date().toISOString(),
        country: countryRef.current.value,
        state: stateRef.current.value,
        city: cityRef.current.value,
        settingname: settingnameRef.current.value,
        street: streetRef.current.value,
        plotno: plotnoRef.current.value,
        landmark: landmarkRef.current.value,
        pin: PINRef.current.value,
        contact: contactRef.current.value,
        licensenumber: LicenseNumRef.current.value,
        pharmaverified: false,
        licenseverified: false,
      });

      alert(`Thank you for signing up! Upon successful verification of your data, your account will be created. You can use the email you provided during signup to track the verification process.
      Once your account is successfully created, your login credentials will be sent to you by email.
      Your Email used \nEmail: ${emailRef.current.value}`);

      // Navigate to login page
      navigate("/login");
    } catch (error) {
      console.log(error.message);
      setError("Failed to create an account");
    }
    setLoading(false);
  }

  return (
    <div
      className="container"
      style={{margin:"8% 30%",
         maxWidth:"24rem",
          backgroundColor: "#e5d7d7",
          padding: "1em",
          borderRadius: "6%",
          height:"25rem",
          alignItems:"center"
      }}
    >
      {" "}
      <h2 className="text-center mb-4" style={{alignItems:"center", marginLeft:"23%"}}>Pharma Sign Up</h2>{" "}
      {error && <div className="alert alert-danger">{error}</div>}{" "}
      <form onSubmit={handleSubmit}>
        {" "}
        <div className="form-group">
          {" "}
          <label>First Name</label>{" "}
          <input
            type="text"
            ref={firstNameRef}
            required
            className="form-control"
          />{" "}
        </div>{" "}
        <div className="form-group">
          {" "}
          <label>Last Name</label>{" "}
          <input
            type="text"
            ref={lastNameRef}
            required
            className="form-control"
          />{" "}
        </div>{" "}
        <div className="form-group">
          {" "}
          <label>Email</label>{" "}
          <input
            type="email"
            ref={emailRef}
            required
            className="form-control"
          />{" "}
        </div>{" "}
        <div>
          {" "}
          <label>Personal Phone</label> <input type="tel" ref={pphone} />{" "}
        </div>{" "}
        <div className="form-group">
          {" "}
          <label>License Number</label>{" "}
          <input
            type="text"
            ref={LicenseNumRef}
            required
            className="form-control"
          />{" "}
        </div>{" "}
        <div className="form-group">
          {" "}
          <label>Address</label>{" "}
          <input
            ref={countryRef}
            required
            type="text"
            placeholder="country"
            className="form-control"
          />{" "}
          <input
            ref={stateRef}
            required
            type="text"
            placeholder="state"
            className="form-control"
          />{" "}
          <input
            ref={cityRef}
            required
            type="text"
            placeholder="city"
            className="form-control"
          />{" "}
          <input
            ref={settingnameRef}
            required
            type="text"
            placeholder="setting name"
            className="form-control"
          />{" "}
          <input
            ref={streetRef}
            required
            type="text"
            placeholder="street"
            className="form-control"
          />{" "}
          <input
            ref={plotnoRef}
            required
            type="number"
            placeholder="plot no."
            className="form-control"
          />{" "}
          <input
            ref={landmarkRef}
            required
            type="text"
            placeholder="landmark"
            className="form-control"
          />{" "}
          <input
            ref={PINRef}
            required
            type="number"
            placeholder="pincode"
            className="form-control"
          />{" "}
          <input
            ref={contactRef}
            required
            type="tel"
            placeholder="contact number"
            className="form-control"
          />{" "}
        </div>{" "}
        <button
          disabled={loading}
          className="btn btn-primary w-100"
          type="submit"
        >
          Sign Up
        </button>{" "}
      </form>{" "}
      <div className="text-center mt-2">
        {" "}
        Already have an account? <Link to="/login">Log In</Link>{" "}
      </div>{" "}
    </div>
  );
}
