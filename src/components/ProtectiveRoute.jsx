
import React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const PrivateRoute = ({ children }) => {
  const { isLogin , loading} = useAuth()
  console.log(isLogin)
  if (loading) {
    return <div className="text-center text-lg font-semibold mt-10">Loading...</div>
  }
  return isLogin ? children : <Navigate to="/login" replace />
}

export default PrivateRoute
