"use client"
import React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useNotifications } from "../contexts/NotificationContext"
import { FiBell, FiX, FiCheck } from "react-icons/fi"

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { notifications, markAsRead, markAllAsRead, clearNotification } = useNotifications()

  const unreadCount = notifications.filter((n) => !n.read).length

  const toggleOpen = () => {
    setIsOpen(!isOpen)
    if (!isOpen && unreadCount > 0) {
      markAllAsRead()
    }
  }

  // Show the latest notification as a toast if it's unread
  const latestUnread = notifications.find((n) => !n.read)

  return (
    <>
      {/* Toast notification for latest unread */}
      <AnimatePresence>
        {latestUnread && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 20, x: "-50%" }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50 bg-white shadow-lg rounded-lg p-4 max-w-md w-full"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <FiBell className="h-6 w-6 text-indigo-600" />
                </div>
              </div>
              <div className="ml-3 w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">{latestUnread.message}</p>
                <p className="mt-1 text-sm text-gray-500">{new Date(latestUnread.time).toLocaleTimeString()}</p>
              </div>
              <div className="ml-4 flex-shrink-0 flex">
                <button
                  onClick={() => markAsRead(latestUnread.id)}
                  className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span className="sr-only">Close</span>
                  <FiX className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed inset-0 z-40 overflow-hidden"
            onClick={() => setIsOpen(false)}
          >
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
              <section
                className="absolute inset-y-0 right-0 pl-10 max-w-full flex sm:pl-16"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-screen max-w-md">
                  <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex items-start justify-between">
                        <h2 className="text-lg font-medium text-gray-900">Notifications</h2>
                        <div className="ml-3 h-7 flex items-center">
                          <button
                            onClick={() => setIsOpen(false)}
                            className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500"
                          >
                            <span className="sr-only">Close panel</span>
                            <FiX className="h-6 w-6" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6">
                      {notifications.length === 0 ? (
                        <div className="text-center py-10">
                          <FiBell className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
                          <p className="mt-1 text-sm text-gray-500">You don't have any notifications yet.</p>
                        </div>
                      ) : (
                        <ul className="divide-y divide-gray-200">
                          {notifications.map((notification) => (
                            <li key={notification.id} className="py-4">
                              <div className="flex items-start">
                                <div
                                  className={`flex-shrink-0 pt-0.5 ${notification.read ? "text-gray-400" : "text-indigo-600"}`}
                                >
                                  <FiBell className="h-5 w-5" />
                                </div>
                                <div className="ml-3 flex-1">
                                  <p
                                    className={`text-sm ${notification.read ? "text-gray-500" : "text-gray-900 font-medium"}`}
                                  >
                                    {notification.message}
                                  </p>
                                  <p className="mt-1 text-xs text-gray-500">
                                    {new Date(notification.time).toLocaleString()}
                                  </p>
                                </div>
                                <div className="ml-4 flex-shrink-0 flex">
                                  {!notification.read && (
                                    <button
                                      onClick={() => markAsRead(notification.id)}
                                      className="mr-2 bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500"
                                    >
                                      <span className="sr-only">Mark as read</span>
                                      <FiCheck className="h-5 w-5" />
                                    </button>
                                  )}
                                  <button
                                    onClick={() => clearNotification(notification.id)}
                                    className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500"
                                  >
                                    <span className="sr-only">Dismiss</span>
                                    <FiX className="h-5 w-5" />
                                  </button>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default NotificationCenter

