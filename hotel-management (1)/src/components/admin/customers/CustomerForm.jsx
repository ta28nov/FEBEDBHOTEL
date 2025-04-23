"use client"

/**
 * CustomerForm.jsx
 *
 * Vai trò: Component form để thêm mới hoặc chỉnh sửa thông tin khách hàng.
 * Chức năng:
 * - Hiển thị form với các trường thông tin khách hàng
 * - Xác thực dữ liệu nhập vào
 * - Gửi dữ liệu để tạo mới hoặc cập nhật khách hàng
 *
 * Quyền truy cập: Admin và Employee
 */

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { FaTimes } from "react-icons/fa"
import { motion } from "framer-motion"
import "./CustomerList.css"

// Validation schema
const schema = yup.object().shape({
  name: yup.string().required("Họ tên là bắt buộc"),
  email: yup.string().email("Email không hợp lệ").required("Email là bắt buộc"),
  phone: yup.string().required("Số điện thoại là bắt buộc"),
  idNumber: yup.string().required("CCCD/Passport là bắt buộc"),
  address: yup.string().required("Địa chỉ là bắt buộc"),
  nationality: yup.string().required("Quốc tịch là bắt buộc"),
})

const CustomerForm = ({ customer, onSubmit, onCancel }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      idNumber: "",
      address: "",
      nationality: "Việt Nam",
    },
  })

  // Set form values if editing an existing customer
  useEffect(() => {
    if (customer) {
      const fields = ["name", "email", "phone", "idNumber", "address", "nationality"]
      fields.forEach((field) => setValue(field, customer[field]))
    }
  }, [customer, setValue])

  const onFormSubmit = (data) => {
    onSubmit(data)
  }

  return (
    <div className="customer-form-overlay">
      <motion.div
        className="customer-form-container"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="form-header">
          <h2>{customer ? "Chỉnh sửa khách hàng" : "Thêm khách hàng mới"}</h2>
          <button className="close-button" onClick={onCancel}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="customer-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Họ tên</label>
              <input type="text" id="name" {...register("name")} className={errors.name ? "error" : ""} />
              {errors.name && <span className="error-message">{errors.name.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" {...register("email")} className={errors.email ? "error" : ""} />
              {errors.email && <span className="error-message">{errors.email.message}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Số điện thoại</label>
              <input type="tel" id="phone" {...register("phone")} className={errors.phone ? "error" : ""} />
              {errors.phone && <span className="error-message">{errors.phone.message}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="idNumber">CCCD/Passport</label>
              <input type="text" id="idNumber" {...register("idNumber")} className={errors.idNumber ? "error" : ""} />
              {errors.idNumber && <span className="error-message">{errors.idNumber.message}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nationality">Quốc tịch</label>
              <input
                type="text"
                id="nationality"
                {...register("nationality")}
                className={errors.nationality ? "error" : ""}
              />
              {errors.nationality && <span className="error-message">{errors.nationality.message}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="address">Địa chỉ</label>
            <textarea
              id="address"
              {...register("address")}
              className={errors.address ? "error" : ""}
              rows="3"
            ></textarea>
            {errors.address && <span className="error-message">{errors.address.message}</span>}
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onCancel}>
              Hủy
            </button>
            <button type="submit" className="submit-button">
              {customer ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default CustomerForm

