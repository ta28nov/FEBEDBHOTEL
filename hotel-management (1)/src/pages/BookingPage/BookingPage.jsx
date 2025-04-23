"use client"

import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { format } from "date-fns"
import Header from "../../components/Header/Header"
import Footer from "../../components/Footer/Footer"
import "./BookingPage.css"

// Dữ liệu mẫu cho phòng
const allRooms = [
  {
    id: 1,
    name: "Standard Room",
    description: "A comfortable room with all the essential amenities for a pleasant stay.",
    price: 150,
    capacity: 2,
    type: "standard",
    status: "available",
    image:
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    amenities: ["wifi", "tv", "coffee", "bath"],
  },
  {
    id: 2,
    name: "Deluxe Room",
    description: "Spacious room with premium furnishings and additional amenities.",
    price: 250,
    capacity: 2,
    type: "deluxe",
    status: "available",
    image:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    amenities: ["wifi", "tv", "coffee", "bath", "minibar"],
  },
  {
    id: 3,
    name: "Executive Suite",
    description: "Luxurious suite with separate living area and exclusive services.",
    price: 350,
    capacity: 3,
    type: "executive",
    status: "available",
    image:
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    amenities: ["wifi", "tv", "coffee", "bath", "minibar", "workspace"],
  },
  {
    id: 4,
    name: "Family Suite",
    description: "Spacious suite designed for families with connecting rooms.",
    price: 400,
    capacity: 4,
    type: "suite",
    status: "available",
    image:
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    amenities: ["wifi", "tv", "coffee", "bath", "minibar", "kitchen"],
  },
]

const BookingPage = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const roomId = queryParams.get("room")

  const [selectedRoom, setSelectedRoom] = useState(null)
  const [checkInDate, setCheckInDate] = useState("")
  const [checkOutDate, setCheckOutDate] = useState("")
  const [guests, setGuests] = useState(1)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: "",
    paymentMethod: "credit-card",
  })
  const [currentStep, setCurrentStep] = useState(1)
  const [bookingComplete, setBookingComplete] = useState(false)
  const [bookingReference, setBookingReference] = useState("")
  const [errors, setErrors] = useState({})

  // Cuộn lên đầu trang khi component được tải
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Tìm phòng dựa trên ID từ query params
  useEffect(() => {
    if (roomId) {
      const room = allRooms.find((r) => r.id === Number.parseInt(roomId))
      if (room) {
        setSelectedRoom(room)
        setGuests(room.capacity > 1 ? 2 : 1)
      }
    }
  }, [roomId])

  // Xử lý thay đổi input
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Xóa lỗi khi người dùng nhập lại
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Xử lý thay đổi phòng
  const handleRoomChange = (e) => {
    const roomId = Number.parseInt(e.target.value)
    const room = allRooms.find((r) => r.id === roomId)
    setSelectedRoom(room)
    setGuests(room.capacity > 1 ? 2 : 1)
  }

  // Xác thực form
  const validateForm = () => {
    const newErrors = {}

    if (currentStep === 1) {
      if (!selectedRoom) {
        newErrors.room = "Please select a room"
      }
      if (!checkInDate) {
        newErrors.checkIn = "Please select a check-in date"
      }
      if (!checkOutDate) {
        newErrors.checkOut = "Please select a check-out date"
      } else if (new Date(checkInDate) >= new Date(checkOutDate)) {
        newErrors.checkOut = "Check-out date must be after check-in date"
      }
    } else if (currentStep === 2) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = "First name is required"
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = "Last name is required"
      }
      if (!formData.email.trim()) {
        newErrors.email = "Email is required"
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid"
      }
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Xử lý chuyển bước
  const handleNextStep = () => {
    if (validateForm()) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1)
    window.scrollTo(0, 0)
  }

  // Xử lý hoàn tất đặt phòng
  const handleCompleteBooking = () => {
    if (validateForm()) {
      // Mô phỏng API call
      setTimeout(() => {
        // Tạo mã tham chiếu ngẫu nhiên
        const reference = "BK" + Math.floor(100000 + Math.random() * 900000)
        setBookingReference(reference)
        setBookingComplete(true)
        window.scrollTo(0, 0)
      }, 1500)
    }
  }

  // Tính số đêm và tổng giá
  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0

    const checkIn = new Date(checkInDate)
    const checkOut = new Date(checkOutDate)
    const diffTime = Math.abs(checkOut - checkIn)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays
  }

  const calculateTotal = () => {
    if (!selectedRoom) return 0

    const nights = calculateNights()
    const roomTotal = selectedRoom.price * nights
    const tax = roomTotal * 0.12 // 12% tax

    return {
      roomTotal,
      tax,
      grandTotal: roomTotal + tax,
    }
  }

  const { roomTotal, tax, grandTotal } = calculateTotal()

  // Hiển thị trang hoàn tất đặt phòng
  if (bookingComplete) {
    return (
      <div className="booking-page">
        <Header />

        <div className="booking-container">
          <div className="container">
            <motion.div
              className="booking-complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="booking-complete-icon">✓</div>
              <h2>Booking Confirmed!</h2>
              <p>Thank you for your reservation. We look forward to welcoming you to our hotel.</p>

              <div className="booking-details">
                <h3>Booking Details</h3>
                <div className="detail-row">
                  <span className="detail-label">Booking Reference:</span>
                  <span className="detail-value">{bookingReference}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Room:</span>
                  <span className="detail-value">{selectedRoom.name}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Check-in:</span>
                  <span className="detail-value">{format(new Date(checkInDate), "MMMM dd, yyyy")}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Check-out:</span>
                  <span className="detail-value">{format(new Date(checkOutDate), "MMMM dd, yyyy")}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Guests:</span>
                  <span className="detail-value">{guests}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Total Amount:</span>
                  <span className="detail-value">${grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <p className="booking-note">
                A confirmation email has been sent to {formData.email}. If you have any questions, please contact our
                customer service.
              </p>

              <div className="booking-actions">
                <a href="/" className="btn btn-primary">
                  Return to Homepage
                </a>
              </div>
            </motion.div>
          </div>
        </div>

        <Footer />
      </div>
    )
  }

  return (
    <div className="booking-page">
      <Header />

      <div className="booking-container">
        <div className="container">
          <h1 className="booking-title">Book Your Stay</h1>

          <div className="booking-progress">
            <div className={`progress-step ${currentStep >= 1 ? "active" : ""}`}>
              <div className="step-number">1</div>
              <div className="step-label">Room & Dates</div>
            </div>
            <div className="progress-line"></div>
            <div className={`progress-step ${currentStep >= 2 ? "active" : ""}`}>
              <div className="step-number">2</div>
              <div className="step-label">Guest Details</div>
            </div>
            <div className="progress-line"></div>
            <div className={`progress-step ${currentStep >= 3 ? "active" : ""}`}>
              <div className="step-number">3</div>
              <div className="step-label">Confirmation</div>
            </div>
          </div>

          <div className="booking-form-container">
            {currentStep === 1 && (
              <motion.div
                className="booking-step"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2>Select Room & Dates</h2>

                <div className="form-group">
                  <label htmlFor="room">Select Room Type</label>
                  <select
                    id="room"
                    value={selectedRoom ? selectedRoom.id : ""}
                    onChange={handleRoomChange}
                    className={errors.room ? "error" : ""}
                  >
                    <option value="">-- Select a Room --</option>
                    {allRooms.map((room) => (
                      <option key={room.id} value={room.id}>
                        {room.name} - ${room.price}/night
                      </option>
                    ))}
                  </select>
                  {errors.room && <div className="error-message">{errors.room}</div>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="checkIn">Check-in Date</label>
                    <input
                      type="date"
                      id="checkIn"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className={errors.checkIn ? "error" : ""}
                    />
                    {errors.checkIn && <div className="error-message">{errors.checkIn}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="checkOut">Check-out Date</label>
                    <input
                      type="date"
                      id="checkOut"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      min={checkInDate || new Date().toISOString().split("T")[0]}
                      className={errors.checkOut ? "error" : ""}
                    />
                    {errors.checkOut && <div className="error-message">{errors.checkOut}</div>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="guests">Number of Guests</label>
                  <select
                    id="guests"
                    value={guests}
                    onChange={(e) => setGuests(Number.parseInt(e.target.value))}
                    disabled={!selectedRoom}
                  >
                    {selectedRoom &&
                      [...Array(selectedRoom.capacity)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1} {i === 0 ? "Guest" : "Guests"}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn-primary" onClick={handleNextStep}>
                    Continue to Guest Details
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                className="booking-step"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2>Guest Details</h2>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={errors.firstName ? "error" : ""}
                    />
                    {errors.firstName && <div className="error-message">{errors.firstName}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={errors.lastName ? "error" : ""}
                    />
                    {errors.lastName && <div className="error-message">{errors.lastName}</div>}
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? "error" : ""}
                    />
                    {errors.email && <div className="error-message">{errors.email}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={errors.phone ? "error" : ""}
                    />
                    {errors.phone && <div className="error-message">{errors.phone}</div>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="specialRequests">Special Requests (Optional)</label>
                  <textarea
                    id="specialRequests"
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    rows="4"
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>Payment Method</label>
                  <div className="payment-options">
                    <div className="payment-option">
                      <input
                        type="radio"
                        id="credit-card"
                        name="paymentMethod"
                        value="credit-card"
                        checked={formData.paymentMethod === "credit-card"}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="credit-card">Credit Card</label>
                    </div>

                    <div className="payment-option">
                      <input
                        type="radio"
                        id="paypal"
                        name="paymentMethod"
                        value="paypal"
                        checked={formData.paymentMethod === "paypal"}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="paypal">PayPal</label>
                    </div>

                    <div className="payment-option">
                      <input
                        type="radio"
                        id="pay-at-hotel"
                        name="paymentMethod"
                        value="pay-at-hotel"
                        checked={formData.paymentMethod === "pay-at-hotel"}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="pay-at-hotel">Pay at Hotel</label>
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={handlePrevStep}>
                    Back
                  </button>
                  <button type="button" className="btn btn-primary" onClick={handleNextStep}>
                    Continue to Confirmation
                  </button>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                className="booking-step"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2>Booking Confirmation</h2>

                <div className="confirmation-details">
                  <div className="confirmation-section">
                    <h3>Room Details</h3>
                    <div className="confirmation-item">
                      <span className="item-label">Room Type:</span>
                      <span className="item-value">{selectedRoom.name}</span>
                    </div>
                    <div className="confirmation-item">
                      <span className="item-label">Check-in:</span>
                      <span className="item-value">{format(new Date(checkInDate), "MMMM dd, yyyy")}</span>
                    </div>
                    <div className="confirmation-item">
                      <span className="item-label">Check-out:</span>
                      <span className="item-value">{format(new Date(checkOutDate), "MMMM dd, yyyy")}</span>
                    </div>
                    <div className="confirmation-item">
                      <span className="item-label">Number of Nights:</span>
                      <span className="item-value">{calculateNights()}</span>
                    </div>
                    <div className="confirmation-item">
                      <span className="item-label">Guests:</span>
                      <span className="item-value">{guests}</span>
                    </div>
                  </div>

                  <div className="confirmation-section">
                    <h3>Guest Information</h3>
                    <div className="confirmation-item">
                      <span className="item-label">Name:</span>
                      <span className="item-value">
                        {formData.firstName} {formData.lastName}
                      </span>
                    </div>
                    <div className="confirmation-item">
                      <span className="item-label">Email:</span>
                      <span className="item-value">{formData.email}</span>
                    </div>
                    <div className="confirmation-item">
                      <span className="item-label">Phone:</span>
                      <span className="item-value">{formData.phone}</span>
                    </div>
                    {formData.specialRequests && (
                      <div className="confirmation-item">
                        <span className="item-label">Special Requests:</span>
                        <span className="item-value">{formData.specialRequests}</span>
                      </div>
                    )}
                    <div className="confirmation-item">
                      <span className="item-label">Payment Method:</span>
                      <span className="item-value">
                        {formData.paymentMethod === "credit-card"
                          ? "Credit Card"
                          : formData.paymentMethod === "paypal"
                            ? "PayPal"
                            : "Pay at Hotel"}
                      </span>
                    </div>
                  </div>

                  <div className="confirmation-section">
                    <h3>Price Summary</h3>
                    <div className="confirmation-item">
                      <span className="item-label">Room Rate:</span>
                      <span className="item-value">${selectedRoom.price.toFixed(2)} per night</span>
                    </div>
                    <div className="confirmation-item">
                      <span className="item-label">Room Total:</span>
                      <span className="item-value">${roomTotal.toFixed(2)}</span>
                    </div>
                    <div className="confirmation-item">
                      <span className="item-label">Tax (12%):</span>
                      <span className="item-value">${tax.toFixed(2)}</span>
                    </div>
                    <div className="confirmation-item total">
                      <span className="item-label">Total Amount:</span>
                      <span className="item-value">${grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="terms-agreement">
                  <p>
                    By clicking "Complete Booking", you agree to our <a href="/terms">Terms and Conditions</a> and{" "}
                    <a href="/privacy">Privacy Policy</a>. You will receive a confirmation email once your booking is
                    processed.
                  </p>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn btn-secondary" onClick={handlePrevStep}>
                    Back
                  </button>
                  <button type="button" className="btn btn-primary" onClick={handleCompleteBooking}>
                    Complete Booking
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default BookingPage

