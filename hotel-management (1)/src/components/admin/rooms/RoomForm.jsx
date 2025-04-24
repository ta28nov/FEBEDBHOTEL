"use client"

/**
 * RoomForm.jsx
 *
 * Vai trò: Component form để thêm mới hoặc chỉnh sửa thông tin phòng.
 * Chức năng:
 * - Hiển thị form với các trường thông tin phòng theo spec API
 * - Lấy danh sách Loại phòng để chọn
 * - Xác thực dữ liệu nhập vào
 * - Gửi dữ liệu để tạo mới hoặc cập nhật phòng
 *
 * Quyền truy cập: Admin và Employee
 */

import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { FaTimes } from "react-icons/fa"
import { motion } from "framer-motion"
import { toast } from "react-toastify"
import roomService from "../../../services/roomService" // Corrected service
// ROOM_STATUS might still be useful for the Status dropdown
import { ROOM_STATUS } from "../../../config/constants"
import "./RoomForm.css"

// Validation schema based on API spec
const schema = yup.object().shape({
  roomNumber: yup.string().required("Số phòng là bắt buộc"),
  // Validate roomTypeId as a number required for selection
  roomTypeId: yup.number().required("Loại phòng là bắt buộc").positive("Loại phòng không hợp lệ").integer(),
  status: yup.string().required("Trạng thái là bắt buộc"),
  floor: yup.number()
    .required("Số tầng là bắt buộc")
    .integer("Số tầng phải là số nguyên"),
    // No validation for price, capacity, beds, description, amenities here as they are not submitted directly
})

// Accepted props: room (for edit mode), isEditMode, onClose, onSuccess
const RoomForm = ({ room, isEditMode, onClose, onSuccess }) => {
  const [roomTypes, setRoomTypes] = useState([])
  const [loadingRoomTypes, setLoadingRoomTypes] = useState(false)
  const [formError, setFormError] = useState(null) // For general form errors
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    control, // Need Controller for the Select component
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      roomNumber: "",
      roomTypeId: null, // Default to null or empty string
      status: "Available", // Default status from spec
      floor: 1,
    },
  })

  // Fetch room types for the dropdown
  useEffect(() => {
    const fetchRoomTypes = async () => {
      setLoadingRoomTypes(true)
      try {
        const response = await roomService.getRoomTypes() // Calls GET /api/roomtypes
        setRoomTypes(response.data || [])
      } catch (error) {
        toast.error("Không thể tải danh sách loại phòng.")
        console.error("Fetch room types error:", error)
      } finally {
        setLoadingRoomTypes(false)
      }
    }
    fetchRoomTypes()
  }, [])

  // Populate form if in edit mode
  useEffect(() => {
    if (isEditMode && room) {
      // Set values based on the fields required by the form/API
      reset({
          roomNumber: room.roomNumber || "",
          roomTypeId: room.roomTypeId || null,
          status: room.status || "Available",
          floor: room.floor || 1,
      });
    } else {
       // Reset form for add mode
       reset({
          roomNumber: "",
          roomTypeId: null,
          status: "Available",
          floor: 1,
       });
    }
  }, [isEditMode, room, reset])

  // Handle form submission
  const onFormSubmit = async (data) => {
    setIsSubmitting(true)
    setFormError(null)
    const payload = {
        roomNumber: data.roomNumber,
        roomTypeId: data.roomTypeId,
        status: data.status,
        floor: data.floor,
    };

    try {
      if (isEditMode) {
        // Update existing room - send only changed fields? API allows partial update.
        // For simplicity, sending all fields for now. Adjust if partial update is strictly needed.
        await roomService.updateRoom(room.id, payload) // Calls PUT /api/rooms/{id}
        toast.success("Cập nhật phòng thành công")
      } else {
        // Create new room
        await roomService.createRoom(payload) // Calls POST /api/rooms
        toast.success("Thêm phòng mới thành công")
      }
      onSuccess() // Call the success callback passed from RoomList
    } catch (error) {
      const errorMsg = error.response?.data?.message || (isEditMode ? "Không thể cập nhật phòng" : "Không thể thêm phòng mới")
      setFormError(errorMsg) // Show error message near the submit button
      toast.error(errorMsg)
      console.error("Submit room error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="room-form-overlay">
      <motion.div
        className="room-form-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
      >
        <div className="form-header">
          <h2>{isEditMode ? "Chỉnh sửa phòng" : "Thêm phòng mới"}</h2>
          <button type="button" className="close-button" onClick={onClose} disabled={isSubmitting}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="room-form">
          {/* Room Number */} 
          <div className="form-group">
            <label htmlFor="roomNumber">Số phòng</label>
            <input
              type="text"
              id="roomNumber"
              {...register("roomNumber")}
              className={errors.roomNumber ? "input-error" : ""}
              disabled={isSubmitting}
            />
            {errors.roomNumber && <span className="error-message">{errors.roomNumber.message}</span>}
          </div>

          {/* Room Type Dropdown */} 
          <div className="form-group">
            <label htmlFor="roomTypeId">Loại phòng</label>
            <Controller
                name="roomTypeId"
                control={control}
                render={({ field }) => (
                    <select
                        id="roomTypeId"
                        {...field}
                        className={errors.roomTypeId ? "input-error" : ""}
                        disabled={loadingRoomTypes || isSubmitting}
                    >
                        <option value="">{loadingRoomTypes ? "Đang tải..." : "-- Chọn loại phòng --"}</option>
                        {roomTypes.map((type) => (
                            // Assuming room type object has 'id' and 'name'
                            <option key={type.id} value={type.id}>
                                {type.name || `Loại ${type.id}`} {/* Display name, fallback to ID */}
                            </option>
                        ))}
                    </select>
                )}
            />
            {errors.roomTypeId && <span className="error-message">{errors.roomTypeId.message}</span>}
          </div>

          {/* Floor */} 
          <div className="form-group">
            <label htmlFor="floor">Tầng</label>
            <input
              type="number"
              id="floor"
              {...register("floor")}
              className={errors.floor ? "input-error" : ""}
              disabled={isSubmitting}
            />
            {errors.floor && <span className="error-message">{errors.floor.message}</span>}
          </div>

          {/* Status Dropdown */} 
          <div className="form-group">
            <label htmlFor="status">Trạng thái</label>
             <Controller
                name="status"
                control={control}
                render={({ field }) => (
                   <select
                    id="status"
                    {...field}
                    className={errors.status ? "input-error" : ""}
                    disabled={isSubmitting}
                  >
                    {/* Use ROOM_STATUS from constants or define statuses directly */}
                    {/* Example statuses based on spec examples */} 
                    <option value="Available">Có sẵn (Available)</option>
                    <option value="Occupied">Đang có khách (Occupied)</option>
                    <option value="Maintenance">Bảo trì (Maintenance)</option>
                    <option value="Cleaning">Đang dọn dẹp (Cleaning)</option>
                    {/* Add other relevant statuses if needed */}
                  </select>
                )}
              />
            {errors.status && <span className="error-message">{errors.status.message}</span>}
          </div>

          {/* Remove fields not in the API spec for create/update: */} 
          {/* beds, capacity, price, description, amenities */}

          {formError && (
            <div className="form-group form-error-message">
                 {formError}
            </div>
           )}

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose} disabled={isSubmitting}>
              Hủy
            </button>
            <button type="submit" className="submit-button" disabled={isSubmitting}>
              {isSubmitting ? "Đang xử lý..." : (isEditMode ? "Cập nhật" : "Thêm mới")}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default RoomForm

