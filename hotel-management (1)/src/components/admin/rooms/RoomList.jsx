"use client"

/**
 * RoomList.jsx
 *
 * Vai trò: Component hiển thị danh sách phòng và các chức năng quản lý phòng.
 * Chức năng:
 * - Hiển thị danh sách phòng dưới dạng bảng
 * - Tìm kiếm và lọc phòng
 * - Thêm, sửa, xóa phòng
 * - Phân trang danh sách phòng
 *
 * Quyền truy cập: Admin và Employee
 */

import { useState, useEffect, useMemo } from "react"
import { useTable, useSortBy, useGlobalFilter, usePagination } from "react-table"
import { FaEdit, FaTrash, FaPlus, FaSearch, FaFilter } from "react-icons/fa"
import { toast } from "react-toastify"
import { motion } from "framer-motion"
import roomService from "../../../services/roomService"
import { ROOM_TYPES, ROOM_STATUS, formatCurrency } from "../../../config/constants"
import RoomForm from "./RoomForm"
import "./RoomList.css"

const RoomList = () => {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [currentRoom, setCurrentRoom] = useState(null)
  const [filters, setFilters] = useState({
    type: "",
    status: "",
    minPrice: "",
    maxPrice: "",
  })

  // Fetch rooms data
  const fetchRooms = async () => {
    try {
      setLoading(true)
      const response = await roomService.getAllRooms()
      setRooms(response.data)
    } catch (error) {
      toast.error("Không thể tải danh sách phòng")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRooms()
  }, [])

  // Handle room filtering
  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const applyFilters = async () => {
    try {
      setLoading(true)
      const response = await roomService.filterRooms(filters)
      setRooms(response.data)
      toast.success("Lọc phòng thành công")
    } catch (error) {
      toast.error("Không thể lọc phòng")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const resetFilters = () => {
    setFilters({
      type: "",
      status: "",
      minPrice: "",
      maxPrice: "",
    })
    fetchRooms()
  }

  // Handle room operations
  const handleAddRoom = () => {
    setCurrentRoom(null)
    setShowForm(true)
  }

  const handleEditRoom = (room) => {
    setCurrentRoom(room)
    setShowForm(true)
  }

  const handleDeleteRoom = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phòng này?")) {
      try {
        await roomService.deleteRoom(id)
        toast.success("Xóa phòng thành công")
        fetchRooms()
      } catch (error) {
        toast.error("Không thể xóa phòng")
        console.error(error)
      }
    }
  }

  const handleFormSubmit = async (roomData) => {
    try {
      if (currentRoom) {
        // Update existing room
        await roomService.updateRoom(currentRoom.id, roomData)
        toast.success("Cập nhật phòng thành công")
      } else {
        // Create new room
        await roomService.createRoom(roomData)
        toast.success("Thêm phòng mới thành công")
      }
      setShowForm(false)
      fetchRooms()
    } catch (error) {
      toast.error(currentRoom ? "Không thể cập nhật phòng" : "Không thể thêm phòng mới")
      console.error(error)
    }
  }

  // Table columns
  const columns = useMemo(
    () => [
      {
        Header: "Số phòng",
        accessor: "roomNumber",
      },
      {
        Header: "Loại phòng",
        accessor: "type",
        Cell: ({ value }) => ROOM_TYPES.find((type) => type.value === value)?.label || value,
      },
      {
        Header: "Số giường",
        accessor: "beds",
      },
      {
        Header: "Sức chứa",
        accessor: "capacity",
        Cell: ({ value }) => `${value} người`,
      },
      {
        Header: "Giá phòng",
        accessor: "price",
        Cell: ({ value }) => formatCurrency(value),
      },
      {
        Header: "Trạng thái",
        accessor: "status",
        Cell: ({ value }) => {
          const status = ROOM_STATUS.find((status) => status.value === value)
          return <span className={`status-badge status-${value}`}>{status?.label || value}</span>
        },
      },
      {
        Header: "Thao tác",
        Cell: ({ row }) => (
          <div className="action-buttons">
            <button className="edit-button" onClick={() => handleEditRoom(row.original)} title="Chỉnh sửa">
              <FaEdit />
            </button>
            <button className="delete-button" onClick={() => handleDeleteRoom(row.original.id)} title="Xóa">
              <FaTrash />
            </button>
          </div>
        ),
      },
    ],
    [],
  )

  // React Table hooks
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
      data: rooms,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
  )

  const { globalFilter, pageIndex, pageSize } = state

  return (
    <div className="room-list-container">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="page-header"
      >
        <h1>Quản lý phòng</h1>
        <button className="add-button" onClick={handleAddRoom}>
          <FaPlus /> Thêm phòng mới
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="filter-section"
      >
        <div className="search-box">
          <FaSearch />
          <input
            value={globalFilter || ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Tìm kiếm phòng..."
          />
        </div>

        <div className="filters">
          <div className="filter-group">
            <label>Loại phòng:</label>
            <select name="type" value={filters.type} onChange={handleFilterChange}>
              <option value="">Tất cả</option>
              {ROOM_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Trạng thái:</label>
            <select name="status" value={filters.status} onChange={handleFilterChange}>
              <option value="">Tất cả</option>
              {ROOM_STATUS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Giá từ:</label>
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              placeholder="Giá tối thiểu"
            />
          </div>

          <div className="filter-group">
            <label>Giá đến:</label>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              placeholder="Giá tối đa"
            />
          </div>

          <button className="filter-button" onClick={applyFilters}>
            <FaFilter /> Lọc
          </button>
          <button className="reset-button" onClick={resetFilters}>
            Đặt lại
          </button>
        </div>
      </motion.div>

      {loading ? (
        <div className="loading">Đang tải dữ liệu...</div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="table-container"
        >
          <table {...getTableProps()} className="room-table">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                  {headerGroup.headers.map((column) => (
                    <th
                      key={column.id}
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className={column.isSorted ? (column.isSortedDesc ? "sort-desc" : "sort-asc") : ""}
                    >
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row)
                return (
                  <tr {...row.getRowProps()} key={row.id}>
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()} key={cell.id}>
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>

          <div className="pagination">
            <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
              {"<<"}
            </button>
            <button onClick={() => previousPage()} disabled={!canPreviousPage}>
              {"<"}
            </button>
            <span>
              Trang{" "}
              <strong>
                {pageIndex + 1} / {pageOptions.length}
              </strong>
            </span>
            <button onClick={() => nextPage()} disabled={!canNextPage}>
              {">"}
            </button>
            <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
              {">>"}
            </button>
            <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
              {[10, 20, 30, 40, 50].map((size) => (
                <option key={size} value={size}>
                  Hiển thị {size}
                </option>
              ))}
            </select>
          </div>
        </motion.div>
      )}

      {showForm && <RoomForm room={currentRoom} onSubmit={handleFormSubmit} onCancel={() => setShowForm(false)} />}
    </div>
  )
}

export default RoomList

