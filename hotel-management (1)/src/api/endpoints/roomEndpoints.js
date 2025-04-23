/**
 * Các endpoint API phòng
 *
 * File này định nghĩa các endpoint liên quan đến quản lý phòng,
 * kiểm tra tình trạng phòng và lọc phòng theo các tiêu chí.
 */
import apiClient from "../apiClient"

const roomEndpoints = {
  // Các thao tác với phòng
  getAllRooms: () => apiClient.get("/rooms"),
  getRoomById: (id) => apiClient.get(`/rooms/${id}`),
  createRoom: (roomData) => apiClient.post("/rooms", roomData),
  updateRoom: (id, roomData) => apiClient.put(`/rooms/${id}`, roomData),
  deleteRoom: (id) => apiClient.delete(`/rooms/${id}`),

  // Lọc phòng và kiểm tra tình trạng
  filterRooms: (filters) => apiClient.get("/rooms/filter", { params: filters }),
  checkAvailability: (startDate, endDate, guests) =>
    apiClient.get("/rooms/availability", {
      params: { start_date: startDate, end_date: endDate, guests },
    }),

  // Loại phòng
  getRoomTypes: () => apiClient.get("/rooms/types"),

  // Tiện nghi phòng
  getRoomAmenities: () => apiClient.get("/rooms/amenities"),

  // Upload hình ảnh phòng
  uploadRoomImage: (roomId, formData) => {
    return apiClient.post(`/rooms/${roomId}/images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  },

  // Xóa hình ảnh phòng
  deleteRoomImage: (roomId, imageId) => apiClient.delete(`/rooms/${roomId}/images/${imageId}`),
}

export default roomEndpoints

