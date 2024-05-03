import { createContext, useContext, useState, useEffect } from "react";
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
import { useAuth } from "./AuthContext";

const MedfileContext = createContext();

export const MedfileProvider = ({ children }) => {
  const [medfile, setMedfile] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchMedfile = async () => {
      if (currentUser) {
        const medfileRef = doc(db, "medfile", currentUser.uid);
        const medfileDoc = await getDoc(medfileRef);

        if (medfileDoc.exists()) {
          setMedfile(medfileDoc.data());
        }
      }
    };

    fetchMedfile();
  }, [currentUser]);

  return (
    <MedfileContext.Provider value={medfile}>
      {children}
    </MedfileContext.Provider>
  );
};

export const useMedfile = () => useContext(MedfileContext);