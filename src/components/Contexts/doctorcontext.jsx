import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { db } from "../firebase/firebase";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

const DoctorDataContext = createContext();

export const DoctorDataProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const userRef = doc(db, "verified_doctors", currentUser.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      }
    };

    fetchUserData();
  }, [currentUser]);

  return (
    <DoctorDataContext.Provider value={userData}>
      {children}
    </DoctorDataContext.Provider>
  );
};

export const useDoctorData = () => useContext(DoctorDataContext);