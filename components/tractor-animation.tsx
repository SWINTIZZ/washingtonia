"use client"

import { motion } from "framer-motion"
import { Tractor } from "lucide-react"

export default function TractorAnimation({ isActive }: { isActive: boolean }) {
  return (
    <div className="relative h-16 w-full">
      <motion.div
        className="absolute left-0"
        animate={isActive ? { x: [0, 100, 0] } : { x: 0 }}
        transition={{ duration: 2, repeat: isActive ? Number.POSITIVE_INFINITY : 0, repeatType: "reverse" }}
      >
        <div className="relative">
          <Tractor className="h-12 w-12 text-amber-600" />
          {/* Fumée du tracteur */}
          {isActive && (
            <>
              <motion.div
                className="absolute -top-2 -right-2 h-3 w-3 rounded-full bg-gray-300 opacity-80"
                animate={{ y: [-5, -15], opacity: [0.8, 0], scale: [1, 1.5] }}
                transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
              />
              <motion.div
                className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-gray-300 opacity-70"
                animate={{ y: [-5, -12], opacity: [0.7, 0], scale: [1, 1.3] }}
                transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", delay: 0.2 }}
              />
            </>
          )}
        </div>
      </motion.div>
      {/* Traces de roues */}
      {isActive && (
        <div className="absolute bottom-0 left-0 right-0 h-1 flex justify-between">
          <motion.div
            className="h-1 w-full bg-amber-200 opacity-50"
            animate={{ opacity: [0, 0.5, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          />
        </div>
      )}
    </div>
  )
}
