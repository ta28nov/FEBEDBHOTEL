"use client"

import { useState, useEffect, useCallback } from 'react';
import { FaTimes, FaTrash, FaUpload, FaImage } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import roomService from '../../../services/roomService';
import './RoomTypeImageManager.css'; // Create this CSS file

const RoomTypeImageManager = ({ roomTypeId, roomTypeName, onClose }) => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isPrimary, setIsPrimary] = useState(false);

  const fetchImages = useCallback(async () => {
    if (!roomTypeId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await roomService.getRoomTypeById(roomTypeId);
      // Assuming the response data has an 'images' array
      setImages(response.data?.images || []);
    } catch (err) {
      console.error("Error fetching room type images:", err);
      setError("Không thể tải danh sách ảnh.");
      toast.error("Không thể tải danh sách ảnh.");
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, [roomTypeId]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
      setIsPrimary(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !roomTypeId) {
      toast.warn("Vui lòng chọn một file ảnh.");
      return;
    }

    setIsUploading(true);
    try {
      await roomService.uploadRoomTypeImage({
        roomTypeId: roomTypeId,
        imageFile: selectedFile,
        isPrimary: isPrimary
      });
      toast.success('Tải ảnh lên thành công!');
      setSelectedFile(null);
      setIsPrimary(false);
      document.getElementById('imageUpload').value = null;
      fetchImages();
    } catch (uploadError) {
      console.error("Error uploading image:", uploadError);

      // --- Log chi tiết lỗi từ backend --- 
      console.error("Backend Error Response:", uploadError.response?.data);
      // ---------------------------------

      // Cố gắng lấy message lỗi cụ thể hơn từ backend nếu có
      let errorMsg = "Lỗi tải ảnh lên."; // Default message
      if (uploadError.response?.data) {
          if (typeof uploadError.response.data === 'string') {
              errorMsg = uploadError.response.data;
          } else if (uploadError.response.data.message) {
              errorMsg = uploadError.response.data.message;
          } else if (uploadError.response.data.title) { // ASP.NET Core validation problem details
              errorMsg = uploadError.response.data.title;
          } else if (uploadError.response.data.errors) { // Handle validation errors object
             try {
                 const firstErrorKey = Object.keys(uploadError.response.data.errors)[0];
                 errorMsg = uploadError.response.data.errors[firstErrorKey][0];
             } catch { /* Fallback to default if structure is unexpected */ }
          }
      }

      toast.error(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (imageId) => {
    if (window.confirm("Bạn có chắc muốn xóa ảnh này?")) {
      try {
        // Pass a placeholder for roomId as the service expects it based on URL structure,
        // even if backend logic might ignore it.
        await roomService.deleteRoomTypeImage(imageId, 'placeholder');
        toast.success('Xóa ảnh thành công!');
        fetchImages(); // Refresh image list
      } catch (deleteError) {
        console.error("Error deleting image:", deleteError);
        toast.error(deleteError.response?.data?.message || "Lỗi xóa ảnh.");
      }
    }
  };

  return (
    <div className="image-manager-overlay">
      <motion.div
        className="image-manager-container"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.3 }}
      >
        <div className="image-manager-header">
          <h3>Quản lý ảnh cho: {roomTypeName || `Loại phòng ${roomTypeId}`}</h3>
          <button onClick={onClose} className="close-button" title="Đóng">
            <FaTimes />
          </button>
        </div>

        <div className="image-manager-content">
          {/* Upload Section */} 
          <div className="upload-section">
            <h4>Tải ảnh mới</h4>
            <div className="upload-controls">
                <label htmlFor="imageUpload" className="upload-label">
                    <FaImage /> {selectedFile ? selectedFile.name : 'Chọn file ảnh'}
                    <input
                        type="file"
                        id="imageUpload"
                        accept="image/png, image/jpeg, image/gif, image/webp"
                        onChange={handleFileChange}
                        style={{ display: 'none' }} // Hide default input
                    />
                </label>
                 <button
                    onClick={handleUpload}
                    disabled={!selectedFile || isUploading}
                    className="upload-button"
                 >
                   {isUploading ? 'Đang tải...' : <><FaUpload /> Tải lên</>}
                 </button>
            </div>
            <div className="is-primary-control">
                <input
                    type="checkbox"
                    id="isPrimaryCheckbox"
                    checked={isPrimary}
                    onChange={(e) => setIsPrimary(e.target.checked)}
                    disabled={!selectedFile || isUploading}
                />
                <label htmlFor="isPrimaryCheckbox">Đặt làm ảnh chính</label>
             </div>
          </div>

          {/* Image List Section */} 
          <h4>Ảnh hiện có</h4>
          {loading && <p>Đang tải ảnh...</p>}
          {error && <p className="error-message">{error}</p>}
          {!loading && !error && (
            <div className="image-list">
              {images.length === 0 ? (
                <p>Không có ảnh nào cho loại phòng này.</p>
              ) : (
                images.map((img) => (
                  <div key={img.id || img.url} className="image-item">
                    <img
                        // Prepend base URL if necessary, assuming URL is relative
                        src={import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}${img.url}` : img.url}
                        alt={`Ảnh ${img.id}`}
                        onError={(e) => { e.target.src = '/images/placeholder.png'; }} // Fallback image
                    />
                    <button
                      className="delete-image-button"
                      onClick={() => handleDelete(img.id)}
                      title="Xóa ảnh"
                    >
                      <FaTrash />
                    </button>
                    {/* Optional: Display isPrimary status */}
                    {img.isPrimary && <span className="primary-badge">Chính</span>}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

      </motion.div>
    </div>
  );
};

export default RoomTypeImageManager; 