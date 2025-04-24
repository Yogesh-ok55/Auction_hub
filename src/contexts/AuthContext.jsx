"use client"
import React from "react"

import { createContext, useState, useEffect, useContext } from "react"
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../components/Firebase";

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
          setCurrentUser(data.userData) 
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

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User Info:", user);
      // You can store the user data or navigate to a dashboard
    } catch (error) {
      console.error("Error during sign-in:", error.message);
    }
  };

  const value = {
    currentUser,
    setCurrentUser,
    isLogin,
    setIsLogin,
    logout,
    loading,
    handleGoogleLogin
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

