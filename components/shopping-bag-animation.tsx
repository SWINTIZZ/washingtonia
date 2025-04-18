"use client"

import { motion } from "framer-motion"
import { ShoppingBag, Apple, Carrot } from "lucide-react"

export default function ShoppingBagAnimation({ isActive }: { isActive: boolean }) {
  return (
    <div className="relative h-24 w-full flex items-center justify-center">
      <div className="relative">
        <motion.div
          animate={isActive ? { rotate: [-5, 5, -5] } : { rotate: 0 }}
          transition={{ repeat: isActive ? Number.POSITIVE_INFINITY : 0, duration: 0.5 }}
        >
          <ShoppingBag className="h-16 w-16 text-rose-600" />
        </motion.div>

        {/* Produits qui sortent du sac */}
        {isActive && (
          <>
            <motion.div
              className="absolute top-0 -right-2"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: [-5, -15], opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, repeatType: "loop" }}
            >
              <Apple className="h-6 w-6 text-red-500" />
            </motion.div>
            <motion.div
              className="absolute top-0 -left-2"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: [-8, -20], opacity: [0, 1, 0] }}
              transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY, repeatType: "loop", delay: 0.3 }}
            >
              <Carrot className="h-6 w-6 text-orange-500" />
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}
