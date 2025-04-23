/**
 * Các endpoint API báo cáo
 *
 * File này định nghĩa các endpoint liên quan đến báo cáo doanh thu,
 * công suất phòng, dịch vụ và xuất báo cáo.
 */
import apiClient from "../apiClient"

const reportEndpoints = {
  // Báo cáo doanh thu
  getRevenueReport: (period, startDate, endDate) =>
    apiClient.get("/reports/revenue", {
      params: { period, start_date: startDate, end_date: endDate },
    }),

  // Báo cáo công suất phòng
  getOccupancyReport: (period, startDate, endDate) =>
    apiClient.get("/reports/occupancy", {
      params: { period, start_date: startDate, end_date: endDate },
    }),

  // Báo cáo dịch vụ
  getServiceReport: (groupBy, startDate, endDate) =>
    apiClient.get("/reports/services", {
      params: { group_by: groupBy, start_date: startDate, end_date: endDate },
    }),

  // Xuất báo cáo
  exportRevenueReport: (period, format, startDate, endDate) =>
    apiClient.get("/reports/revenue/export", {
      params: { period, format, start_date: startDate, end_date: endDate },
      responseType: "blob",
    }),

  exportOccupancyReport: (period, format, startDate, endDate) =>
    apiClient.get("/reports/occupancy/export", {
      params: { period, format, start_date: startDate, end_date: endDate },
      responseType: "blob",
    }),

  exportServiceReport: (groupBy, format, startDate, endDate) =>
    apiClient.get("/reports/services/export", {
      params: { group_by: groupBy, format, start_date: startDate, end_date: endDate },
      responseType: "blob",
    }),

  // Thống kê dashboard
  getDashboardStatistics: () => apiClient.get("/reports/dashboard"),
}

export default reportEndpoints

