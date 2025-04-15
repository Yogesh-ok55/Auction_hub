"use client"
import React from "react"
import { createContext, useState, useEffect, useContext } from "react"
import { useAuth } from "./AuthContext"

const ProductContext = createContext()

export const useProducts = () => useContext(ProductContext)

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { currentUser } = useAuth()

  // Simulate fetching products from an API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // In a real app, you would fetch from an API
        const mockProducts = [
          {
            id: "1",
            title: "Vintage Camera",
            description: "A beautiful vintage camera in excellent condition.",
            images: [
              "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            ],
            startingBid: 50,
            currentBid: 65,
            seller: "user123",
            endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            bids: [
              { userId: "user456", amount: 55, time: "2023-01-01T10:00:00Z" },
              { userId: "user789", amount: 65, time: "2023-01-01T11:00:00Z" },
            ],
            category: "Electronics",
          },
          {
            id: "2",
            title: "Leather Jacket",
            description: "Genuine leather jacket, barely worn.",
            images: [
              "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            ],
            startingBid: 100,
            currentBid: 120,
            seller: "user456",
            endTime: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
            bids: [
              { userId: "user123", amount: 110, time: "2023-01-02T10:00:00Z" },
              { userId: "user789", amount: 120, time: "2023-01-02T11:00:00Z" },
            ],
            category: "Fashion",
          },
          {
            id: "3",
            title: "Antique Watch",
            description: "Rare antique watch from the 1920s, still works perfectly.",
            images: [
              "https://images.unsplash.com/photo-1524805444758-089113d48a6d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            ],
            startingBid: 200,
            currentBid: 250,
            seller: "user789",
            endTime: new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString(),
            bids: [
              { userId: "user123", amount: 220, time: "2023-01-03T10:00:00Z" },
              { userId: "user456", amount: 250, time: "2023-01-03T11:00:00Z" },
            ],
            category: "Jewelry",
          },
          {
            id: "4",
            title: "Gaming Console",
            description: "Latest gaming console with two controllers and 3 games.",
            images: [
              "https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            ],
            startingBid: 300,
            currentBid: 350,
            seller: "user123",
            endTime: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
            bids: [
              { userId: "user456", amount: 320, time: "2023-01-04T10:00:00Z" },
              { userId: "user789", amount: 350, time: "2023-01-04T11:00:00Z" },
            ],
            category: "Electronics",
          },
          {
            id: "5",
            title: "Handmade Pottery Set",
            description: "Beautiful handmade pottery set with 4 plates, 4 bowls, and 4 mugs.",
            images: [
              "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            ],
            startingBid: 80,
            currentBid: 95,
            seller: "user456",
            endTime: new Date(Date.now() + 60 * 60 * 60 * 1000).toISOString(),
            bids: [
              { userId: "user123", amount: 85, time: "2023-01-05T10:00:00Z" },
              { userId: "user789", amount: 95, time: "2023-01-05T11:00:00Z" },
            ],
            category: "Home & Garden",
          },
        ]

        setProducts(mockProducts)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching products:", error)
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  
  const createListing = (productData) => {
    if (!currentUser) return false

    const newProduct = {
      ...productData,
      id: Date.now().toString(),
      seller: currentUser.id,
      currentBid: productData.startingBid,
      bids: [],
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
      createdAt: new Date().toISOString(),
    }

    setProducts([...products, newProduct])
    return newProduct
  }

  // Place a bid on a product
  const placeBid = (productId, bidAmount) => {
    if (!currentUser) return false

    setProducts((prevProducts) =>
      prevProducts.map((product) => {
        if (product.id === productId && bidAmount > product.currentBid) {
          const newBid = {
            userId: currentUser.id,
            amount: bidAmount,
            time: new Date().toISOString(),
          }

          return {
            ...product,
            currentBid: bidAmount,
            bids: [...product.bids, newBid],
          }
        }
        return product
      }),
    )

    return true
  }

  // Get a single product by ID
  const getProduct = (productId) => {
    return products.find((product) => product.id === productId)
  }

  // Get products by category
  const getProductsByCategory = (category) => {
    return products.filter((product) => product.category === category)
  }

  // Get products by seller
  const getProductsBySeller = (sellerId) => {
    return products.filter((product) => product.seller === sellerId)
  }

  // Get products user has bid on
  const getBidProducts = (userId) => {
    return products.filter((product) => product.bids.some((bid) => bid.userId === userId))
  }

  const value = {
    products,
    loading,
    createListing,
    placeBid,
    getProduct,
    getProductsByCategory,
    getProductsBySeller,
    getBidProducts,
  }

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
}

