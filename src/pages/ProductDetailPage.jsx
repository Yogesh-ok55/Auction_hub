"use client"
import React from "react"
import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useProducts } from "../contexts/ProductContext"
import { useAuth } from "../contexts/AuthContext"
import AuctionTimer from "../components/AuctionTimer"
import BidForm from "../components/BidForm"
import { FiArrowLeft, FiUser, FiClock, FiTag, FiDollarSign, FiHeart } from "react-icons/fi"

const ProductDetailPage = () => {
  const { id } = useParams()
  const { getProduct, products, loading } = useProducts()
  const { currentUser } = useAuth()
  const [product, setProduct] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    if (!loading) {
      const foundProduct = getProduct(id)
      setProduct(foundProduct)

      if (foundProduct && foundProduct.images.length > 0) {
        setSelectedImage(0)
      }
    }
  }, [id, getProduct, loading, products])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/products" className="text-indigo-600 hover:text-indigo-800 flex items-center justify-center">
          <FiArrowLeft className="mr-2" /> Back to Products
        </Link>
      </div>
    )
  }

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted)
  }

  const isAuctionEnded = new Date(product.endTime) < new Date()
  const highestBidder =
    product.bids.length > 0 &&
    product.bids.reduce((prev, current) => (prev.amount > current.amount ? prev : current)).userId
  const isCurrentUserHighestBidder = currentUser && highestBidder === currentUser.id

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/products" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6">
        <FiArrowLeft className="mr-2" /> Back to Products
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <div className="bg-white rounded-lg overflow-hidden shadow-md mb-4">
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              key={selectedImage}
              src={product.images[selectedImage]}
              alt={product.title}
              className="w-full h-96 object-contain"
            />
          </div>

          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className={`cursor-pointer rounded-md overflow-hidden border-2 ${
                    selectedImage === index ? "border-indigo-600" : "border-transparent"
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleWishlist}
                className={`p-2 rounded-full ${isWishlisted ? "text-red-500" : "text-gray-400 hover:text-red-500"}`}
              >
                <FiHeart className="h-6 w-6" />
              </motion.button>
            </div>

            <div className="flex items-center text-sm text-gray-600 mb-4">
              <FiTag className="mr-1" />
              <span>{product.category}</span>
            </div>

            <div className="border-t border-b py-4 my-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <FiDollarSign className="mr-1 text-indigo-600" />
                  <span className="text-2xl font-bold text-indigo-600">${product.currentBid}</span>
                </div>
                <div className="text-sm text-gray-600">Starting bid: ${product.startingBid}</div>
              </div>

              <div className="flex items-center text-sm text-gray-600 mb-2">
                <FiUser className="mr-1" />
                <span>
                  {product.bids.length} {product.bids.length === 1 ? "bid" : "bids"}
                </span>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <FiClock className="mr-1" />
                <span>{isAuctionEnded ? "Auction ended" : "Auction ends in:"}</span>
              </div>

              {!isAuctionEnded && (
                <div className="mt-4">
                  <AuctionTimer endTime={product.endTime} />
                </div>
              )}
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700">{product.description}</p>
            </div>

            {isAuctionEnded ? (
              <div className="bg-gray-100 p-4 rounded-md mb-4">
                <h3 className="text-lg font-semibold mb-2">Auction Ended</h3>
                {isCurrentUserHighestBidder ? (
                  <div className="text-green-600">
                    Congratulations! You won this auction with a bid of ${product.currentBid}.
                    <button className="mt-4 w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700">
                      Proceed to Payment
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-700">This auction has ended. The item sold for ${product.currentBid}.</p>
                )}
              </div>
            ) : (
              <BidForm product={product} />
            )}
          </div>

          {/* Bid History */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Bid History</h3>
            {product.bids.length === 0 ? (
              <p className="text-gray-600">No bids yet. Be the first to bid!</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {[...product.bids]
                  .sort((a, b) => new Date(b.time) - new Date(a.time))
                  .map((bid, index) => (
                    <li key={index} className="py-3 flex justify-between">
                      <div className="flex items-center">
                        <FiUser className="mr-2 text-gray-400" />
                        <span className="text-gray-800">
                          {bid.userId === currentUser?.id ? "You" : `User ${bid.userId.substring(0, 5)}...`}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium text-indigo-600">${bid.amount}</span>
                        <span className="ml-2 text-xs text-gray-500">{new Date(bid.time).toLocaleString()}</span>
                      </div>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage

