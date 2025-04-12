"use client"
import React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { useProducts } from "../contexts/ProductContext"
import { useAuth } from "../contexts/AuthContext"
import { useNotifications } from "../contexts/NotificationContext"
import { FiDollarSign, FiAlertCircle } from "react-icons/fi"

const BidForm = ({ product }) => {
  const [bidAmount, setBidAmount] = useState(product.currentBid + 5)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const { placeBid } = useProducts()
  const { currentUser } = useAuth()
  const { addNotification } = useNotifications()

  const handleBidChange = (e) => {
    setBidAmount(Number.parseFloat(e.target.value))
    setError("")
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!currentUser) {
      setError("You must be logged in to place a bid")
      return
    }

    if (bidAmount <= product.currentBid) {
      setError(`Your bid must be higher than the current bid of $${product.currentBid}`)
      return
    }

    setIsSubmitting(true)

    try {
      const success = placeBid(product.id, bidAmount)

      if (success) {
        setShowSuccess(true)
        setBidAmount(bidAmount + 5)

        // Add notification for the seller
        addNotification({
          type: "bid",
          message: `New bid of $${bidAmount} on your item "${product.title}"`,
          productId: product.id,
          time: new Date().toISOString(),
        })

        setTimeout(() => {
          setShowSuccess(false)
        }, 3000)
      } else {
        setError("Failed to place bid. Please try again.")
      }
    } catch (err) {
      setError("An error occurred while placing your bid")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Place Your Bid</h3>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Current Bid:</span>
          <span className="font-semibold">${product.currentBid}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Minimum Bid:</span>
          <span className="font-semibold">${product.currentBid + 1}</span>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 text-red-600 p-3 rounded-md mb-4 flex items-center"
        >
          <FiAlertCircle className="mr-2" />
          {error}
        </motion.div>
      )}

      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 text-green-600 p-3 rounded-md mb-4"
        >
          Your bid of ${bidAmount} has been placed successfully!
        </motion.div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 mb-1">
            Your Bid Amount ($)
          </label>
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiDollarSign className="text-gray-400" />
            </div>
            <input
              type="number"
              id="bidAmount"
              value={bidAmount}
              onChange={handleBidChange}
              min={product.currentBid + 1}
              step="0.01"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
              placeholder="0.00"
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isSubmitting || !currentUser}
          className={`w-full py-3 px-4 rounded-md text-white font-medium ${
            !currentUser ? "bg-gray-400" : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          {isSubmitting ? "Placing Bid..." : "Place Bid"}
        </motion.button>

        {!currentUser && (
          <p className="text-sm text-gray-500 mt-2 text-center">You need to be logged in to place a bid</p>
        )}
      </form>
    </div>
  )
}

export default BidForm

