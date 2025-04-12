import React from "react"
import { Link } from "react-router-dom"
import { FiHeart, FiInstagram, FiTwitter, FiFacebook } from "react-icons/fi"

const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="text-2xl font-bold text-indigo-600 mb-4">BidBay</div>
            <p className="text-gray-500 mb-4 max-w-md">
              The premier auction platform for buying and selling unique items. List your products, place bids, and
              discover amazing deals.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Facebook</span>
                <FiFacebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Instagram</span>
                <FiInstagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Twitter</span>
                <FiTwitter className="h-6 w-6" />
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Navigation</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/" className="text-base text-gray-500 hover:text-gray-900">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-base text-gray-500 hover:text-gray-900">
                  Browse Auctions
                </Link>
              </li>
              <li>
                <Link to="/create-listing" className="text-base text-gray-500 hover:text-gray-900">
                  Sell an Item
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-base text-gray-500 hover:text-gray-900">
                  My Account
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Support</h3>
            <ul className="mt-4 space-y-4">
              <li>
                <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 text-center">
            &copy; {new Date().getFullYear()} BidBay. All rights reserved. Made with{" "}
            <FiHeart className="inline h-4 w-4 text-red-500" />
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

