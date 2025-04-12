"use client"
import React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useProducts } from "../contexts/ProductContext"
import ProductCard from "../components/ProductCard"
import { FiFilter, FiX, FiSearch } from "react-icons/fi"

const ProductListingPage = () => {
  const { products, loading } = useProducts()
  const [filteredProducts, setFilteredProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [sortBy, setSortBy] = useState("endingSoon")
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 })
  const [showFilters, setShowFilters] = useState(false)

  // Extract unique categories from products
  const categories = [...new Set(products.map((product) => product.category))]

  // Filter and sort products
  useEffect(() => {
    let result = [...products]

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (product) =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply category filter
    if (selectedCategory) {
      result = result.filter((product) => product.category === selectedCategory)
    }

    // Apply price range filter
    result = result.filter((product) => product.currentBid >= priceRange.min && product.currentBid <= priceRange.max)

    // Apply sorting
    switch (sortBy) {
      case "endingSoon":
        result.sort((a, b) => new Date(a.endTime) - new Date(b.endTime))
        break
      case "priceLow":
        result.sort((a, b) => a.currentBid - b.currentBid)
        break
      case "priceHigh":
        result.sort((a, b) => b.currentBid - a.currentBid)
        break
      case "newest":
        result.sort((a, b) => new Date(b.createdAt || b.endTime) - new Date(a.createdAt || a.endTime))
        break
      default:
        break
    }

    setFilteredProducts(result)
  }, [products, searchTerm, selectedCategory, sortBy, priceRange])

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category === selectedCategory ? "" : category)
  }

  const handleSortChange = (e) => {
    setSortBy(e.target.value)
  }

  const handlePriceChange = (type, value) => {
    setPriceRange((prev) => ({
      ...prev,
      [type]: Number(value),
    }))
  }

  const resetFilters = () => {
    setSearchTerm("")
    setSelectedCategory("")
    setSortBy("endingSoon")
    setPriceRange({ min: 0, max: 1000 })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Browse Auctions</h1>

      {/* Search and Filter Controls */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search auctions..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="endingSoon">Ending Soon</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <FiFilter className="mr-2 h-5 w-5" />
              Filters
            </button>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white p-4 rounded-md shadow-md mb-4"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Filters</h3>
              <button onClick={resetFilters} className="text-sm text-indigo-600 hover:text-indigo-800">
                Reset All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Categories</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm mr-2 mb-2 ${
                        selectedCategory === category
                          ? "bg-indigo-100 text-indigo-800"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      {category}
                      {selectedCategory === category && <FiX className="ml-1 h-4 w-4" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Price Range</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="min-price" className="block text-xs text-gray-500">
                      Min Price
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        id="min-price"
                        value={priceRange.min}
                        onChange={(e) => handlePriceChange("min", e.target.value)}
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-3 sm:text-sm border-gray-300 rounded-md"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="max-price" className="block text-xs text-gray-500">
                      Max Price
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        id="max-price"
                        value={priceRange.max}
                        onChange={(e) => handlePriceChange("max", e.target.value)}
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-3 sm:text-sm border-gray-300 rounded-md"
                        placeholder="1000"
                        min="0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Active Filters */}
        {(selectedCategory || searchTerm || priceRange.min > 0 || priceRange.max < 1000) && (
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="text-sm text-gray-500">Active filters:</span>

            {selectedCategory && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory("")} className="ml-1">
                  <FiX className="h-4 w-4" />
                </button>
              </span>
            )}

            {searchTerm && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800">
                Search: {searchTerm}
                <button onClick={() => setSearchTerm("")} className="ml-1">
                  <FiX className="h-4 w-4" />
                </button>
              </span>
            )}

            {(priceRange.min > 0 || priceRange.max < 1000) && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800">
                Price: ${priceRange.min} - ${priceRange.max}
                <button onClick={() => setPriceRange({ min: 0, max: 1000 })} className="ml-1">
                  <FiX className="h-4 w-4" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductListingPage

