"use client"

/**
 * Invoices.jsx
 *
 * Vai trò: Trang quản lý hóa đơn cho admin và nhân viên.
 * Chức năng:
 * - Hiển thị danh sách hóa đơn
 * - Tạo hóa đơn mới
 * - Xem chi tiết hóa đơn
 * - In hóa đơn
 *
 * Quyền truy cập: Admin và Employee
 */

import { useState, useEffect, useMemo } from "react"
import { useTable, useSortBy, useGlobalFilter, usePagination } from "react-table"
import { motion } from "framer-motion"
import { FaEye, FaPrint, FaPlus, FaSearch, FaFilter } from "react-icons/fa"
import { format } from "date-fns"
import { toast } from "react-toastify"
import bookingService from "../../../services/bookingService"
import { PAYMENT_STATUS, formatCurrency } from "../../../config/constants"
import "./Invoices.css"

const Invoices = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    paymentStatus: "",
    startDate: "",
    endDate: "",
  })

  // Fetch bookings data (which will be used to generate invoices)
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

  // Handle invoice filtering
  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const applyFilters = async () => {
    try {
      setLoading(true)
      const response = await bookingService.filterBookings(filters)
      setBookings(response.data)
      toast.success("Lọc hóa đơn thành công")
    } catch (error) {
      toast.error("Không thể lọc hóa đơn")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const resetFilters = () => {
    setFilters({
      paymentStatus: "",
      startDate: "",
      endDate: "",
    })
    fetchBookings()
  }

  // Handle invoice operations
  const handleViewInvoice = async (bookingId) => {
    try {
      const response = await bookingService.createInvoice(bookingId)
      // In a real application, you would open a modal or navigate to a new page
      // to display the invoice details
      console.log("Invoice details:", response.data)
      toast.success("Xem hóa đơn thành công")
    } catch (error) {
      toast.error("Không thể tạo hóa đơn")
      console.error(error)
    }
  }

  const handlePrintInvoice = async (bookingId) => {
    try {
      const response = await bookingService.createInvoice(bookingId)
      // In a real application, you would generate a PDF and open it in a new window
      console.log("Print invoice:", response.data)
      toast.success("Chuẩn bị in hóa đơn")
    } catch (error) {
      toast.error("Không thể tạo hóa đơn để in")
      console.error(error)
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
        Header: "Tổng tiền",
        accessor: "totalAmount",
        Cell: ({ value }) => formatCurrency(value),
      },
      {
        Header: "Trạng thái thanh toán",
        accessor: "paymentStatus",
        Cell: ({ value }) => {
          const status = PAYMENT_STATUS.find((status) => status.value === value)
          return <span className={`status-badge payment-status-${value}`}>{status?.label || value}</span>
        },
      },
      {
        Header: "Thao tác",
        Cell: ({ row }) => (
          <div className="action-buttons">
            <button className="view-button" onClick={() => handleViewInvoice(row.original.id)} title="Xem hóa đơn">
              <FaEye />
            </button>
            <button className="print-button" onClick={() => handlePrintInvoice(row.original.id)} title="In hóa đơn">
              <FaPrint />
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
    <div className="invoices-container">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="page-header"
      >
        <h1>Quản lý hóa đơn</h1>
        <button className="add-button">
          <FaPlus /> Tạo hóa đơn mới
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
            placeholder="Tìm kiếm hóa đơn..."
          />
        </div>

        <div className="filters">
          <div className="filter-group">
            <label>Trạng thái thanh toán:</label>
            <select name="paymentStatus" value={filters.paymentStatus} onChange={handleFilterChange}>
              <option value="">Tất cả</option>
              {PAYMENT_STATUS.map((status) => (
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
          <table {...getTableProps()} className="invoices-table">
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

export default Invoices

