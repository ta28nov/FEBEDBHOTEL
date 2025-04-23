/**
 * Dịch vụ phòng
 *
 * Dịch vụ này xử lý các thao tác liên quan đến phòng
 */

import { roomEndpoints } from "../api"

const roomService = {
  // Các thao tác với phòng
  getAllRooms: async () => {
    try {
      return await roomEndpoints.getAllRooms()
    } catch (error) {
      console.error("Lỗi lấy tất cả phòng:", error)
      throw error
    }
  },

  getRoomById: async (id) => {
    try {
      return await roomEndpoints.getRoomById(id)
    } catch (error) {
      console.error(`Lỗi lấy phòng ${id}:`, error)
      throw error
    }
  },

  createRoom: async (roomData) => {
    try {
      // Xử lý dữ liệu trước khi gửi đi nếu cần
      const formattedData = {
        ...roomData,
        price: Number(roomData.price),
        capacity: Number(roomData.capacity),
        beds: Number(roomData.beds),
        amenities: Array.isArray(roomData.amenities) ? roomData.amenities : [],
      }

      return await roomEndpoints.createRoom(formattedData)
    } catch (error) {
      console.error("Lỗi tạo phòng:", error)
      throw error
    }
  },

  updateRoom: async (id, roomData) => {
    try {
      // Xử lý dữ liệu trước khi gửi đi nếu cần
      const formattedData = {
        ...roomData,
        price: Number(roomData.price),
        capacity: Number(roomData.capacity),
        beds: Number(roomData.beds),
        amenities: Array.isArray(roomData.amenities) ? roomData.amenities : [],
      }

      return await roomEndpoints.updateRoom(id, formattedData)
    } catch (error) {
      console.error(`Lỗi cập nhật phòng ${id}:`, error)
      throw error
    }
  },

  deleteRoom: async (id) => {
    try {
      return await roomEndpoints.deleteRoom(id)
    } catch (error) {
      console.error(`Lỗi xóa phòng ${id}:`, error)
      throw error
    }
  },

  // Lọc phòng và kiểm tra tình trạng
  filterRooms: async (filters) => {
    try {
      // Định dạng lại các tham số lọc để phù hợp với API
      const formattedFilters = {
        type: filters.type || undefined,
        status: filters.status || undefined,
        min_price: filters.minPrice || undefined,
        max_price: filters.maxPrice || undefined,
        capacity: filters.capacity || undefined,
        amenities: filters.amenities || undefined,
      }

      return await roomEndpoints.filterRooms(formattedFilters)
    } catch (error) {
      console.error("Lỗi lọc phòng:", error)
      throw error
    }
  },

  checkAvailability: async (startDate, endDate, guests) => {
    try {
      return await roomEndpoints.checkAvailability(startDate, endDate, guests)
    } catch (error) {
      console.error("Lỗi kiểm tra tình trạng phòng:", error)
      throw error
    }
  },

  // Loại phòng và tiện nghi
  getRoomTypes: async () => {
    try {
      return await roomEndpoints.getRoomTypes()
    } catch (error) {
      console.error("Lỗi lấy loại phòng:", error)
      throw error
    }
  },

  getRoomAmenities: async () => {
    try {
      return await roomEndpoints.getRoomAmenities()
    } catch (error) {
      console.error("Lỗi lấy tiện nghi phòng:", error)
      throw error
    }
  },

  // Upload hình ảnh phòng
  uploadRoomImage: async (roomId, imageFile) => {
    try {
      const formData = new FormData()
      formData.append("image", imageFile)

      return await roomEndpoints.uploadRoomImage(roomId, formData)
    } catch (error) {
      console.error("Lỗi upload hình ảnh phòng:", error)
      throw error
    }
  },

  // Xóa hình ảnh phòng
  deleteRoomImage: async (roomId, imageId) => {
    try {
      return await roomEndpoints.deleteRoomImage(roomId, imageId)
    } catch (error) {
      console.error("Lỗi xóa hình ảnh phòng:", error)
      throw error
    }
  },
}

export default roomService

