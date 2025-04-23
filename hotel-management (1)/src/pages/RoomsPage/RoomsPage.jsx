"use client"

import { useState, useEffect } from "react"
import Header from "../../components/Header/Header"
import Footer from "../../components/Footer/Footer"
import HeroBanner from "../../components/HeroBanner/HeroBanner"
import RoomCard from "../../components/RoomCard/RoomCard"
import "./RoomsPage.css"

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
  {
    id: 5,
    name: "Presidential Suite",
    description: "Our most luxurious accommodation with panoramic views and butler service.",
    price: 800,
    capacity: 4,
    type: "suite",
    status: "available",
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
    amenities: ["wifi", "tv", "coffee", "bath", "minibar", "kitchen", "workspace", "jacuzzi"],
  },
  {
    id: 6,
    name: "Ocean View Room",
    description: "Enjoy stunning ocean views from this beautifully appointed room.",
    price: 300,
    capacity: 2,
    type: "deluxe",
    status: "available",
    image:
      "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1025&q=80",
    amenities: ["wifi", "tv", "coffee", "bath", "minibar", "balcony"],
  },
]

const RoomsPage = () => {
  const [filteredRooms, setFilteredRooms] = useState(allRooms)
  const [filters, setFilters] = useState({
    type: "",
    capacity: "",
    priceRange: "",
  })

  // Cuộn lên đầu trang khi component được tải
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Xử lý thay đổi bộ lọc
  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Áp dụng bộ lọc
  useEffect(() => {
    let result = allRooms

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
  }, [filters])

  // Xử lý đặt lại bộ lọc
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
          <div className="rooms-filter">
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
          </div>

          <div className="rooms-results">
            <h3>Available Rooms ({filteredRooms.length})</h3>

            {filteredRooms.length > 0 ? (
              <div className="rooms-grid">
                {filteredRooms.map((room) => (
                  <RoomCard key={room.id} room={room} />
                ))}
              </div>
            ) : (
              <div className="no-rooms-found">
                <p>No rooms match your current filters. Please try different criteria.</p>
                <button className="btn btn-primary" onClick={resetFilters}>
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default RoomsPage

