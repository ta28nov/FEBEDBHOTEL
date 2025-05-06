# Hotel Management System

## Giới thiệu

Hệ thống quản lý khách sạn hiện đại với giao diện người dùng mượt mà và hiệu ứng cuộn trang đẹp mắt. Dự án được xây dựng bằng ReactJS và Vite, sử dụng CSS thuần cho styling.

## Cài đặt

```bash
# Clone repository
git clone <repository-url>

# Di chuyển vào thư mục dự án
cd hotel-management

# Cài đặt dependencies
npm install

# Chạy ứng dụng ở môi trường development
npm run dev





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
  {
    id: 7,
    name: "Twin Room",
    description: "A modern room with two single beds, ideal for friends or colleagues.",
    longDescription:
      "Our Twin Room is perfect for guests who prefer separate beds. The room features two comfortable single beds with premium linens, a work desk, and a stylish bathroom with a walk-in shower. Enjoy amenities such as high-speed Wi-Fi, a flat-screen TV, and a coffee maker. The contemporary design and thoughtful touches ensure a pleasant stay for both business and leisure travelers.",
    price: 180,
    capacity: 2,
    size: "32 m²",
    bedType: "2 Single Beds",
    type: "twin",
    status: "available",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["wifi", "tv", "coffee", "bath", "air conditioning", "desk", "safe", "hairdryer"],
  },
  {
    id: 8,
    name: "Penthouse Suite",
    description: "The ultimate luxury suite with private terrace and city views.",
    longDescription:
      "Indulge in the height of luxury in our Penthouse Suite. This exclusive suite offers a spacious living area, a master bedroom with a king-size bed, a private terrace with panoramic city views, and a luxurious bathroom with a jacuzzi. Enjoy top-tier amenities including a fully stocked minibar, premium entertainment system, and personalized concierge service. Perfect for special occasions or guests seeking an extraordinary experience.",
    price: 1200,
    capacity: 4,
    size: "120 m²",
    bedType: "1 King Bed + 1 Sofa Bed",
    type: "penthouse",
    status: "available",
    image:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["wifi", "tv", "coffee", "bath", "minibar", "air conditioning", "desk", "safe", "hairdryer", "jacuzzi", "terrace", "city view"],
  },
]
