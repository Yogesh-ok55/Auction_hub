"use client"
import React from "react"
import { createContext, useState, useEffect, useContext } from "react"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [isLogin,setIsLogin] = useState(false);
  const [currentUser, setCurrentUser] = useState(true)
  const [loading, setLoading] = useState(true)

  
  useEffect(() => {
   console.log()
    const verifyUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/auth/tokenVerify", {
          method: "POST",
          credentials: "include", 
        })

        if (res.ok) {
          const data = await res.json()
          console.log("hello");
          setIsLogin(true)
          setCurrentUser(data) 
        } else {
          setIsLogin(false)
          setCurrentUser(null)
        }
      } catch (error) {
        console.error("Auth verification error:", error)
        setIsLogin(false)
      } finally {
        setLoading(false)
        
      }
    }

    verifyUser()
    console.log(isLogin+" "+"in auth")
    
  }, [])

  useEffect(() => {
    console.log("isLogin changed:", isLogin)
  }, [isLogin])

  

  

  // Logout function
  const logout = () => {
   
    
  }

  const value = {
    currentUser,
    setCurrentUser,
    isLogin,
    setIsLogin,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

