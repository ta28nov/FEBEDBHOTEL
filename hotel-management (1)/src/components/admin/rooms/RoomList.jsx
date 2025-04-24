"use client"

/**
 * RoomList.jsx
 *
 * Vai trò: Component hiển thị danh sách phòng và các chức năng quản lý phòng.
 * Chức năng:
 * - Hiển thị danh sách phòng dưới dạng bảng
 * - Tìm kiếm phòng (toàn cục)
 * - Thêm, sửa, xóa phòng
 * - Phân trang danh sách phòng
 *
 * Quyền truy cập: Admin và Employee (Xóa chỉ Admin)
 */

import { useState, useEffect, useMemo } from "react"
import { useTable, useSortBy, useGlobalFilter, usePagination } from "react-table"
import { FaEdit, FaTrash, FaPlus, FaSearch, FaImages } from "react-icons/fa"
import { toast } from "react-toastify"
import { motion } from "framer-motion"
import roomService from "../../../services/roomService" // Corrected service
// Import AuthContext to check user role
import { useAuth } from "../../../context/AuthContext"
import { formatCurrency } from "../../../config/constants" // Import directly if needed
import RoomForm from "./RoomForm" // Assuming RoomForm is updated
import RoomTypeImageManager from './RoomTypeImageManager'; // Import the new component
import "./RoomList.css"

const RoomList = () => {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [currentRoom, setCurrentRoom] = useState(null) // For editing
  const [isEditMode, setIsEditMode] = useState(false)
  const [showImageManagerModal, setShowImageManagerModal] = useState(false);
  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState(null);
  const [selectedRoomTypeName, setSelectedRoomTypeName] = useState('');

  // Get current user from AuthContext
  const { currentUser } = useAuth()

  // Fetch rooms data using the corrected service
  const fetchRooms = async () => {
    try {
      setLoading(true)
      const response = await roomService.getAllRooms() // Calls GET /api/rooms
      // Ensure response.data is an array
      setRooms(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      toast.error("Không thể tải danh sách phòng")
      console.error("Fetch rooms error:", error)
      setRooms([]) // Set to empty array on error
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRooms()
  }, [])

  // Handle room operations
  const handleAddRoom = () => {
    setCurrentRoom(null) // Clear current room
    setIsEditMode(false)
    setShowForm(true) // Show the form in 'add' mode
  }

  const handleEditRoom = (room) => {
    setCurrentRoom(room) // Set the room to edit
    setIsEditMode(true)
    setShowForm(true) // Show the form in 'edit' mode
  }

  // Function to open the image manager modal
  const handleManageImages = (room) => {
    setSelectedRoomTypeId(room.roomTypeId);
    setSelectedRoomTypeName(room.roomTypeName);
    setShowImageManagerModal(true);
  };

  const handleDeleteRoom = async (id) => {
    // Double-check admin role before proceeding (although button visibility handles this too)
    if (currentUser?.role !== 'admin') {
        toast.error("Bạn không có quyền xóa phòng.");
        return;
    }

    if (window.confirm("Bạn có chắc chắn muốn xóa phòng này?")) {
      try {
        setLoading(true); // Indicate loading during delete
        await roomService.deleteRoom(id) // Calls DELETE /api/rooms/{id}
        toast.success("Xóa phòng thành công")
        fetchRooms() // Refetch list after successful delete
      } catch (error) {
        // Check for specific error messages if available
        const errorMessage = error.response?.data?.message || "Không thể xóa phòng";
        toast.error(errorMessage)
        console.error("Delete room error:", error)
        setLoading(false); // Ensure loading is reset on error
      }
      // No finally block needed here as fetchRooms handles its own loading state
    }
  }

  // This function will be called by RoomForm upon successful submission
  const handleFormSuccess = () => {
    setShowForm(false)
    setCurrentRoom(null)
    fetchRooms() // Refetch data after add/edit
  }

  // Table columns updated to match API spec response
  const columns = useMemo(
    () => [
      {
        Header: "Số phòng",
        accessor: "roomNumber",
      },
      {
        Header: "Loại phòng",
        accessor: "roomTypeName", // Use roomTypeName from API response
      },
      {
        Header: "Tầng",
        accessor: "floor", // Added Floor column
      },
      {
        Header: "Giá Cơ Bản", // From RoomType via API response
        accessor: "basePrice",
        Cell: ({ value }) => formatCurrency(value),
      },
      {
        Header: "Sức chứa", // From RoomType via API response
        accessor: "capacity",
        Cell: ({ value }) => `${value} người`,
      },
      {
        Header: "Trạng thái",
        accessor: "status",
        Cell: ({ value }) => {
          // Basic status display, can be enhanced with badges/colors
          // Assuming value is like "Available", "Occupied", "Maintenance"
          const statusClass = `status-${value?.toLowerCase().replace(' ', '-') || 'unknown'}`;
          return <span className={`status-badge ${statusClass}`}>{value || 'N/A'}</span>
        },
      },
      {
        Header: "Thao tác",
        id: 'actions',
        Cell: ({ row }) => (
          <div className="action-buttons">
            <button className="edit-button" onClick={() => handleEditRoom(row.original)} title="Chỉnh sửa">
              <FaEdit />
            </button>
            <button
                className="manage-images-button"
                onClick={() => handleManageImages(row.original)}
                title="Quản lý ảnh"
             >
                <FaImages />
             </button>
            {/* Conditionally render delete button only for Admins */}
            {currentUser?.role === 'admin' && (
              <button className="delete-button" onClick={() => handleDeleteRoom(row.original.id)} title="Xóa">
                <FaTrash />
              </button>
            )}
          </div>
        ),
      },
    ],
    [currentUser], // Add currentUser as dependency for the delete button logic
  )

  // React Table hooks (remain mostly the same)
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state,
    setGlobalFilter,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    gotoPage,
    pageCount,
    setPageSize,
  } = useTable(
    {
      columns,
      data: rooms, // Use the fetched rooms data
      initialState: { pageIndex: 0, pageSize: 10 },
      // Disable multi-sort, filters if not needed
      disableSortBy: false,
      disableFilters: true, // Global filter is separate
      disableGlobalFilter: false,
    },
    useGlobalFilter,
    useSortBy, // Keep sorting if desired
    usePagination,
  )

  const { globalFilter, pageIndex, pageSize } = state

  // Loading indicator
  if (loading && !showForm && !showImageManagerModal) {
    return <div className="loading-container"><div className="loading-spinner"></div><p>Đang tải dữ liệu phòng...</p></div>;
  }

  return (
    <div className="room-list-container">
      {/* Conditionally render the RoomForm */} 
      {showForm ? (
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           transition={{ duration: 0.3 }}
        >
           <RoomForm
            room={currentRoom} // Pass the room data for editing, null for adding
            isEditMode={isEditMode}
            onClose={() => setShowForm(false)} // Prop to close the form
            onSuccess={handleFormSuccess} // Prop to handle successful submission
          />
        </motion.div>
      ) : null}

      {/* Conditionally render the RoomTypeImageManager Modal */} 
      {showImageManagerModal ? (
          <RoomTypeImageManager
            roomTypeId={selectedRoomTypeId}
            roomTypeName={selectedRoomTypeName}
            onClose={() => {
                setShowImageManagerModal(false);
                setSelectedRoomTypeId(null);
                setSelectedRoomTypeName('');
                // Optional: Refetch rooms if image changes might affect display (e.g., primary image)
                // fetchRooms();
            }}
          />
      ) : null}

      {/* Render the main list/table only when forms/modals are not shown */} 
      {!showForm && !showImageManagerModal ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="page-header">
            <h1>Quản lý phòng</h1>
            <button className="add-button" onClick={handleAddRoom}>
              <FaPlus /> Thêm phòng mới
            </button>
          </div>

          <div className="table-controls">
            <div className="search-box">
              <FaSearch />
              <input
                value={globalFilter || ""}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder={`Tìm kiếm trong ${rooms.length} phòng...`}
              />
            </div>
            {/* Removed filter section */}
          </div>

          {/* Render the table */} 
          <div className="table-responsive">
             <table {...getTableProps()} className="room-table">
              <thead>
                {headerGroups.map(headerGroup => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map(column => (
                      <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                        {column.render('Header')}
                        <span>
                          {column.isSorted
                            ? column.isSortedDesc
                              ? ' 🔽'
                              : ' 🔼'
                            : ''}
                        </span>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {page.map(row => {
                  prepareRow(row)
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map(cell => (
                        <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                      ))}
                    </tr>
                  )
                })}
                {page.length === 0 && (
                  <tr>
                    <td colSpan={columns.length} className="no-data">
                      Không tìm thấy phòng nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

           {/* Pagination Controls */} 
          {pageOptions.length > 1 && (
             <div className="pagination-controls">
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                  {'<<'}
                </button>{' '}
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                  {'<'}
                </button>{' '}
                <span>
                  Trang{' '}
                  <strong>
                    {pageIndex + 1} trên {pageOptions.length}
                  </strong>{' '}
                </span>
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                  {'>'}
                </button>{' '}
                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                  {'>>'}
                </button>{' '}
                <span>
                  | Tới trang:{' '}
                  <input
                    type="number"
                    defaultValue={pageIndex + 1}
                    onChange={e => {
                      const pageNum = e.target.value ? Number(e.target.value) - 1 : 0;
                      gotoPage(pageNum);
                    }}
                    style={{ width: '50px' }}
                  />
                </span>{' '}
                <select
                  value={pageSize}
                  onChange={e => {
                    setPageSize(Number(e.target.value));
                  }}
                >
                  {[10, 20, 30, 40, 50].map(pageSize => (
                    <option key={pageSize} value={pageSize}>
                      Hiển thị {pageSize}
                    </option>
                  ))}
                </select>
              </div>
          )}
        </motion.div>
      ) : null}
    </div>
  )
}

export default RoomList

