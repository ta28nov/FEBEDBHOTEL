/**
 * Dịch vụ đặt phòng
 *
 * Dịch vụ này xử lý các thao tác liên quan đến đặt phòng
 */

import { bookingEndpoints } from "../api"

const bookingService = {
  // Các thao tác đặt phòng
  getAllBookings: async (params) => {
    try {
      return await bookingEndpoints.getAllBookings(params)
    } catch (error) {
      console.error("Lỗi lấy danh sách đặt phòng:", error)
      throw error
    }
  },

  getBookingById: async (id) => {
    try {
      const response = await bookingEndpoints.getBookingById(id)
      return response.data
    } catch (error) {
      console.error(`Lỗi lấy đặt phòng ${id}:`, error)
      throw error
    }
  },

  createBooking: async (bookingData) => {
    try {
      // Định dạng dữ liệu đặt phòng để phù hợp với API
      const formattedData = {
        room_id: bookingData.roomId,
        check_in_date: bookingData.checkInDate,
        check_out_date: bookingData.checkOutDate,
        guests: Number(bookingData.guests),
        customer_details: {
          first_name: bookingData.firstName,
          last_name: bookingData.lastName,
          email: bookingData.email,
          phone: bookingData.phone,
          special_requests: bookingData.specialRequests || "",
        },
        payment_method: bookingData.paymentMethod,
      }

      return await bookingEndpoints.createBooking(formattedData)
    } catch (error) {
      console.error("Lỗi tạo đặt phòng:", error)
      throw error
    }
  },

  updateBooking: async (id, bookingData) => {
    try {
      return await bookingEndpoints.updateBooking(id, bookingData)
    } catch (error) {
      console.error(`Lỗi cập nhật đặt phòng ${id}:`, error)
      throw error
    }
  },

  deleteBooking: async (id) => {
    try {
      return await bookingEndpoints.deleteBooking(id)
    } catch (error) {
      console.error(`Lỗi xóa đặt phòng ${id}:`, error)
      throw error
    }
  },

  // Quản lý trạng thái đặt phòng
  updateBookingStatus: async (id, statusData) => {
    try {
      return await bookingEndpoints.updateBookingStatus(id, statusData)
    } catch (error) {
      console.error(`Lỗi cập nhật trạng thái đặt phòng ${id}:`, error)
      throw error
    }
  },

  checkIn: async (id) => {
    try {
      return await bookingEndpoints.checkIn(id)
    } catch (error) {
      console.error(`Lỗi check-in đặt phòng ${id}:`, error)
      throw error
    }
  },

  checkOut: async (id) => {
    try {
      return await bookingEndpoints.checkOut(id)
    } catch (error) {
      console.error(`Lỗi check-out đặt phòng ${id}:`, error)
      throw error
    }
  },

  cancelBooking: async (id) => {
    try {
      return await bookingEndpoints.cancelBooking(id)
    } catch (error) {
      console.error("Lỗi hủy đặt phòng:", error)
      throw error
    }
  },

  // Lọc đặt phòng
  filterBookings: async (filters) => {
    try {
      // Định dạng lại các tham số lọc để phù hợp với API
      const formattedFilters = {
        status: filters.status || undefined,
        start_date: filters.startDate || undefined,
        end_date: filters.endDate || undefined,
        payment_status: filters.paymentStatus || undefined,
      }

      return await bookingEndpoints.filterBookings(formattedFilters)
    } catch (error) {
      console.error("Lỗi lọc đặt phòng:", error)
      throw error
    }
  },

  // Đặt phòng của người dùng hiện tại
  getMyBookings: async () => {
    try {
      const response = await bookingEndpoints.getMyBookings()
      return response.data
    } catch (error) {
      console.error("Lỗi lấy danh sách đặt phòng của tôi:", error)
      throw error
    }
  },

  // Liên quan đến thanh toán
  updatePaymentStatus: async (id, paymentStatus) => {
    try {
      return await bookingEndpoints.updatePaymentStatus(id, paymentStatus)
    } catch (error) {
      console.error(`Lỗi cập nhật trạng thái thanh toán đặt phòng ${id}:`, error)
      throw error
    }
  },

  processPayment: async (bookingId, paymentData) => {
    try {
      return await bookingEndpoints.processPayment(bookingId, paymentData)
    } catch (error) {
      console.error(`Lỗi xử lý thanh toán cho đặt phòng ${bookingId}:`, error)
      throw error
    }
  },

  // Dịch vụ cho đặt phòng
  addServiceToBooking: async (bookingId, serviceData) => {
    try {
      return await bookingEndpoints.addServiceToBooking(bookingId, serviceData)
    } catch (error) {
      console.error(`Lỗi thêm dịch vụ vào đặt phòng ${bookingId}:`, error)
      throw error
    }
  },

  removeServiceFromBooking: async (bookingId, serviceId) => {
    try {
      return await bookingEndpoints.removeServiceFromBooking(bookingId, serviceId)
    } catch (error) {
      console.error(`Lỗi xóa dịch vụ ${serviceId} khỏi đặt phòng ${bookingId}:`, error)
      throw error
    }
  },

  getBookingServices: async (bookingId) => {
    try {
      return await bookingEndpoints.getBookingServices(bookingId)
    } catch (error) {
      console.error(`Lỗi lấy dịch vụ của đặt phòng ${bookingId}:`, error)
      throw error
    }
  },

  // Tạo hóa đơn
  createInvoice: async (bookingId) => {
    try {
      return await bookingEndpoints.createInvoice(bookingId)
    } catch (error) {
      console.error(`Lỗi tạo hóa đơn cho đặt phòng ${bookingId}:`, error)
      throw error
    }
  },

  getInvoice: async (bookingId) => {
    try {
      return await bookingEndpoints.getInvoice(bookingId)
    } catch (error) {
      console.error(`Lỗi lấy hóa đơn cho đặt phòng ${bookingId}:`, error)
      throw error
    }
  },

  downloadInvoice: async (bookingId) => {
    try {
      const response = await bookingEndpoints.downloadInvoice(bookingId)

      // Tạo URL cho blob và tải xuống
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `invoice-${bookingId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()

      return response
    } catch (error) {
      console.error(`Lỗi tải hóa đơn cho đặt phòng ${bookingId}:`, error)
      throw error
    }
  },
}

export default bookingService

