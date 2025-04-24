"use client"
import React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useProducts } from "../contexts/ProductContext"
import { useAuth } from "../contexts/AuthContext"
import { FiUpload, FiDollarSign, FiAlertCircle, FiX } from "react-icons/fi"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateListingPage = () => {
  const navigate = useNavigate()
  const { createListing } = useProducts()
  const { currentUser } = useAuth()

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    starting_bid: 0,
    images: [],
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if not logged in
  if (!currentUser) {
    navigate("/login", { state: { from: "/create-listing" } })
    return null
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleImageChange = (e) => {
    const files = e.target.files[0];

    setFormData((prev) => ({
      ...prev,
      images: files,
    }))

    if (errors.images) {
      setErrors((prev) => ({
        ...prev,
        images: "",
      }))
    }
  }

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (!formData.category) {
      newErrors.category = "Category is required"
    }

    if (!formData.starting_bid || isNaN(formData.starting_bid) || Number(formData.starting_bid) <= 0) {
      newErrors.startingBid = "Starting bid must be a positive number"
    }

    if (formData.images.length === 0) {
      newErrors.images = "At least one image is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const newProduct = createListing({
        ...formData,
      })

     
      setTimeout(()=>{
        if (newProduct) {
          // navigate("/products")
          console.log("success");
        } else {
          setErrors({ submit: "Failed to create listing. Please try again." })
        }
        toast.success("product created successfully");
      },2500)
      
    } catch (error) {
      
      toast.error("An error occurred. Please try again");
      setErrors({ submit: "An error occurred. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Listing</h1>
      <h1>{currentUser.id}</h1>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        {errors.submit && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 flex items-center">
            <FiAlertCircle className="h-5 w-5 mr-2" />
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                  errors.title
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                }`}
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
             <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                  errors.description
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                }`}
              />
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                  errors.category
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                }`}
              >
                <option value="">Select a category</option>
                <option value="Electronics">Electronics</option>
                <option value="Fashion">Fashion</option>
                <option value="Home & Garden">Home & Garden</option>
                <option value="Sports">Sports</option>
                <option value="Toys & Hobbies">Toys & Hobbies</option>
                <option value="Jewelry">Jewelry</option>
                <option value="Art">Art</option>
                <option value="Collectibles">Collectibles</option>
                <option value="Vehicles">Vehicles</option>
                <option value="Other">Other</option>
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
            </div>

            {/* Starting Bid */}
            <div>
              <label htmlFor="startingBid" className="block text-sm font-medium text-gray-700">
                Starting Bid ($) <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiDollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  id="starting_bid"
                  name="starting_bid"
                  min="0.01"
                  step="0.01"
                  value={formData.startingBid}
                  onChange={handleChange}
                  className={`block w-full pl-10 pr-12 sm:text-sm rounded-md ${
                    errors.startingBid
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.startingBid && <p className="mt-1 text-sm text-red-600">{errors.startingBid}</p>}
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Images <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="images"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <span>Upload files</span>
                      <input
                        id="images"
                        name="images"
                        type="file"
                        multiple
                        accept="image/*"
                        className="sr-only"
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
              {errors.images && <p className="mt-1 text-sm text-red-600">{errors.images}</p>}

              {/* Image Previews */}
              {formData.images.length > 0 && (
                <div className="mt-4 grid grid-cols-3 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Preview ${index + 1}`}
                        className="h-24 w-full object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1"
                      >
                        <FiX className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4">
              <p className="text-sm text-gray-500 mb-4">
                By creating this listing, you agree to our Terms of Service and Auction Rules. Your item will be listed
                for 24 hours.
              </p>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isSubmitting ? "Creating Listing..." : "Create Listing"}
              </motion.button>
            </div>
          </div>
        </form>
         <ToastContainer />
      </motion.div>
    </div>
  )
}

export default CreateListingPage

