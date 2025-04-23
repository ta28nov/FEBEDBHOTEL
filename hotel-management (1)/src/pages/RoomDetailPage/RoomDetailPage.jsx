

"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { FaWifi, FaCoffee, FaTv, FaBath, FaUsers, FaCheck, FaArrowLeft } from "react-icons/fa"
import Header from "../../components/Header/Header"
import Footer from "../../components/Footer/Footer"
import "./RoomDetailPage.css"

// Dữ liệu mẫu cho chi tiết phòng
const allRooms = [
  {
    id: 1,
    name: "Standard Room",
    description: "A comfortable room with all the essential amenities for a pleasant stay.",
    longDescription:
      "Our Standard Room offers a perfect blend of comfort and functionality. Designed with your relaxation in mind, this room features a plush queen-size bed with premium linens, a work desk, and a modern bathroom with a walk-in shower. Enjoy the convenience of high-speed Wi-Fi, a flat-screen TV with premium channels, and a coffee maker to start your day right. The room's warm color palette and soft lighting create a welcoming atmosphere, making it an ideal choice for both business and leisure travelers seeking quality accommodations without compromising on comfort.",
    price: 150,
    capacity: 2,
    size: "30 m²",
    bedType: "1 Queen Bed",
    type: "standard",
    status: "available",
    image:
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
      "https://images.unsplash.com/photo-1552902019-ebcd97aa9aa0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1586105251261-72a756497a11?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=958&q=80",
    ],
    amenities: ["wifi", "tv", "coffee", "bath", "air conditioning", "desk", "safe", "hairdryer"],
  },
  {
    id: 2,
    name: "Deluxe Room",
    description: "Spacious room with premium furnishings and additional amenities.",
    longDescription:
      "Elevate your stay with our Deluxe Room, offering an enhanced level of comfort and style. This generously sized accommodation features a luxurious king-size bed with premium linens, a cozy seating area with a sofa, and an elegant bathroom with both a bathtub and a separate rain shower. The room is equipped with high-speed Wi-Fi, a large flat-screen TV, a minibar stocked with premium beverages, and a Nespresso coffee machine. Large windows provide abundant natural light and offer stunning views of the surrounding area. The sophisticated décor and thoughtful amenities make our Deluxe Room perfect for those seeking a more indulgent hotel experience.",
    price: 250,
    capacity: 2,
    size: "40 m²",
    bedType: "1 King Bed",
    type: "deluxe",
    status: "available",
    image:
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    ],
    amenities: [
      "wifi",
      "tv",
      "coffee",
      "bath",
      "minibar",
      "air conditioning",
      "desk",
      "safe",
      "hairdryer",
      "bathrobe",
      "slippers",
    ],
  },
  {
    id: 3,
    name: "Executive Suite",
    description: "Luxurious suite with separate living area and exclusive services.",
    longDescription:
      "Experience the pinnacle of luxury in our Executive Suite, a spacious and elegantly appointed accommodation designed for the discerning traveler. The suite features a separate bedroom with a premium king-size bed, a large living area with designer furniture, and a dining space perfect for entertaining or in-room dining. The marble bathroom includes a deep soaking tub, a separate rain shower, and premium bath amenities. Enjoy state-of-the-art technology with high-speed Wi-Fi, multiple flat-screen TVs, a Bose sound system, and a fully stocked minibar. Executive Suite guests also receive exclusive benefits including priority check-in/check-out, complimentary breakfast, access to the Executive Lounge, and personalized concierge service. The panoramic views and sophisticated ambiance make this suite an exceptional choice for an unforgettable stay.",
    price: 350,
    capacity: 3,
    size: "60 m²",
    bedType: "1 King Bed + Sofa Bed",
    type: "executive",
    status: "available",
    image:
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1591088398332-8a7791972843?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    ],
    amenities: [
      "wifi",
      "tv",
      "coffee",
      "bath",
      "minibar",
      "workspace",
      "air conditioning",
      "desk",
      "safe",
      "hairdryer",
      "bathrobe",
      "slippers",
      "living area",
      "dining area",
      "executive lounge access",
    ],
  },
  {
    id: 4,
    name: "Family Suite",
    description: "Spacious suite designed for families with connecting rooms.",
    longDescription:
      "Our Family Suite is the perfect choice for families seeking comfort and convenience during their stay. This thoughtfully designed accommodation features a master bedroom with a king-size bed and a separate children's room with twin beds, providing privacy for parents while keeping the family connected. The spacious living area includes comfortable seating and a dining table, making it ideal for family meals and relaxation. The suite is equipped with two bathrooms, a kitchenette with a microwave and refrigerator, multiple flat-screen TVs, and high-speed Wi-Fi. Family-friendly amenities include child-safe features, a selection of board games, and optional cribs or rollaway beds upon request. With ample space for everyone and all the comforts of home, our Family Suite ensures a memorable and stress-free family vacation.",
    price: 400,
    capacity: 4,
    size: "75 m²",
    bedType: "1 King Bed + 2 Twin Beds",
    type: "suite",
    status: "available",
    image:
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    ],
    amenities: [
      "wifi",
      "tv",
      "coffee",
      "bath",
      "minibar",
      "kitchen",
      "air conditioning",
      "desk",
      "safe",
      "hairdryer",
      "bathrobe",
      "slippers",
      "connecting rooms",
      "child-friendly",
    ],
  },
]

// Hàm hiển thị biểu tượng cho các tiện nghi
const getAmenityIcon = (amenity) => {
  switch (amenity) {
    case "wifi":
      return <FaWifi />
    case "coffee":
      return <FaCoffee />
    case "tv":
      return <FaTv />
    case "bath":
      return <FaBath />
    default:
      return <FaCheck />
  }
}

const RoomDetailPage = () => {
  const { id } = useParams()
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)

  // Cuộn lên đầu trang khi component được tải
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Tìm phòng dựa trên ID
  useEffect(() => {
    // Mô phỏng API call
    const fetchRoom = () => {
      setLoading(true)
      setTimeout(() => {
        const foundRoom = allRooms.find((room) => room.id === Number.parseInt(id))
        setRoom(foundRoom || null)
        setLoading(false)
      }, 500)
    }

    fetchRoom()
  }, [id])

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading room details...</p>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="room-not-found">
        <h2>Room Not Found</h2>
        <p>The room you are looking for does not exist or has been removed.</p>
        <Link to="/rooms" className="btn btn-primary">
          Back to Rooms
        </Link>
      </div>
    )
  }

  return (
    <div className="room-detail-page">
      <Header />

      <div className="room-detail-container">
        <div className="container">
          <div className="back-to-rooms">
            <Link to="/rooms" className="btn btn-secondary">
              <FaArrowLeft /> Back to Rooms
            </Link>
          </div>

          <motion.div
            className="room-detail-header"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1>{room.name}</h1>
            <div className="room-meta">
              <div className="room-capacity">
                <FaUsers />
                <span>Up to {room.capacity} guests</span>
              </div>
              <div className="room-size">
                <span>{room.size}</span>
              </div>
              <div className="room-bed">
                <span>{room.bedType}</span>
              </div>
            </div>
          </motion.div>

          <div className="room-gallery">
            <motion.div
              className="main-image"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img src={room.gallery[activeImage] || "/placeholder.svg"} alt={room.name} />
            </motion.div>

            <div className="thumbnail-container">
              {room.gallery.map((image, index) => (
                <div
                  key={index}
                  className={`thumbnail ${activeImage === index ? "active" : ""}`}
                  onClick={() => setActiveImage(index)}
                >
                  <img src={image || "/placeholder.svg"} alt={`${room.name} - View ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>

          <div className="room-detail-content">
            <div className="room-info">
              <motion.div
                className="room-description"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2>Room Description</h2>
                <p>{room.longDescription}</p>
              </motion.div>

              <motion.div
                className="room-amenities-list"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <h2>Room Amenities</h2>
                <ul>
                  {room.amenities.map((amenity, index) => (
                    <li key={index}>
                      {getAmenityIcon(amenity)}
                      <span>{amenity.charAt(0).toUpperCase() + amenity.slice(1)}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            <motion.div
              className="room-booking"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="booking-card">
                <h3>Room Details</h3>
                <div className="price">
                  <span className="amount">${room.price}</span>
                  <span className="per-night">/ night</span>
                </div>

                <div className="booking-details">
                  <div className="detail-item">
                    <span className="label">Room Type:</span>
                    <span className="value">{room.type.charAt(0).toUpperCase() + room.type.slice(1)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Max Guests:</span>
                    <span className="value">{room.capacity}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Bed Type:</span>
                    <span className="value">{room.bedType}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Room Size:</span>
                    <span className="value">{room.size}</span>
                  </div>
                </div>

                <Link to={`/booking?room=${room.id}`} className="btn btn-primary btn-block">
                  Book This Room
                </Link>

                <p className="booking-note">Free cancellation up to 24 hours before check-in</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default RoomDetailPage

