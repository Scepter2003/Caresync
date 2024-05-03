import React from "react"
import { Route, Navigate } from "react-router-dom"
import { useAuth } from "../Contexts/AuthContext"

export default function ProtectedRoute({ children }) {
  const { currentUser } = useAuth()
    if (!currentUser) {
        return <Navigate to="/login" />;
      }
      return children;
}
