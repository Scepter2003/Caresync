import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../components/firebase/firebase';
import { useNavigate } from 'react-router-dom';
import { updatePassword } from 'firebase/auth';

const Pharmahome = () => {
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
        const userDocRef = doc(db, `verified_pharma/${user.uid}`);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.hasChangedPassword) {
            navigate('/pharpage');
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
        await updateDoc(doc(db, `verified_pharma/${user.uid}`), {
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
    <div>
      <h1>Welcome, Pharma!</h1>
      {showChangePassword && (
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="password"
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error && <p>{error}</p>}
          <button type="submit" onClick={handleChangePassword}>
            Change Password
          </button>
        </form>
      )}
    </div>
  );
};

export default Pharmahome;