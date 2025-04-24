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

  // Lấy phòng có sẵn
  checkAvailability: (params) =>
    apiClient.get("/rooms/available", { params }),

  // Loại phòng (Moved from /rooms/types)
  getRoomTypes: () => apiClient.get("/roomtypes"),
  getRoomTypeById: (id) => apiClient.get(`/roomtypes/${id}`),

  // Tiện nghi phòng (Path is correct per spec)
  getRoomAmenities: () => apiClient.get("/rooms/amenities"),

  // Tải lên hình ảnh (Cho Loại Phòng, path updated, roomId removed from path)
  uploadRoomTypeImage: (formData) => {
    return apiClient.post(`/rooms/image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  },

  // Xóa hình ảnh (Của Loại Phòng)
  deleteRoomTypeImage: (roomId, imageId) => apiClient.delete(`/rooms/${roomId}/image/${imageId}`),
}

export default roomEndpoints

