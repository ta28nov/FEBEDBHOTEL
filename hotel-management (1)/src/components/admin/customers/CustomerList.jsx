"use client"

/**
 * CustomerList.jsx
 *
 * Vai trò: Component hiển thị danh sách khách hàng và các chức năng quản lý khách hàng.
 * Chức năng:
 * - Hiển thị danh sách khách hàng dưới dạng bảng
 * - Tìm kiếm khách hàng
 * - Thêm, sửa, xóa khách hàng
 * - Xem lịch sử đặt phòng của khách hàng
 * - Phân trang danh sách khách hàng
 *
 * Quyền truy cập: Admin và Employee
 */

import { useState, useEffect, useMemo } from "react"
import { useTable, useSortBy, useGlobalFilter, usePagination } from "react-table"
import { FaEdit, FaTrash, FaPlus, FaSearch, FaHistory } from "react-icons/fa"
import { toast } from "react-toastify"
import { motion } from "framer-motion"
import customerService from "../../../services/customerService"
import CustomerForm from "./CustomerForm"
import BookingHistory from "./BookingHistory"
import "./CustomerList.css"

const CustomerList = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [currentCustomer, setCurrentCustomer] = useState(null)
  const [showBookingHistory, setShowBookingHistory] = useState(false)
  const [selectedCustomerId, setSelectedCustomerId] = useState(null)

  // Fetch customers data
  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const response = await customerService.getAllCustomers()
      setCustomers(response.data)
    } catch (error) {
      toast.error("Không thể tải danh sách khách hàng")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  // Handle customer operations
  const handleAddCustomer = () => {
    setCurrentCustomer(null)
    setShowForm(true)
  }

  const handleEditCustomer = (customer) => {
    setCurrentCustomer(customer)
    setShowForm(true)
  }

  const handleDeleteCustomer = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) {
      try {
        await customerService.deleteCustomer(id)
        toast.success("Xóa khách hàng thành công")
        fetchCustomers()
      } catch (error) {
        toast.error("Không thể xóa khách hàng")
        console.error(error)
      }
    }
  }

  const handleFormSubmit = async (customerData) => {
    try {
      if (currentCustomer) {
        // Update existing customer
        await customerService.updateCustomer(currentCustomer.id, customerData)
        toast.success("Cập nhật khách hàng thành công")
      } else {
        // Create new customer
        await customerService.createCustomer(customerData)
        toast.success("Thêm khách hàng mới thành công")
      }
      setShowForm(false)
      fetchCustomers()
    } catch (error) {
      toast.error(currentCustomer ? "Không thể cập nhật khách hàng" : "Không thể thêm khách hàng mới")
      console.error(error)
    }
  }

  const handleViewBookingHistory = (customerId) => {
    setSelectedCustomerId(customerId)
    setShowBookingHistory(true)
  }

  // Table columns
  const columns = useMemo(
    () => [
      {
        Header: "Họ tên",
        accessor: "name",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Số điện thoại",
        accessor: "phone",
      },
      {
        Header: "CCCD/Passport",
        accessor: "idNumber",
      },
      {
        Header: "Quốc tịch",
        accessor: "nationality",
      },
      {
        Header: "Thao tác",
        Cell: ({ row }) => (
          <div className="action-buttons">
            <button
              className="history-button"
              onClick={() => handleViewBookingHistory(row.original.id)}
              title="Lịch sử đặt phòng"
            >
              <FaHistory />
            </button>
            <button className="edit-button" onClick={() => handleEditCustomer(row.original)} title="Chỉnh sửa">
              <FaEdit />
            </button>
            <button className="delete-button" onClick={() => handleDeleteCustomer(row.original.id)} title="Xóa">
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
      data: customers,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
  )

  const { globalFilter, pageIndex, pageSize } = state

  return (
    <div className="customer-list-container">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="page-header"
      >
        <h1>Quản lý khách hàng</h1>
        <button className="add-button" onClick={handleAddCustomer}>
          <FaPlus /> Thêm khách hàng mới
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
            placeholder="Tìm kiếm khách hàng..."
          />
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
          <table {...getTableProps()} className="customer-table">
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

      {showForm && (
        <CustomerForm customer={currentCustomer} onSubmit={handleFormSubmit} onCancel={() => setShowForm(false)} />
      )}

      {showBookingHistory && (
        <BookingHistory customerId={selectedCustomerId} onClose={() => setShowBookingHistory(false)} />
      )}
    </div>
  )
}

export default CustomerList

