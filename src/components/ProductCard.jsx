"use client"
import React from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { FiClock, FiDollarSign, FiTag } from "react-icons/fi"
import AuctionTimer from "./AuctionTimer"

const ProductCard = ({ product }) => {
  const { id, title, images, currentBid, startingBid, endTime, category } = product

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <Link to={`/products/${id}`}>
        <div className="relative h-48 overflow-hidden">
          <img
            src={images[0] || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
            <div className="flex items-center text-white text-sm">
              <FiTag className="mr-1" />
              <span>{category}</span>
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{title}</h3>

          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center text-indigo-600">
              <FiDollarSign className="mr-1" />
              <span className="font-bold">${currentBid}</span>
            </div>
            <div className="text-sm text-gray-500">Starting: ${startingBid}</div>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <FiClock className="mr-1" />
            <AuctionTimer endTime={endTime} compact={true} />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default ProductCard

