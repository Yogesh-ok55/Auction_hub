
import React from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useProducts } from "../contexts/ProductContext"
import ProductCard from "../components/ProductCard"
import { FiArrowRight, FiPackage, FiClock, FiShield } from "react-icons/fi"

const HomePage = () => {
  const { products, loading } = useProducts()

  // Get featured products (first 4)
  const featuredProducts = products.slice(0, 4)

  // Get ending soon products (sorted by end time)
  const endingSoonProducts = [...products].sort((a, b) => new Date(a.endTime) - new Date(b.endTime)).slice(0, 4)

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
              Discover, Bid, Win: Your Auction Adventure Starts Here
            </h1>
            <p className="text-xl mb-8">
              Join thousands of users buying and selling unique items in our dynamic auction marketplace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium text-lg shadow-md"
                >
                  Browse Auctions
                </motion.button>
              </Link>
              <Link to="/create-listing">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-medium text-lg"
                >
                  Sell an Item
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-xl text-gray-600">Simple, secure, and straightforward auctions</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div whileHover={{ y: -10 }} className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiPackage className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">List Your Items</h3>
              <p className="text-gray-600">
                Create detailed listings with photos, descriptions, and starting bids in just minutes.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -10 }} className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiClock className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">24-Hour Auctions</h3>
              <p className="text-gray-600">
                All auctions run for 24 hours, creating excitement and fair opportunities for all bidders.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -10 }} className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiShield className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Transactions</h3>
              <p className="text-gray-600">
                Our platform ensures safe payments and protects both buyers and sellers throughout the process.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Auctions</h2>
            <Link to="/products" className="text-indigo-600 hover:text-indigo-800 flex items-center">
              View all <FiArrowRight className="ml-2" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Ending Soon Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Ending Soon</h2>
            <Link to="/products" className="text-indigo-600 hover:text-indigo-800 flex items-center">
              View all <FiArrowRight className="ml-2" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {endingSoonProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Bidding?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our community of buyers and sellers today and discover unique items you won't find anywhere else.
          </p>
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-medium text-lg shadow-lg"
            >
              Sign Up Now
            </motion.button>
          </Link>
        </div>
      </section>
    </div>
  )
}

export default HomePage

