"use client"

/**
 * Reports.jsx
 *
 * Vai trò: Trang báo cáo thống kê cho admin.
 * Chức năng:
 * - Hiển thị báo cáo doanh thu
 * - Hiển thị báo cáo công suất phòng
 * - Hiển thị báo cáo dịch vụ
 * - Xuất báo cáo
 *
 * Quyền truy cập: Admin
 */

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Line, Bar, Pie } from "react-chartjs-2"
import { FaDownload, FaChartLine, FaHotel, FaCogs } from "react-icons/fa"
import { format } from "date-fns"
import { toast } from "react-toastify"
import reportService from "../../../services/reportService"
import "./Reports.css"

const Reports = () => {
  const [activeTab, setActiveTab] = useState("revenue")
  const [period, setPeriod] = useState("monthly")
  const [revenueData, setRevenueData] = useState(null)
  const [occupancyData, setOccupancyData] = useState(null)
  const [serviceData, setServiceData] = useState(null)
  const [dateRange, setDateRange] = useState({
    startDate: format(new Date(new Date().getFullYear(), new Date().getMonth() - 6, 1), "yyyy-MM-dd"),
    endDate: format(new Date(), "yyyy-MM-dd"),
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReportData()
  }, [activeTab, period, dateRange])

  const fetchReportData = async () => {
    setLoading(true)
    try {
      switch (activeTab) {
        case "revenue":
          const revenueResponse = await reportService.getRevenueReport(period, dateRange.startDate, dateRange.endDate)
          prepareRevenueChartData(revenueResponse.data)
          break
        case "occupancy":
          const occupancyResponse = await reportService.getOccupancyReport(
            period,
            dateRange.startDate,
            dateRange.endDate,
          )
          prepareOccupancyChartData(occupancyResponse.data)
          break
        case "services":
          const serviceResponse = await reportService.getServiceReport("byCategory")
          prepareServiceChartData(serviceResponse.data)
          break
        default:
          break
      }
    } catch (error) {
      toast.error("Không thể tải dữ liệu báo cáo")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target
    setDateRange((prev) => ({ ...prev, [name]: value }))
  }

  const handleExportReport = async () => {
    try {
      let response
      switch (activeTab) {
        case "revenue":
          response = await reportService.exportRevenueReport(period, "xlsx")
          break
        case "occupancy":
          response = await reportService.exportOccupancyReport(period, "xlsx")
          break
        case "services":
          response = await reportService.exportServiceReport("byCategory", "xlsx")
          break
        default:
          break
      }

      // Create a download link for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `${activeTab}-report.xlsx`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success("Xuất báo cáo thành công")
    } catch (error) {
      toast.error("Không thể xuất báo cáo")
      console.error(error)
    }
  }

  // Prepare revenue chart data
  const prepareRevenueChartData = (data) => {
    const labels = data.map((item) => {
      const date = new Date(item.date || item.month || item.year)
      return period === "daily"
        ? format(date, "dd/MM")
        : period === "monthly"
          ? format(date, "MM/yyyy")
          : format(date, "yyyy")
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
      return period === "daily" ? format(date, "dd/MM") : format(date, "MM/yyyy")
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

  // Prepare service chart data
  const prepareServiceChartData = (data) => {
    const chartData = {
      labels: data.map((item) => item.category.charAt(0).toUpperCase() + item.category.slice(1)),
      datasets: [
        {
          label: "Doanh thu dịch vụ",
          data: data.map((item) => item.revenue / 1000000), // Convert to millions
          backgroundColor: ["#1a1a2e", "#b8860b", "#16213e", "#d4af37", "#0f3460", "#950740"],
          borderWidth: 1,
        },
      ],
    }

    setServiceData(chartData)
  }

  return (
    <div className="reports-container">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="page-header"
      >
        <h1>Báo cáo thống kê</h1>
        <button className="export-button" onClick={handleExportReport}>
          <FaDownload /> Xuất báo cáo
        </button>
      </motion.div>

      <div className="report-tabs">
        <button
          className={`tab-button ${activeTab === "revenue" ? "active" : ""}`}
          onClick={() => setActiveTab("revenue")}
        >
          <FaChartLine /> Doanh thu
        </button>
        <button
          className={`tab-button ${activeTab === "occupancy" ? "active" : ""}`}
          onClick={() => setActiveTab("occupancy")}
        >
          <FaHotel /> Công suất phòng
        </button>
        <button
          className={`tab-button ${activeTab === "services" ? "active" : ""}`}
          onClick={() => setActiveTab("services")}
        >
          <FaCogs /> Dịch vụ
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="report-controls"
      >
        {activeTab !== "services" && (
          <>
            <div className="period-selector">
              <label>Kỳ báo cáo:</label>
              <select value={period} onChange={(e) => setPeriod(e.target.value)}>
                <option value="daily">Ngày</option>
                <option value="monthly">Tháng</option>
                {activeTab === "revenue" && <option value="yearly">Năm</option>}
              </select>
            </div>

            <div className="date-range">
              <div className="date-input">
                <label>Từ ngày:</label>
                <input type="date" name="startDate" value={dateRange.startDate} onChange={handleDateRangeChange} />
              </div>
              <div className="date-input">
                <label>Đến ngày:</label>
                <input type="date" name="endDate" value={dateRange.endDate} onChange={handleDateRangeChange} />
              </div>
            </div>
          </>
        )}
      </motion.div>

      {loading ? (
        <div className="loading">Đang tải dữ liệu...</div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="report-content"
        >
          {activeTab === "revenue" && revenueData && (
            <div className="chart-container">
              <h3>Báo cáo doanh thu (triệu VND)</h3>
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
            </div>
          )}

          {activeTab === "occupancy" && occupancyData && (
            <div className="chart-container">
              <h3>Báo cáo công suất phòng (%)</h3>
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
            </div>
          )}

          {activeTab === "services" && serviceData && (
            <div className="chart-container">
              <h3>Báo cáo doanh thu theo loại dịch vụ (triệu VND)</h3>
              <div className="pie-chart-container">
                <Pie
                  data={serviceData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: "right",
                      },
                      tooltip: {
                        callbacks: {
                          label: (context) => `${context.label}: ${context.parsed} triệu VND`,
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

export default Reports

