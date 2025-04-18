"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Leaf, Tractor, ShoppingBag, FileText, Mail, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface AnimatedButtonProps {
  id: string
  title: string
  color: string
  hoverColor: string
  textColor: string
  icon: React.ReactNode
  onClick: (id: string) => void
  isActive: boolean
}

export function AnimatedButton({
  id,
  title,
  color,
  hoverColor,
  textColor,
  icon,
  onClick,
  isActive,
}: AnimatedButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Animations spécifiques pour chaque bouton
  const getButtonAnimation = () => {
    switch (id) {
      case "about":
        return (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
            animate={isHovered ? { opacity: 1, scale: 1, rotate: 360 } : { opacity: 0, scale: 0.5, rotate: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Leaf className="h-12 w-12 text-white" />
          </motion.div>
        )
      case "services":
        return (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, x: -20 }}
            animate={isHovered ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              animate={isHovered ? { y: [-2, 2, -2] } : {}}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.3 }}
            >
              <Tractor className="h-12 w-12 text-white" />
            </motion.div>
          </motion.div>
        )
      case "products":
        return (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              animate={isHovered ? { rotate: [-5, 5, -5] } : {}}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.5 }}
            >
              <ShoppingBag className="h-12 w-12 text-white" />
            </motion.div>
          </motion.div>
        )
      case "blog":
        return (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              animate={isHovered ? { scale: [1, 1.1, 1] } : {}}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1 }}
            >
              <FileText className="h-12 w-12 text-white" />
            </motion.div>
          </motion.div>
        )
      case "contact":
        return (
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            <motion.div
              className="w-16 h-12 bg-white rounded-sm flex items-center justify-center relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="absolute inset-0 bg-teal-100 rounded-sm"
                initial={{ rotateX: 0 }}
                animate={isHovered ? { rotateX: 180 } : { rotateX: 0 }}
                transition={{ duration: 0.5 }}
                style={{ transformOrigin: "center bottom" }}
              />
              <Mail className="h-6 w-6 text-teal-600 z-10" />
            </motion.div>
          </div>
        )
      case "partners":
        return (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              animate={isHovered ? { rotateY: 180 } : { rotateY: 0 }}
              transition={{ duration: 0.5 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Users className="h-12 w-12 text-white" />
            </motion.div>
          </motion.div>
        )
      default:
        return null
    }
  }

  return (
    <motion.div
      className="perspective"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <button
        onClick={() => onClick(id)}
        className={cn(
          "relative flex flex-col items-center justify-center w-24 h-24 md:w-32 md:h-32 rounded-full",
          "transition-all duration-300 transform overflow-hidden",
          color,
          hoverColor,
          isActive ? "ring-4 ring-white/50" : "",
        )}
      >
        {/* Animation spécifique au survol */}
        {getButtonAnimation()}

        {/* Contenu par défaut du bouton */}
        <motion.div
          className="flex flex-col items-center justify-center"
          animate={isHovered ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="text-white">{icon}</div>
          <span className="text-white font-medium mt-2">{title}</span>
        </motion.div>
      </button>
    </motion.div>
  )
}

// Composant pour les petits boutons de navigation en bas
export function SmallAnimatedButton({
  id,
  color,
  textColor,
  icon,
  onClick,
  isActive,
}: Omit<AnimatedButtonProps, "title" | "hoverColor">) {
  return (
    <motion.button
      onClick={() => onClick(id)}
      className={cn(
        "p-3 rounded-full transition-all",
        isActive ? color : "bg-gray-100",
        isActive ? "text-white" : textColor,
      )}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {icon}
    </motion.button>
  )
}
