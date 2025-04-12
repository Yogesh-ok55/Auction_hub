"use client"
import React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import { useProducts } from "./ProductContext"
import { useAuth } from "./AuthContext"

const NotificationContext = createContext()

export const useNotifications = () => useContext(NotificationContext)

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])
  const { products } = useProducts()
  const { currentUser } = useAuth()

  // Check for outbid notifications whenever products change
  useEffect(() => {
    if (!currentUser) return

    // Find products where the user has been outbid
    const userBidProducts = products.filter((product) => product.bids.some((bid) => bid.userId === currentUser.id))

    userBidProducts.forEach((product) => {
      const userHighestBid = Math.max(
        ...product.bids.filter((bid) => bid.userId === currentUser.id).map((bid) => bid.amount),
      )

      if (product.currentBid > userHighestBid) {
        // User has been outbid
        const existingNotification = notifications.find((n) => n.type === "outbid" && n.productId === product.id)

        if (!existingNotification) {
          addNotification({
            type: "outbid",
            message: `You've been outbid on ${product.title}!`,
            productId: product.id,
            time: new Date().toISOString(),
          })
        }
      }
    })
  }, [products, currentUser, notifications])

  // Add a new notification
  const addNotification = (notification) => {
    setNotifications((prev) => [
      {
        id: Date.now().toString(),
        read: false,
        ...notification,
      },
      ...prev,
    ])
  }

  // Mark a notification as read
  const markAsRead = (notificationId) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === notificationId ? { ...notification, read: true } : notification)),
    )
  }

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  // Clear a notification
  const clearNotification = (notificationId) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== notificationId))
  }

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([])
  }

  const value = {
    notifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

