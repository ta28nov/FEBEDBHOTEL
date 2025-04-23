"use client"

import { useEffect, useRef } from "react"
import { useInView } from "react-intersection-observer"
import { motion, useAnimation } from "framer-motion"
import "./ScrollReveal.css"

// Component tạo hiệu ứng xuất hiện khi cuộn đến phần tử
const ScrollReveal = ({
  children,
  threshold = 0.1,
  delay = 0,
  duration = 0.5,
  distance = 50,
  direction = "up", // 'up', 'down', 'left', 'right'
  once = true,
  className = "",
  style = {},
}) => {
  const controls = useAnimation()
  const [ref, inView] = useInView({
    threshold,
    triggerOnce: once,
  })

  const firstRender = useRef(true)

  // Xác định các giá trị ban đầu dựa trên hướng
  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { opacity: 0, y: distance }
      case "down":
        return { opacity: 0, y: -distance }
      case "left":
        return { opacity: 0, x: distance }
      case "right":
        return { opacity: 0, x: -distance }
      default:
        return { opacity: 0, y: distance }
    }
  }

  // Xác định các giá trị đích
  const getTargetPosition = () => {
    switch (direction) {
      case "up":
      case "down":
        return { opacity: 1, y: 0 }
      case "left":
      case "right":
        return { opacity: 1, x: 0 }
      default:
        return { opacity: 1, y: 0 }
    }
  }

  useEffect(() => {
    // Bỏ qua hiệu ứng ở lần render đầu tiên nếu phần tử đã trong tầm nhìn
    if (firstRender.current && inView) {
      controls.set({ opacity: 1, x: 0, y: 0 })
      firstRender.current = false
      return
    }

    if (inView) {
      controls.start(getTargetPosition())
    } else if (!once) {
      controls.start(getInitialPosition())
    }
  }, [inView, controls, once])

  return (
    <motion.div
      ref={ref}
      initial={getInitialPosition()}
      animate={controls}
      transition={{
        type: "spring",
        damping: 15,
        stiffness: 100,
        duration,
        delay,
      }}
      className={`scroll-reveal ${className}`}
      style={style}
    >
      {children}
    </motion.div>
  )
}

export default ScrollReveal

