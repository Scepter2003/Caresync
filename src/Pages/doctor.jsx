import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../components/firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { updatePassword } from 'firebase/auth';

const DoctorPage = () => {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    const checkPasswordChange = async () => {
      try {
        const userDocRef = doc(db, `verified_doctors/${user.uid}`);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.hasChangedPassword) {
            navigate('/dochome');
          } else {
            setShowChangePassword(true);
          }
        }
      } catch (error) {
        console.error('Error checking password change:', error);
      }
    };

    checkPasswordChange();
  }, [navigate]);

  const handleChangePassword = async () => {
    try {
      if (newPassword === confirmPassword) {
        await updatePassword(user, newPassword);
        setError('');
        setShowChangePassword(false);
  
        // update the hasChangedPassword field in Firestore
        await updateDoc(doc(db, `verified_doctors/${user.uid}`), {
          hasChangedPassword: true
        });
  
        console.log('Password changed and updated in Firestore');
        navigate('/login');
      } else {
        setError('New password and confirm password do not match');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setError('Error changing password. Please try again.');
    }
  };

  return (
    <div style={{textAlign:"center"}}>
      <h1>Welcome, Doctor!</h1>
      <h2>Please change your password</h2>
      {showChangePassword && (
        <form onSubmit={(e) => e.preventDefault()} style={{ backgroundColor:"#afb7df", display:"flex", flexDirection:"column", marginLeft:"30%", marginRight:"30%", marginTop:"10%", textAlign:"center", padding:"4%", borderRadius:"5%" }}>
          <input
            type="password"
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            style={{height:"2em"}}
          /> <br/>
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{height:"2em"}}
          /><br/>
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{height:"2em"}}
          /><br/>
          {error && <p>{error}</p>}
          <button type="submit" onClick={handleChangePassword} style={{height:"3em",backgroundColor:" #2be384"}}>
            Change Password
          </button>
        </form>
      )}
    </div>
  );
};

export default DoctorPage;