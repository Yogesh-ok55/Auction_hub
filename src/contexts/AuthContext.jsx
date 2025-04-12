"use client"
import React from "react"
import { createContext, useState, useEffect, useContext } from "react"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(true)
  const [loading, setLoading] = useState(false)

  // Simulate fetching user from localStorage on initial load
  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user) {
      setCurrentUser(JSON.parse(user))
    }
    setLoading(false)
  }, [])

  // Login function
  const login = (userData) => {
    // In a real app, you would make an API call here
    setCurrentUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
    return true
  }

  // Register function
  const register = (userData) => {
    // In a real app, you would make an API call here
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setCurrentUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))
    return true
  }

  // Logout function
  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem("user")
  }

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

