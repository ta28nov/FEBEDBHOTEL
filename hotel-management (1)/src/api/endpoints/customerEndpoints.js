/**
 * Các endpoint API khách hàng
 *
 * File này định nghĩa các endpoint liên quan đến quản lý khách hàng,
 * tìm kiếm khách hàng và lịch sử đặt phòng của khách hàng.
 */
import apiClient from "../apiClient"

const customerEndpoints = {
  // Các thao tác với khách hàng
  getAllCustomers: () => apiClient.get("/customers"),
  getCustomerById: (id) => apiClient.get(`/customers/${id}`),
  createCustomer: (customerData) => apiClient.post("/customers", customerData),
  updateCustomer: (id, customerData) => apiClient.put(`/customers/${id}`, customerData),
  deleteCustomer: (id) => apiClient.delete(`/customers/${id}`),

  // Tìm kiếm khách hàng
  searchCustomers: (query) => apiClient.get("/customers/search", { params: { query } }),

  // Lịch sử đặt phòng của khách hàng
  getCustomerBookingHistory: (customerId) => apiClient.get(`/customers/${customerId}/bookings`),

  // Thống kê khách hàng
  getCustomerStatistics: () => apiClient.get("/customers/statistics"),
}

export default customerEndpoints

