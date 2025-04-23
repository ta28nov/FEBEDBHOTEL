"use client"

/**
 * RoomForm.jsx
 *
 * Vai trò: Component form để thêm mới hoặc chỉnh sửa thông tin phòng.
 * Chức năng:
 * - Hiển thị form với các trường thông tin phòng
 * - Xác thực dữ liệu nhập vào
 * - Gửi dữ liệu để tạo mới hoặc cập nhật phòng
 * - Quản lý danh sách tiện nghi của phòng
 *
 * Quyền truy cập: Admin và Employee
 */

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { FaTimes } from "react-icons/fa"
import { motion } from "framer-motion"
import { ROOM_TYPES, ROOM_STATUS } from "../../../config/constants"
import "./RoomForm.css"

// Validation schema
const schema = yup.object().shape({
  roomNumber: yup.string().required("Số phòng là bắt buộc"),
  type: yup.string().required("Loại phòng là bắt buộc"),
  beds: yup.number().required("Số giường là bắt buộc").min(1, "Số giường phải lớn hơn 0"),
  capacity: yup.number().required("Sức chứa là bắt buộc").min(1, "Sức chứa phải lớn hơn 0"),
  price: yup.number().required("Giá phòng là bắt buộc").min(0, "Giá phòng không được âm"),
  status: yup.string().required("Trạng thái là bắt buộc"),
  description: yup.string().required("Mô tả là bắt buộc"),
  amenities: yup.array().min(1, "Phải có ít nhất một tiện nghi"),
})

const RoomForm = ({ room, onSubmit, onCancel }) => {
  const [amenitiesList, setAmenitiesList] = useState([
    "TV",
    "Air Conditioner",
    "Mini Bar",
    "Free Wifi",
    "Bathtub",
    "City View",
    "Living Room",
    "Kitchen",
    "Workspace",
    "Balcony",
    "Jacuzzi",
    "Butler Service",
    "Private Pool",
    "Multiple Bathrooms",
  ])
  const [newAmenity, setNewAmenity] = useState("")

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      roomNumber: "",
      type: "",
      beds: 1,
      capacity: 2,
      price: 0,
      status: "available",
      description: "",
      amenities: [],
    },
  })

  // Set form values if editing an existing room
  useEffect(() => {
    if (room) {
      const fields = ["roomNumber", "type", "beds", "capacity", "price", "status", "description"]
      fields.forEach((field) => setValue(field, room[field]))

      if (room.amenities && Array.isArray(room.amenities)) {
        setValue("amenities", room.amenities)
      }
    }
  }, [room, setValue])

  const watchedAmenities = watch("amenities") || []

  const handleAddAmenity = () => {
    if (newAmenity.trim() && !amenitiesList.includes(newAmenity.trim())) {
      setAmenitiesList([...amenitiesList, newAmenity.trim()])
      setNewAmenity("")
    }
  }

  const handleAmenityChange = (amenity) => {
    const currentAmenities = watchedAmenities
    const updatedAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter((a) => a !== amenity)
      : [...currentAmenities, amenity]

    setValue("amenities", updatedAmenities)
  }

  const onFormSubmit = (data) => {
    onSubmit(data)
  }

  return (
    <div className="room-form-overlay">
      <motion.div
        className="room-form-container"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="form-header">
          <h2>{room ? "Chỉnh sửa phòng" : "Thêm phòng mới"}</h2>
          <button className="close-button" onClick={onCancel}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="room-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="roomNumber">Số phòng</label>
              <input
                type="text"
                id="roomNumber"
                {...register("roomNumber")}
                className={errors.roomNumber ? "error" : ""}
              />
              {errors.roomNumber && <span className="error-message">{errors.roomNumber.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="type">Loại phòng</label>
              <select id="type" {...register("type")} className={errors.type ? "error" : ""}>
                <option value="">Chọn loại phòng</option>
                {ROOM_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              {errors.type && <span className="error-message">{errors.type.message}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="beds">Số giường</label>
              <input type="number" id="beds" {...register("beds")} className={errors.beds ? "error" : ""} min="1" />
              {errors.beds && <span className="error-message">{errors.beds.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="capacity">Sức chứa (người)</label>
              <input
                type="number"
                id="capacity"
                {...register("capacity")}
                className={errors.capacity ? "error" : ""}
                min="1"
              />
              {errors.capacity && <span className="error-message">{errors.capacity.message}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Giá phòng (VND)</label>
              <input type="number" id="price" {...register("price")} className={errors.price ? "error" : ""} min="0" />
              {errors.price && <span className="error-message">{errors.price.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="status">Trạng thái</label>
              <select id="status" {...register("status")} className={errors.status ? "error" : ""}>
                {ROOM_STATUS.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
              {errors.status && <span className="error-message">{errors.status.message}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Mô tả</label>
            <textarea
              id="description"
              {...register("description")}
              className={errors.description ? "error" : ""}
              rows="4"
            ></textarea>
            {errors.description && <span className="error-message">{errors.description.message}</span>}
          </div>

          <div className="form-group">
            <label>Tiện nghi</label>
            <div className="amenities-container">
              {amenitiesList.map((amenity) => (
                <div key={amenity} className="amenity-checkbox">
                  <input
                    type="checkbox"
                    id={`amenity-${amenity}`}
                    checked={watchedAmenities.includes(amenity)}
                    onChange={() => handleAmenityChange(amenity)}
                  />
                  <label htmlFor={`amenity-${amenity}`}>{amenity}</label>
                </div>
              ))}
            </div>
            {errors.amenities && <span className="error-message">{errors.amenities.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="newAmenity">Thêm tiện nghi mới</label>
            <div className="add-amenity">
              <input
                type="text"
                id="newAmenity"
                value={newAmenity}
                onChange={(e) => setNewAmenity(e.target.value)}
                placeholder="Nhập tên tiện nghi"
              />
              <button type="button" onClick={handleAddAmenity}>
                Thêm
              </button>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onCancel}>
              Hủy
            </button>
            <button type="submit" className="submit-button">
              {room ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default RoomForm

