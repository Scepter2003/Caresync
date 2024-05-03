import React, { useState } from 'react';
import { db, auth } from '../components/firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import Modal from "react-modal";

function Addadmin() {
  const [showModal, setShowModal] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleCreateAccount(e) {
    e.preventDefault();
    const emailParts = email.split("@");
    const newEmail = `${emailParts[0]}@admin.com`;
    console.log("New email:", newEmail);
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, newEmail, password);
      const user = userCredential.user;
      await setDoc(doc(db, "admin", user.uid), {
          email: email,
          work: newEmail,
          fname: firstName,
          lname: lastName,
      });
  
      console.log("Document added to admin collection");
      alert(`Account created successfully! Your account ID is ${user.uid}`);
      setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    } catch (error) {
      console.error(error);
      alert('Error creating account');
    }
  };
  const handleModalOpen = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    setShowModal(false);
  };

  return (
    <div>
      <button onClick={handleModalOpen}>Add Account</button>
      {showModal && (
        <Modal
          isOpen={showModal}
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
              height: "70%",
            },
          }}
        >
          <div className="modal">
            <div className="modal-content">
              <h2>Create Account</h2>
                <label>First Name:</label>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                <br />
                <label>Last Name:</label>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                <br />
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <br />
                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <br />
                <button onClick={handleCreateAccount}>Create Account</button>
                <button onClick={handleModalClose}>Cancel</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default Addadmin;