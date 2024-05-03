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
import emailjs from "@emailjs/browser";

const specialitiesOptions = [
  { value: "Cardiology", label: "Cardiology" },
  { value: "Dermatology", label: "Dermatology" },
  { value: "Endocrinology", label: "Endocrinology" },
  { value: "Gastroenterology", label: "Gastroenterology" },
  { value: "Geriatrics", label: "Geriatrics" },
  { value: "Hematology", label: "Hematology" },
  { value: "Infectious Disease", label: "Infectious Disease" },
  { value: "Nephrology", label: "Nephrology" },
  { value: "Neurology", label: "Neurology" },
  { value: "Oncology", label: "Oncology" },
  { value: "Ophthalmology", label: "Ophthalmology" },
  { value: "Pulmonology", label: "Pulmonology" },
  { value: "Psychiatry", label: "Psychiatry" },
  { value: "Radiology", label: "Radiology" },
  { value: "Rheumatology", label: "Rheumatology" },
  { value: "Surgery", label: "Surgery" },
];

const medicalSettingsOptions = [
  { value: "Hospitals", label: "Hospitals" },
  { value: "Private Practice", label: "Private Practice" },
  { value: "Clinics", label: "Clinics" },
  { value: "Academic Medical Centers", label: "Academic Medical Centers" },
  { value: "Research Institutions", label: "Research Institutions" },
  { value: "Telemedicine", label: "Telemedicine" },
  {
    value: "Nursing Homes/Long-Term Care Facilities",
    label: "Nursing Homes/Long-Term Care Facilities",
  },
  { value: "Government Agencies", label: "Government Agencies" },
  { value: "Military", label: "Military" },
  { value: "Urgent Care Centers", label: "Urgent Care Centers" },
  {
    value: "Corporate/Industrial Settings",
    label: "Corporate/Industrial Settings",
  },
  { value: "Sports Medicine Clinics", label: "Sports Medicine Clinics" },
];

export default function DoctorSignup() {
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
      const doctorQuery = query(
        ref(db1, "unverified_doctors"),
        orderByChild("email"),
        equalTo(email)
      );
      const doctorSnapshot = await get(doctorQuery);

      if (doctorSnapshot.exists()) {
        setError("Email already exists in the unverified doctors list.");
        setLoading(false);
        return;
      }

      const phone = pphone.current.value;

      const phoneQuery = query(
        ref(db1, "unverified_doctors"),
        orderByChild("pcontact"),
        equalTo(phone)
      );
      const phoneSnapshot = await get(phoneQuery);

      if (phoneSnapshot.exists()) {
        setError("Phone number already exists in the unverified doctors list.");
        setLoading(false);
        return;
      }

      const doctorRef = push(ref(db1, "unverified_doctors"));
      const newDocID = doctorRef.key;
      await set(doctorRef, {
        docid: newDocID,
        email: email,
        pcontact: phone,
        firstName: firstNameRef.current.value,
        speciality: specialityRef.current.value,
        worksetting: medicalsetref.current.value,
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
        doctorverified: false,
        settingverified: false,
        licenseverified: false,
        licensenumber: LicenseNumRef.current.value,
      });

      /* const templateParams = {
        name: firstNameRef.current.value,
        recipient: emailRef.current.value,
        };
        emailjs.send('service_4mdueyv', 'template_ggsgmxs', templateParams, '_PJ3-S34LJ3-pqxIp')
      .then((response) => {
        console.log('Email sent successfully!', response.status, response.text);
      }, (error) => {
        console.log('Error sending email:', error);
      });*/
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
      style={{
        height: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        className="a"
        style={{
          width: "30vw",
          gap: "2px",
          backgroundColor: "#e5d7d7",
          width: "32vw",
          marginTop: "10%",
          borderRadius:"10px"
        }}
      >
        <h2 className="text-center mb-4" style={{ textAlign: "center" }}>
          Doctor Sign Up
        </h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "3px" }}
        >
          <div className="form-group">
            <input
              type="text"
              ref={firstNameRef}
              required
              placeholder="First Name"
              className="form-control"
              style={{ padding: "2%", marginLeft: "2%" }}
            />
            <input
              type="text"
              ref={lastNameRef}
              required
              placeholder="Last Name"
              className="form-control"
              style={{ padding: "2%", marginLeft: "2%" }}
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              ref={emailRef}
              required
              placeholder="Email"
              className="form-control"
              style={{ padding: "2%", marginLeft: "2%" }}
            />
            <input
              type="tel"
              ref={pphone}
              placeholder="Personal Phone"
              className="form-control"
              style={{ padding: "2%", marginLeft: "2%" }}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              ref={LicenseNumRef}
              required
              placeholder="License Number"
              className="form-control"
              style={{ padding: "2%", marginLeft: "2%" }}
            />
          </div>
          <div className="form-group">
            {" "}
            <select
              ref={specialityRef}
              required
              className="form-control"
              style={{ padding: "2%", marginLeft: "2%", width:"13.45em" }}
            >
              {" "}
              <option value="">Select Speciality</option>{" "}
              {specialitiesOptions.map((option, index) => (
                <option key={index} value={option.value}>
                  {" "}
                  {option.label}{" "}
                </option>
              ))}{" "}
            </select>{" "}
            {" "}
            <select
              ref={medicalsetref}
              required
              className="form-control"
              style={{ padding: "2%", marginLeft: "2%", width:"13.45em"}}
            >
              {" "}
              <option value="">Select Work Setting</option>{" "}
              {medicalSettingsOptions.map((option, index) => (
                <option key={index} value={option.value}>
                  {" "}
                  {option.label}{" "}
                </option>
              ))}{" "}
            </select>{" "}
          </div>
          <div className="form-group">
            <h3 style={{ textAlign: "center" }}>Worksetting Address</h3>
            <input
              ref={countryRef}
              required
              type="text"
              placeholder="Country"
              className="form-control"
              style={{ padding: "2%", marginLeft: "2%" }}
            />
           <select ref={stateRef} style={{ padding: "2%", marginLeft: "2%" , maxWidth:"13.45em"}} required>
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
              ref={cityRef}
              required
              type="text"
              placeholder="City"
              className="form-control"
              style={{ padding: "2%", marginLeft: "2%" }}
            />
            <input
              ref={settingnameRef}
              required
              type="text"
              placeholder="Setting Name"
              className="form-control"
              style={{ padding: "2%", marginLeft: "2%" }}
            />
            <input
              ref={streetRef}
              required
              type="text"
              placeholder="Street"
              className="form-control"
              style={{ padding: "2%", marginLeft: "2%" }}
            />
            <input
              ref={plotnoRef}
              required
              type="number"
              placeholder="Plot No."
              className="form-control"
              style={{ padding: "2%", marginLeft: "2%" }}
            />
            <input
              ref={landmarkRef}
              required
              type="text"
              placeholder="LandmarkRight"
              className="form-control"
              style={{ padding: "2%", marginLeft: "2%" }}
            />
            <input
              ref={PINRef}
              required
              type="number"
              placeholder="PIN"
              className="form-control"
              style={{ padding: "2%", marginLeft: "2%" }}
            />
            <input
              ref={contactRef}
              required
              type="tel"
              placeholder="Contact Number"
              className="form-control"
              style={{ padding: "2%", marginLeft: "2%" }}
            />
          </div>
          <button
            disabled={loading}
            className="btn btn-primary w-100"
            type="submit"
            style={{
              padding: "0.5rem 1rem",
              fontSize: "1rem",
              borderRadius: "0.25rem",
              border: "none",
              backgroundColor: "#4CAF50",
              color: "white",
              cursor: "pointer",
              width: "30%",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: "35%",
            }}
          >
            Sign Up
          </button>
        </form>
        <div
          className="text-center mt-2"
          style={{ textAlign: "center", marginLeft: "6%" }}
        >
          Already have an account?{" "}
          <Link to="/login" style={{ color: " blue" }}>
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
