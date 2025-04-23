/**
 * Dịch vụ báo cáo
 *
 * Dịch vụ này xử lý các thao tác liên quan đến báo cáo doanh thu,
 * công suất phòng và xuất báo cáo
 */

import { reportEndpoints } from "../api"

const reportService = {
  // Báo cáo doanh thu
  getRevenueReport: async (period, startDate, endDate) => {
    try {
      return await reportEndpoints.getRevenueReport(period, startDate, endDate)
    } catch (error) {
      console.error("Lỗi lấy báo cáo doanh thu:", error)
      throw error
    }
  },

  // Báo cáo công suất phòng
  getOccupancyReport: async (period, startDate, endDate) => {
    try {
      return await reportEndpoints.getOccupancyReport(period, startDate, endDate)
    } catch (error) {
      console.error("Lỗi lấy báo cáo công suất phòng:", error)
      throw error
    }
  },

  // Báo cáo dịch vụ
  getServiceReport: async (groupBy) => {
    try {
      return await reportEndpoints.getServiceReport(groupBy)
    } catch (error) {
      console.error("Lỗi lấy báo cáo dịch vụ:", error)
      throw error
    }
  },

  // Xuất báo cáo
  exportRevenueReport: async (period, format) => {
    try {
      return await reportEndpoints.exportRevenueReport(period, format)
    } catch (error) {
      console.error("Lỗi xuất báo cáo doanh thu:", error)
      throw error
    }
  },

  exportOccupancyReport: async (period, format) => {
    try {
      return await reportEndpoints.exportOccupancyReport(period, format)
    } catch (error) {
      console.error("Lỗi xuất báo cáo công suất phòng:", error)
      throw error
    }
  },

  exportServiceReport: async (groupBy, format) => {
    try {
      return await reportEndpoints.exportServiceReport(groupBy, format)
    } catch (error) {
      console.error("Lỗi xuất báo cáo dịch vụ:", error)
      throw error
    }
  },

  // Thống kê dashboard
  getDashboardStatistics: async () => {
    try {
      return await reportEndpoints.getDashboardStatistics()
    } catch (error) {
      console.error("Lỗi lấy thống kê dashboard:", error)
      throw error
    }
  },
}

export default reportService

