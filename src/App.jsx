import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { ProductProvider } from "./contexts/ProductContext"
import { NotificationProvider } from "./contexts/NotificationContext"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import HomePage from "./pages/HomePage"
import ProductListingPage from "./pages/ProductListingPage"
import ProductDetailPage from "./pages/ProductDetailPage"
import ProfilePage from "./pages/ProfilePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import CreateListingPage from "./pages/CreateListingPage"
import NotificationCenter from "./components/NotificationCenter"
import "./App.css"

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProductProvider>
          <NotificationProvider>
            <div className="flex flex-col min-h-screen bg-gray-50">
              <Navbar />
              <NotificationCenter />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductListingPage />} />
                  <Route path="/products/:id" element={<ProductDetailPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/create-listing" element={<CreateListingPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </NotificationProvider>
        </ProductProvider>
      </AuthProvider>
    </Router>
  )
}

export default App

