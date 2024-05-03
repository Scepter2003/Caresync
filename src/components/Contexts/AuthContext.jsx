import React, { useContext, useState, useEffect } from "react"
import { auth } from "../firebase/firebase"
import { onAuthStateChanged } from "firebase/auth";
const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user)
      setLoading(false)
      console.log("user")
    })

    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider value={{currentUser}}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
