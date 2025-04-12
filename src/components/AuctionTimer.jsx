
import React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

const AuctionTimer = ({ endTime, compact = false }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(endTime) - new Date()

      if (difference <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isExpired: true,
        }
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isExpired: false,
      }
    }

    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [endTime])

  if (compact) {
    if (timeLeft.isExpired) {
      return <span className="text-red-500">Auction ended</span>
    }

    return (
      <span>
        {timeLeft.days > 0 && `${timeLeft.days}d `}
        {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s left
      </span>
    )
  }

  if (timeLeft.isExpired) {
    return (
      <div className="text-center">
        <div className="text-xl font-bold text-red-500 mb-2">Auction Ended</div>
      </div>
    )
  }

  return (
    <div className="flex justify-center space-x-4">
      <TimeUnit value={timeLeft.days} label="Days" />
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <TimeUnit value={timeLeft.minutes} label="Minutes" />
      <TimeUnit value={timeLeft.seconds} label="Seconds" />
    </div>
  )
}

const TimeUnit = ({ value, label }) => {
  return (
    <motion.div
      className="flex flex-col items-center"
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
    >
      <div className="bg-indigo-600 text-white rounded-lg w-14 h-14 flex items-center justify-center text-2xl font-bold">
        {value}
      </div>
      <div className="text-xs mt-1 text-gray-600">{label}</div>
    </motion.div>
  )
}

export default AuctionTimer

