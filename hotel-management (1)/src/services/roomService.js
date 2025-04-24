/**
 * Dịch vụ phòng
 *
 * Dịch vụ này xử lý các thao tác liên quan đến phòng và loại phòng
 */

import { roomEndpoints } from "../api"

const roomService = {
  // === Room Operations ===

  getAllRooms: async () => {
    try {
      // Calls GET /api/rooms
      return await roomEndpoints.getAllRooms()
    } catch (error) {
      console.error("Lỗi lấy tất cả phòng:", error)
      throw error
    }
  },

  getRoomById: async (id) => {
    try {
      // Calls GET /api/rooms/{id}
      return await roomEndpoints.getRoomById(id)
    } catch (error) {
      console.error(`Lỗi lấy phòng ${id}:`, error)
      throw error
    }
  },

  /**
   * Creates a new room.
   * @param {object} roomData - Object containing { roomNumber, roomTypeId, status, floor }
   */
  createRoom: async (roomData) => {
    try {
      // Validate required fields (basic check)
      if (!roomData.roomNumber || !roomData.roomTypeId || !roomData.status || !roomData.floor) {
          throw new Error("Thiếu thông tin bắt buộc để tạo phòng.");
      }
      // Prepare payload exactly as spec requires
      const payload = {
        roomNumber: String(roomData.roomNumber),
        roomTypeId: Number(roomData.roomTypeId),
        status: String(roomData.status),
        floor: Number(roomData.floor),
      }
      // Calls POST /api/rooms
      return await roomEndpoints.createRoom(payload)
    } catch (error) {
      console.error("Lỗi tạo phòng:", error)
      throw error
    }
  },

  /**
   * Updates an existing room.
   * @param {number|string} id - The ID of the room to update.
   * @param {object} roomData - Object containing optional fields { roomNumber, roomTypeId, status, floor }
   */
  updateRoom: async (id, roomData) => {
    try {
      // Prepare payload with only the fields allowed by the spec
      // Only include fields that are provided in roomData
      const payload = {}
      if (roomData.hasOwnProperty('roomNumber')) payload.roomNumber = String(roomData.roomNumber);
      if (roomData.hasOwnProperty('roomTypeId')) payload.roomTypeId = Number(roomData.roomTypeId);
      if (roomData.hasOwnProperty('status')) payload.status = String(roomData.status);
      if (roomData.hasOwnProperty('floor')) payload.floor = Number(roomData.floor);

      // Calls PUT /api/rooms/{id}
      return await roomEndpoints.updateRoom(id, payload)
    } catch (error) {
      console.error(`Lỗi cập nhật phòng ${id}:`, error)
      throw error
    }
  },

  deleteRoom: async (id) => {
    try {
      // Calls DELETE /api/rooms/{id}
      return await roomEndpoints.deleteRoom(id)
    } catch (error) {
      console.error(`Lỗi xóa phòng ${id}:`, error)
      throw error
    }
  },

  // === Availability Check ===

  /**
   * Checks room availability for given dates.
   * @param {string} checkIn - Check-in date/time in ISO 8601 format.
   * @param {string} checkOut - Check-out date/time in ISO 8601 format.
   */
  checkAvailability: async (checkIn, checkOut) => {
    try {
       // Calls GET /api/rooms/available
       const params = { checkIn, checkOut };
      return await roomEndpoints.checkAvailability(params)
    } catch (error) {
      console.error("Lỗi kiểm tra tình trạng phòng:", error)
      throw error
    }
  },

  // === Room Type and Amenities (Used for Forms/Display) ===

  getRoomTypes: async () => {
    try {
      // Calls GET /api/roomtypes
      return await roomEndpoints.getRoomTypes()
    } catch (error) {
      console.error("Lỗi lấy loại phòng:", error)
      throw error
    }
  },

  // ADDED: Get Room Type Details by ID
  getRoomTypeById: async (id) => {
     try {
       // Calls GET /api/roomtypes/{id}
       // This should return details including the images array
       return await roomEndpoints.getRoomTypeById(id);
     } catch (error) {
       console.error(`Lỗi lấy chi tiết loại phòng ${id}:`, error);
       throw error;
     }
  },

  getRoomAmenities: async () => {
    try {
      // Calls GET /api/rooms/amenities
      return await roomEndpoints.getRoomAmenities()
    } catch (error) {
      console.error("Lỗi lấy tiện nghi phòng:", error)
      throw error
    }
  },

  // === Room Type Image Management ===

  /**
   * Uploads an image for a specific Room Type.
   * @param {object} imageData - Object containing { roomTypeId, imageFile, isPrimary }
   */
  uploadRoomTypeImage: async ({ roomTypeId, imageFile, isPrimary }) => {
    try {
      const formData = new FormData()
      formData.append("RoomTypeId", roomTypeId)
      formData.append("Image", imageFile)
      if (isPrimary !== undefined) {
         formData.append("IsPrimary", isPrimary)
      }
      // Calls POST /api/rooms/image
      return await roomEndpoints.uploadRoomTypeImage(formData)
    } catch (error) {
      console.error(`Lỗi upload hình ảnh cho loại phòng ${roomTypeId}:`, error)
      throw error
    }
  },

  /**
   * Deletes an image associated with a Room Type.
   * @param {number|string} imageId - The ID of the image (feature) to delete.
   * @param {number|string} [roomId='placeholder'] - Placeholder or context room ID (confirm necessity with backend). Defaults to 'placeholder'.
   */
   deleteRoomTypeImage: async (imageId, roomId = 'placeholder') => {
    try {
       // Calls DELETE /api/rooms/{roomId}/image/{imageId}
       // The roomId might be required by the URL structure even if not used in backend logic.
      return await roomEndpoints.deleteRoomTypeImage(roomId, imageId)
    } catch (error) {
      console.error(`Lỗi xóa hình ảnh ${imageId}:`, error)
      throw error
    }
  },
}

export default roomService

