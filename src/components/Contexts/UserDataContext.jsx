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

const UserDataContext = createContext();

export const UserDataProvider = ({ children, medfileId }) => {
  const [userData, setUserData] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser && medfileId) {
        const medfileRef = doc(db, "medfile", medfileId);
        const medfileDoc = await getDoc(medfileRef);

        if (medfileDoc.exists()) {
          const userRef = doc(db, "users", medfileDoc.data().uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        }
      }
    };

    fetchUserData();
  }, [currentUser, medfileId]);

  return (
    <UserDataContext.Provider value={userData}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => useContext(UserDataContext);