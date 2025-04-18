"use client"

import { motion } from "framer-motion"
import { Mail } from "lucide-react"

export default function EnvelopeAnimation({ isActive }: { isActive: boolean }) {
  return (
    <div className="relative h-24 w-full flex items-center justify-center">
      <div className="relative w-40 h-28 perspective">
        {/* Enveloppe */}
        <div className="relative w-40 h-28 bg-white border-2 border-teal-500 rounded-md shadow-md">
          {/* Rabat de l'enveloppe */}
          <motion.div
            className="absolute top-0 left-0 w-full h-14 bg-teal-100 border-b-2 border-teal-500 origin-bottom"
            style={{ transformStyle: "preserve-3d", zIndex: 10 }}
            animate={isActive ? { rotateX: 180 } : { rotateX: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <Mail className="h-6 w-6 text-teal-600" />
            </div>
          </motion.div>

          {/* Contenu de la lettre */}
          {isActive && (
            <motion.div
              className="absolute top-4 left-4 right-4 bottom-4 bg-white border border-gray-200 rounded shadow-sm p-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-full h-full flex flex-col">
                <div className="border-b border-gray-200 w-full mb-1" />
                <div className="border-b border-gray-200 w-3/4 mb-1" />
                <div className="border-b border-gray-200 w-1/2 mb-1" />
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
