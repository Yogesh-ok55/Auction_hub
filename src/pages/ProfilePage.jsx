"use client"
import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useAuth } from "../contexts/AuthContext"
import { useProducts } from "../contexts/ProductContext"
import ProductCard from "../components/ProductCard"
import { FiUser, FiPackage, FiHeart, FiSettings, FiLogOut, FiPlus, FiEdit2 } from "react-icons/fi"

const ProfilePage = () => {
  const { currentUser, logout, setCurrentUser } = useAuth()
  const { products, getProductsBySeller, getBidProducts } = useProducts()
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("listings")
  const [profileImage, setProfileImage] = useState(null)

  // Redirect if not logged in
  if (!currentUser) {
    navigate("/login")
    return null
  }

  const userListings = getProductsBySeller(currentUser.id)
  const userBids = getBidProducts(currentUser.id)

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('http://localhost:5000/upload/profileImage', {
        method: 'POST',
        body: formData,
        credentials: "include"
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Image uploaded successfully:', data.url);
        setProfileImage(data.url);
        setCurrentUser((Prop) => ({
          ...Prop,
          profile_pic: data.url
        }))
      } else {
        console.error('Upload failed:', data.error);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };



  return (

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="relative group w-24 h-24">
                {currentUser.profile_pic ? (
                  <>
                    
                    <img
                      src={currentUser.profile_pic}
                      alt="Profile"
                      onClick={() => setShowModal(true)}
                      className="h-24 w-24 rounded-full object-cover border-2 border-indigo-500 cursor-pointer"
                    />

                    
                    <label
                      htmlFor="profile-upload"
                      className="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow-md cursor-pointer"
                    >
                      <FiEdit2 className="h-5 w-5 text-indigo-600" />
                    </label>
                  </>
                ) : (
                  <div className="h-24 w-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold">
                    {currentUser.username ? (
                      <>
                      {currentUser.username.charAt(0).toUpperCase()}
                      <label
                      htmlFor="profile-upload"
                      className="absolute bottom-1 right-1 bg-white rounded-full p-1 shadow-md cursor-pointer"
                    >
                      <FiEdit2 className="h-5 w-5 text-indigo-600" />
                    </label>
                      </>
                    ) : (
                      <FiUser className="h-12 w-12" />
                    )}
                  </div>
                )}

                
                <input
                  type="file"
                  id="profile-upload"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              {/* Modal for full image view */}
              {showModal && currentUser.profile_pic && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                  <div className="relative">
                    <img
                      src={currentUser.profile_pic}
                      alt="Full Size"
                      className="max-w-[90vw] max-h-[90vh] rounded-xl shadow-lg"
                    />
                    <button
                      onClick={() => setShowModal(false)}
                      className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full px-2 py-1 text-sm hover:bg-opacity-80"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
              
              {showModal && currentUser.profile_pic && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
                  <div className="relative">
                    <img
                      src={currentUser.profile_pic}
                      alt="Full Size"
                      className="max-w-[90vw] max-h-[90vh] rounded-xl shadow-lg"
                    />
                    <button
                      onClick={() => setShowModal(false)}
                      className="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full px-2 py-1 text-sm hover:bg-opacity-80"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
              <h2 className="text-xl font-semibold mt-3">{currentUser.username || "User"}</h2>
              <p className="text-gray-500 text-sm">
                {currentUser.email}
              </p>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab("listings")}
                className={`flex items-center w-full px-4 py-2 text-sm rounded-md ${activeTab === "listings" ? "bg-indigo-50 text-indigo-700" : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <FiPackage className="mr-3 h-5 w-5" />
                My Listings
              </button>
              <button
                onClick={() => setActiveTab("bids")}
                className={`flex items-center w-full px-4 py-2 text-sm rounded-md ${activeTab === "bids" ? "bg-indigo-50 text-indigo-700" : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <FiHeart className="mr-3 h-5 w-5" />
                My Bids
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`flex items-center w-full px-4 py-2 text-sm rounded-md ${activeTab === "settings" ? "bg-indigo-50 text-indigo-700" : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <FiSettings className="mr-3 h-5 w-5" />
                Account Settings
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm rounded-md text-red-600 hover:bg-red-50"
              >
                <FiLogOut className="mr-3 h-5 w-5" />
                Logout
              </button>
            </nav>
          </div>

          <Link to="/create-listing">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center w-full px-4 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              <FiPlus className="mr-2" />
              Create New Listing
            </motion.button>
          </Link>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          {activeTab === "listings" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">My Listings</h2>
              {userListings.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No listings yet</h3>
                  <p className="mt-1 text-gray-500">Get started by creating your first listing.</p>
                  <div className="mt-6">
                    <Link to="/create-listing">
                      <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                        <FiPlus className="mr-2 -ml-1 h-5 w-5" />
                        Create Listing
                      </button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userListings.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "bids" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">My Bids</h2>
              {userBids.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <FiHeart className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No bids yet</h3>
                  <p className="mt-1 text-gray-500">Start bidding on items you're interested in.</p>
                  <div className="mt-6">
                    <Link to="/products">
                      <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                        Browse Auctions
                      </button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {userBids.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
              <div className="bg-white rounded-lg shadow-md p-6">
                <form className="space-y-6">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      disabled={true}
                      defaultValue={currentUser.username || ""}
                      className="mt-1 block w-full border border-gray-300 bg-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      disabled={true}
                      defaultValue={currentUser.email || ""}
                      className="mt-1 block w-full border border-gray-300 bg-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="pt-5">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
