"use client"

/**
 * Bookings.jsx
 *
 * Vai trò: Trang quản lý đặt phòng cho admin và nhân viên.
 * Chức năng:
 * - Hiển thị danh sách đặt phòng
 * - Thêm, sửa, xóa đặt phòng
 * - Cập nhật trạng thái đặt phòng
 * - Xem chi tiết đặt phòng
 *
 * Quyền truy cập: Admin và Employee
 */

import { useState, useEffect, useMemo } from "react"
import { useTable, useSortBy, useGlobalFilter, usePagination } from "react-table"
import { motion } from "framer-motion"
import { FaEdit, FaTrash, FaEye, FaSearch, FaFilter, FaPlus } from "react-icons/fa"
import { format } from "date-fns"
import { toast } from "react-toastify"
import bookingService from "../../../services/bookingService"
import { BOOKING_STATUS, formatCurrency } from "../../../config/constants"
import "./Bookings.css"

const Bookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: "",
    startDate: "",
    endDate: "",
  })

  // Fetch bookings data
  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await bookingService.getAllBookings()
      setBookings(response.data)
    } catch (error) {
      toast.error("Không thể tải danh sách đặt phòng")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  // Handle booking filtering
  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const applyFilters = async () => {
    try {
      setLoading(true)
      const response = await bookingService.filterBookings(filters)
      setBookings(response.data)
      toast.success("Lọc đặt phòng thành công")
    } catch (error) {
      toast.error("Không thể lọc đặt phòng")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const resetFilters = () => {
    setFilters({
      status: "",
      startDate: "",
      endDate: "",
    })
    fetchBookings()
  }

  // Handle booking operations
  const handleViewBooking = (id) => {
    // Implement view booking details
    console.log("View booking", id)
  }

  const handleEditBooking = (id) => {
    // Implement edit booking
    console.log("Edit booking", id)
  }

  const handleDeleteBooking = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đặt phòng này?")) {
      try {
        await bookingService.deleteBooking(id)
        toast.success("Xóa đặt phòng thành công")
        fetchBookings()
      } catch (error) {
        toast.error("Không thể xóa đặt phòng")
        console.error(error)
      }
    }
  }

  // Table columns
  const columns = useMemo(
    () => [
      {
        Header: "Mã đặt phòng",
        accessor: "id",
        Cell: ({ value }) => `#${value}`,
      },
      {
        Header: "Khách hàng",
        accessor: "customerName",
      },
      {
        Header: "Phòng",
        accessor: "roomNumber",
      },
      {
        Header: "Ngày nhận phòng",
        accessor: "checkInDate",
        Cell: ({ value }) => format(new Date(value), "dd/MM/yyyy"),
      },
      {
        Header: "Ngày trả phòng",
        accessor: "checkOutDate",
        Cell: ({ value }) => format(new Date(value), "dd/MM/yyyy"),
      },
      {
        Header: "Trạng thái",
        accessor: "status",
        Cell: ({ value }) => {
          const status = BOOKING_STATUS.find((status) => status.value === value)
          return <span className={`status-badge status-${value}`}>{status?.label || value}</span>
        },
      },
      {
        Header: "Tổng tiền",
        accessor: "totalAmount",
        Cell: ({ value }) => formatCurrency(value),
      },
      {
        Header: "Thao tác",
        Cell: ({ row }) => (
          <div className="action-buttons">
            <button className="view-button" onClick={() => handleViewBooking(row.original.id)} title="Xem chi tiết">
              <FaEye />
            </button>
            <button className="edit-button" onClick={() => handleEditBooking(row.original.id)} title="Chỉnh sửa">
              <FaEdit />
            </button>
            <button className="delete-button" onClick={() => handleDeleteBooking(row.original.id)} title="Xóa">
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
      data: bookings,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
  )

  const { globalFilter, pageIndex, pageSize } = state

  return (
    <div className="bookings-container">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="page-header"
      >
        <h1>Quản lý đặt phòng</h1>
        <button className="add-button">
          <FaPlus /> Thêm đặt phòng mới
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
            placeholder="Tìm kiếm đặt phòng..."
          />
        </div>

        <div className="filters">
          <div className="filter-group">
            <label>Trạng thái:</label>
            <select name="status" value={filters.status} onChange={handleFilterChange}>
              <option value="">Tất cả</option>
              {BOOKING_STATUS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Từ ngày:</label>
            <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} />
          </div>

          <div className="filter-group">
            <label>Đến ngày:</label>
            <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} />
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
          <table {...getTableProps()} className="bookings-table">
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
    </div>
  )
}

export default Bookings

