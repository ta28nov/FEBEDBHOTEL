"use client"

import { useEffect, useRef } from "react"
import "./SmoothScroll.css"

// Component tạo hiệu ứng cuộn mượt mà lấy cảm hứng từ casangelina.com
const SmoothScroll = ({ children }) => {
  // Refs để lưu trữ các phần tử DOM
  const scrollingContainerRef = useRef(null)
  const scrollingContentRef = useRef(null)

  // Biến lưu trữ trạng thái cuộn
  const data = useRef({
    ease: 0.1, // Độ mượt của hiệu ứng (0.1 = 10%)
    current: 0, // Vị trí cuộn hiện tại
    previous: 0, // Vị trí cuộn trước đó
    rounded: 0, // Vị trí cuộn đã làm tròn
    requestId: null, // ID của requestAnimationFrame
  })

  // Hàm thiết lập kích thước ban đầu
  const setBodyHeight = () => {
    if (!scrollingContentRef.current) return

    // Thiết lập chiều cao của body bằng với chiều cao của nội dung
    document.body.style.height = `${scrollingContentRef.current.getBoundingClientRect().height}px`
  }

  // Hàm xử lý sự kiện cuộn
  const smoothScrolling = () => {
    if (!scrollingContentRef.current) return

    // Cập nhật vị trí cuộn hiện tại
    data.current.current = window.scrollY

    // Tính toán vị trí mới dựa trên độ mượt
    data.current.previous += (data.current.current - data.current.previous) * data.current.ease

    // Làm tròn giá trị để tránh các vấn đề về hiệu suất
    data.current.rounded = Math.round(data.current.previous * 100) / 100

    // Áp dụng transform để tạo hiệu ứng cuộn mượt
    scrollingContentRef.current.style.transform = `translateY(-${data.current.rounded}px)`

    // Tiếp tục vòng lặp animation
    data.current.requestId = requestAnimationFrame(smoothScrolling)
  }

  // Hàm xử lý thay đổi kích thước cửa sổ
  const handleResize = () => {
    setBodyHeight()
  }

  useEffect(() => {
    // Thiết lập kích thước ban đầu
    setBodyHeight()

    // Bắt đầu hiệu ứng cuộn mượt
    data.current.requestId = requestAnimationFrame(smoothScrolling)

    // Thêm sự kiện lắng nghe thay đổi kích thước cửa sổ
    window.addEventListener("resize", handleResize)

    // Dọn dẹp khi component unmount
    return () => {
      if (data.current.requestId) {
        cancelAnimationFrame(data.current.requestId)
      }
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div className="smooth-scroll-container" ref={scrollingContainerRef}>
      <div className="smooth-scroll-content" ref={scrollingContentRef}>
        {children}
      </div>
    </div>
  )
}

export default SmoothScroll

