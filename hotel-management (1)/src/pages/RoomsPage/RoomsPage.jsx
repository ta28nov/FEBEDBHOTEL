"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from 'framer-motion';
import Header from "../../components/Header/Header"
import Footer from "../../components/Footer/Footer"
import HeroBanner from "../../components/HeroBanner/HeroBanner"
import RoomCard from "../../components/RoomCard/RoomCard"
import roomService from "../../services/roomService"
import "./RoomsPage.css"

const getImageUrl = (relativePath) => {
  if (!relativePath) return '';
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5225";
  const serverBaseUrl = apiBaseUrl.replace(/\/api\/?$/, '');
  const imagePath = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
  return `${serverBaseUrl}${imagePath}`;
}

// --- Bắt đầu Variants giống HomePage --- 
// Định nghĩa variants cho các phần tử đơn lẻ và tiêu đề
const elementVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95, rotateZ: -2 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateZ: 0,
    transition: { duration: 1.0, ease: "easeOut" }, // Tăng duration lên 1.0s
  },
  exit: {
    opacity: 0,
    y: -50,
    scale: 0.95,
    rotateZ: 2,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// Định nghĩa variants cho các container lưới (để stagger children)
const gridContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Tăng staggerChildren lên 0.2s
      duration: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

// Định nghĩa variants cho các item bên trong lưới (card)
const gridItemVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95, rotateZ: -2 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateZ: 0,
    transition: { duration: 1.0, ease: "easeOut" }, // Tăng duration lên 1.0s
  },
  exit: {
    opacity: 0,
    y: -50,
    scale: 0.95,
    rotateZ: 2,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};
// --- Kết thúc Variants giống HomePage ---

const RoomsPage = () => {
  const [rooms, setRooms] = useState([])
  const [filteredRooms, setFilteredRooms] = useState([])
  const [filters, setFilters] = useState({
    type: "",
    capacity: "",
    priceRange: "",
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true)
      try {
        // Lấy danh sách phòng
        const res = await roomService.getAllRooms()
        const roomsData = Array.isArray(res.data) ? res.data : []
        // Lấy loại phòng cho từng phòng
        const roomTypesRes = await roomService.getRoomTypes()
        const roomTypes = Array.isArray(roomTypesRes.data) ? roomTypesRes.data : []
        // Map loại phòng theo id
        const roomTypeMap = {}
        roomTypes.forEach(rt => { roomTypeMap[rt.id] = rt })
        // Lấy ảnh chính cho từng loại phòng
        const roomsWithImages = await Promise.all(
          roomsData.map(async (room) => {
            const roomType = roomTypeMap[room.roomTypeId] || {}
            let image = ""
            try {
              const imagesRes = await roomService.getRoomTypeImages(room.roomTypeId)
              const images = Array.isArray(imagesRes.data) ? imagesRes.data : []
              const primary = images.find(img => img.isPrimary) || images[0]
              if (primary) image = getImageUrl(primary.value)
            } catch {}
            // Lấy features từ roomType
            const features = Array.isArray(roomType.features) ? roomType.features : [];
            const amenities = features.filter(f => f.featureType === "amenity").map(f => f.name || f.value || "");
            const specifications = features.filter(f => f.featureType === "specification");
            return {
              id: room.id,
              name: roomType.name || room.roomTypeName || "Room",
              description: roomType.description || "",
              price: roomType.basePrice || 0,
              capacity: roomType.capacity || 1,
              type: roomType.name ? roomType.name.toLowerCase() : "",
              status: room.status,
              image,
              amenities,
              specifications,
            }
          })
        )
        setRooms(roomsWithImages)
        setFilteredRooms(roomsWithImages)
      } catch (err) {
        setRooms([])
        setFilteredRooms([])
      } finally {
        setLoading(false)
      }
    }
    fetchRooms()
  }, [])

  useEffect(() => {
    let result = rooms
    if (filters.type) {
      result = result.filter((room) => room.type === filters.type)
    }
    if (filters.capacity) {
      const capacity = Number.parseInt(filters.capacity)
      result = result.filter((room) => room.capacity >= capacity)
    }
    if (filters.priceRange) {
      switch (filters.priceRange) {
        case "budget":
          result = result.filter((room) => room.price >= 100 && room.price <= 200)
          break
        case "moderate":
          result = result.filter((room) => room.price > 200 && room.price <= 350)
          break
        case "luxury":
          result = result.filter((room) => room.price > 350)
          break
        default:
          break
      }
    }
    setFilteredRooms(result)
  }, [filters, rooms])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const resetFilters = () => {
    setFilters({
      type: "",
      capacity: "",
      priceRange: "",
    })
  }

  return (
    <div className="rooms-page">
      <Header />

      <HeroBanner
        title="Our Rooms & Suites"
        subtitle="Discover our luxurious accommodations designed for your comfort and relaxation."
        image="https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        showButtons={false}
      />

      <section className="section rooms-list-section">
        <div className="container">
          <motion.div
            className="rooms-filter"
            variants={elementVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h3>Filter Rooms</h3>
            <div className="filter-form">
              <div className="filter-group">
                <label htmlFor="type">Room Type</label>
                <select id="type" name="type" value={filters.type} onChange={handleFilterChange}>
                  <option value="">All Types</option>
                  <option value="standard">Standard</option>
                  <option value="deluxe">Deluxe</option>
                  <option value="executive">Executive</option>
                  <option value="suite">Suite</option>
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="capacity">Guests</label>
                <select id="capacity" name="capacity" value={filters.capacity} onChange={handleFilterChange}>
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="priceRange">Price Range</label>
                <select id="priceRange" name="priceRange" value={filters.priceRange} onChange={handleFilterChange}>
                  <option value="">Any Price</option>
                  <option value="budget">Budget ($100-$200)</option>
                  <option value="moderate">Moderate ($200-$350)</option>
                  <option value="luxury">Luxury ($350+)</option>
                </select>
              </div>

              <button className="btn btn-secondary" onClick={resetFilters}>
                Reset Filters
              </button>
            </div>
          </motion.div>

          <motion.div
            className="rooms-results"
            variants={elementVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h3>Available Rooms ({filteredRooms.length})</h3>

            <AnimatePresence mode="wait">
              {filteredRooms.length > 0 ? (
                <motion.div
                  key="rooms-grid-key"
                  className="rooms-grid"
                  variants={gridContainerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {filteredRooms.map((room) => (
                    <motion.div
                      key={room.id}
                      variants={gridItemVariants}
                    >
                      <RoomCard room={room} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="no-rooms-key"
                  className="no-rooms-found"
                  variants={elementVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <p>No rooms match your current filters. Please try different criteria.</p>
                  <button className="btn btn-primary" onClick={resetFilters}>
                    Reset Filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default RoomsPage

