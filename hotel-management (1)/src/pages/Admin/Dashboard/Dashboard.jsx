"use client"

/**
 * Dashboard.jsx
 *
 * Vai trò: Trang dashboard cho admin và nhân viên.
 * Chức năng:
 * - Hiển thị tổng quan về hoạt động của khách sạn
 * - Hiển thị các thống kê quan trọng
 * - Hiển thị biểu đồ doanh thu, công suất phòng
 * - Hiển thị danh sách đặt phòng mới nhất
 *
 * Quyền truy cập: Admin và Employee
 */

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FaUsers, FaBed, FaCalendarCheck, FaMoneyBillWave } from "react-icons/fa"
import { Line, Bar, Doughnut } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { format } from "date-fns"
import roomService from "../../../services/roomService"
import bookingService from "../../../services/bookingService"
import customerService from "../../../services/customerService"
import reportService from "../../../services/reportService"
import { formatCurrency } from "../../../config/constants"
import "./Dashboard.css"

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend)

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    totalBookings: 0,
    totalCustomers: 0,
    totalRevenue: 0,
  })
  const [revenueData, setRevenueData] = useState(null)
  const [occupancyData, setOccupancyData] = useState(null)
  const [roomTypeData, setRoomTypeData] = useState(null)
  const [recentBookings, setRecentBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // Fetch rooms data
        const roomsResponse = await roomService.getAllRooms()
        const rooms = roomsResponse.data
        const availableRooms = rooms.filter((room) => room.status === "available").length

        // Fetch bookings data
        const bookingsResponse = await bookingService.getAllBookings()
        const bookings = bookingsResponse.data

        // Fetch customers data
        const customersResponse = await customerService.getAllCustomers()
        const customers = customersResponse.data

        // Fetch revenue data
        const revenueResponse = await reportService.getRevenueReport("monthly")
        const revenueData = revenueResponse.data

        // Fetch occupancy data
        const occupancyResponse = await reportService.getOccupancyReport("daily")
        const occupancyData = occupancyResponse.data

        // Calculate total revenue
        const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0)

        // Set stats
        setStats({
          totalRooms: rooms.length,
          availableRooms,
          totalBookings: bookings.length,
          totalCustomers: customers.length,
          totalRevenue,
        })

        // Set recent bookings
        setRecentBookings(bookings.slice(0, 5))

        // Prepare chart data
        prepareRevenueChartData(revenueData)
        prepareOccupancyChartData(occupancyData)
        prepareRoomTypeChartData(rooms)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  // Prepare revenue chart data
  const prepareRevenueChartData = (data) => {
    const labels = data.map((item) => {
      const date = new Date(item.month || item.date || item.year)
      return format(date, "MMM yyyy")
    })

    const chartData = {
      labels,
      datasets: [
        {
          label: "Doanh thu",
          data: data.map((item) => item.revenue / 1000000), // Convert to millions
          borderColor: "#1a1a2e",
          backgroundColor: "rgba(26, 26, 46, 0.1)",
          tension: 0.4,
          fill: true,
        },
        {
          label: "Doanh thu dịch vụ",
          data: data.map((item) => item.services / 1000000), // Convert to millions
          borderColor: "#b8860b",
          backgroundColor: "rgba(184, 134, 11, 0.1)",
          tension: 0.4,
          fill: true,
        },
      ],
    }

    setRevenueData(chartData)
  }

  // Prepare occupancy chart data
  const prepareOccupancyChartData = (data) => {
    const labels = data.map((item) => {
      const date = new Date(item.date || item.month)
      return format(date, "dd/MM")
    })

    const chartData = {
      labels,
      datasets: [
        {
          label: "Tỷ lệ lấp đầy (%)",
          data: data.map((item) => item.occupancy),
          backgroundColor: "#1a1a2e",
        },
      ],
    }

    setOccupancyData(chartData)
  }

  // Prepare room type chart data
  const prepareRoomTypeChartData = (rooms) => {
    const roomTypes = {}

    rooms.forEach((room) => {
      if (roomTypes[room.type]) {
        roomTypes[room.type]++
      } else {
        roomTypes[room.type] = 1
      }
    })

    const labels = Object.keys(roomTypes).map((type) => type.charAt(0).toUpperCase() + type.slice(1))

    const chartData = {
      labels,
      datasets: [
        {
          data: Object.values(roomTypes),
          backgroundColor: ["#1a1a2e", "#b8860b", "#16213e", "#d4af37", "#0f3460"],
          borderWidth: 1,
        },
      ],
    }

    setRoomTypeData(chartData)
  }

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard data...</div>
  }

  return (
    <div className="dashboard-container">
      <motion.h1
        className="dashboard-title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Dashboard
      </motion.h1>

      {/* Stats Cards */}
      <motion.div
        className="stats-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="stat-card">
          <div className="stat-icon rooms-icon">
            <FaBed />
          </div>
          <div className="stat-content">
            <h3>Phòng</h3>
            <div className="stat-numbers">
              <span className="stat-main">{stats.availableRooms}</span>
              <span className="stat-sub">/ {stats.totalRooms}</span>
            </div>
            <p className="stat-label">Phòng trống</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon bookings-icon">
            <FaCalendarCheck />
          </div>
          <div className="stat-content">
            <h3>Đặt phòng</h3>
            <div className="stat-numbers">
              <span className="stat-main">{stats.totalBookings}</span>
            </div>
            <p className="stat-label">Tổng số đặt phòng</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon customers-icon">
            <FaUsers />
          </div>
          <div className="stat-content">
            <h3>Khách hàng</h3>
            <div className="stat-numbers">
              <span className="stat-main">{stats.totalCustomers}</span>
            </div>
            <p className="stat-label">Tổng số khách hàng</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon revenue-icon">
            <FaMoneyBillWave />
          </div>
          <div className="stat-content">
            <h3>Doanh thu</h3>
            <div className="stat-numbers">
              <span className="stat-main">{formatCurrency(stats.totalRevenue)}</span>
            </div>
            <p className="stat-label">Tổng doanh thu</p>
          </div>
        </div>
      </motion.div>

      {/* Charts */}
      <div className="charts-container">
        <motion.div
          className="chart-card revenue-chart"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h3>Doanh thu theo tháng (triệu VND)</h3>
          {revenueData && (
            <Line
              data={revenueData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => `${context.dataset.label}: ${context.parsed.y} triệu VND`,
                    },
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: "Triệu VND",
                    },
                  },
                },
              }}
            />
          )}
        </motion.div>

        <motion.div
          className="chart-card occupancy-chart"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h3>Tỷ lệ lấp đầy phòng (%)</h3>
          {occupancyData && (
            <Bar
              data={occupancyData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                      display: true,
                      text: "Tỷ lệ (%)",
                    },
                  },
                },
              }}
            />
          )}
        </motion.div>

        <motion.div
          className="chart-card room-type-chart"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3>Phân bố loại phòng</h3>
          {roomTypeData && (
            <Doughnut
              data={roomTypeData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "right",
                  },
                },
              }}
            />
          )}
        </motion.div>
      </div>

      {/* Recent Bookings */}
      <motion.div
        className="recent-bookings"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h3>Đặt phòng gần đây</h3>
        <div className="table-container">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Mã đặt phòng</th>
                <th>Khách hàng</th>
                <th>Phòng</th>
                <th>Ngày nhận phòng</th>
                <th>Ngày trả phòng</th>
                <th>Trạng thái</th>
                <th>Tổng tiền</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking) => (
                <tr key={booking.id}>
                  <td>#{booking.id}</td>
                  <td>{booking.customerName}</td>
                  <td>{booking.roomNumber}</td>
                  <td>{format(new Date(booking.checkInDate), "dd/MM/yyyy")}</td>
                  <td>{format(new Date(booking.checkOutDate), "dd/MM/yyyy")}</td>
                  <td>
                    <span className={`status-badge status-${booking.status}`}>
                      {booking.status === "confirmed"
                        ? "Đã xác nhận"
                        : booking.status === "pending"
                          ? "Chờ xác nhận"
                          : booking.status === "checked_in"
                            ? "Đã nhận phòng"
                            : booking.status === "checked_out"
                              ? "Đã trả phòng"
                              : booking.status === "cancelled"
                                ? "Đã hủy"
                                : booking.status}
                    </span>
                  </td>
                  <td>{formatCurrency(booking.totalAmount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard

