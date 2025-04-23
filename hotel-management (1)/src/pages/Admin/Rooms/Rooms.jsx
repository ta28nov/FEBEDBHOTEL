"use client"

/**
 * Rooms.jsx
 *
 * Vai trò: Trang quản lý phòng cho admin và nhân viên.
 * Chức năng:
 * - Hiển thị danh sách phòng
 * - Thêm, sửa, xóa phòng
 * - Lọc và tìm kiếm phòng
 *
 * Quyền truy cập: Admin và Employee
 */

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import RoomList from "../../../components/admin/rooms/RoomList"
import "./Rooms.css"

const Rooms = () => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="admin-rooms-container">
      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading rooms data...</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <RoomList />
        </motion.div>
      )}
    </div>
  )
}

export default Rooms

