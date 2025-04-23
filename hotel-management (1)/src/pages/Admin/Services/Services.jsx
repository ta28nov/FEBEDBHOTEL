"use client"

/**
 * Services.jsx
 *
 * Vai trò: Trang quản lý dịch vụ cho admin và nhân viên.
 * Chức năng:
 * - Hiển thị danh sách dịch vụ
 * - Thêm, sửa, xóa dịch vụ
 * - Lọc dịch vụ theo danh mục
 *
 * Quyền truy cập: Admin và Employee
 */

import { useState, useEffect, useMemo } from "react"
import { useTable, useSortBy, useGlobalFilter, usePagination } from "react-table"
import { motion } from "framer-motion"
import { FaEdit, FaTrash, FaPlus, FaSearch, FaFilter } from "react-icons/fa"
import { toast } from "react-toastify"
import serviceService from "../../../services/serviceService"
import { SERVICE_CATEGORIES, formatCurrency } from "../../../config/constants"
import "./Services.css"

const Services = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [currentService, setCurrentService] = useState(null)
  const [filters, setFilters] = useState({
    category: "",
  })

  // Fetch services data
  const fetchServices = async () => {
    try {
      setLoading(true)
      const response = await serviceService.getAllServices()
      setServices(response.data)
    } catch (error) {
      toast.error("Không thể tải danh sách dịch vụ")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  // Handle service filtering
  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const applyFilters = async () => {
    try {
      setLoading(true)
      const response = await serviceService.filterServicesByCategory(filters.category)
      setServices(response.data)
      toast.success("Lọc dịch vụ thành công")
    } catch (error) {
      toast.error("Không thể lọc dịch vụ")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const resetFilters = () => {
    setFilters({
      category: "",
    })
    fetchServices()
  }

  // Handle service operations
  const handleAddService = () => {
    setCurrentService(null)
    setShowForm(true)
  }

  const handleEditService = (service) => {
    setCurrentService(service)
    setShowForm(true)
  }

  const handleDeleteService = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa dịch vụ này?")) {
      try {
        await serviceService.deleteService(id)
        toast.success("Xóa dịch vụ thành công")
        fetchServices()
      } catch (error) {
        toast.error("Không thể xóa dịch vụ")
        console.error(error)
      }
    }
  }

  // Table columns
  const columns = useMemo(
    () => [
      {
        Header: "Tên dịch vụ",
        accessor: "name",
      },
      {
        Header: "Danh mục",
        accessor: "category",
        Cell: ({ value }) => {
          const category = SERVICE_CATEGORIES.find((cat) => cat.value === value)
          return category ? category.label : value
        },
      },
      {
        Header: "Mô tả",
        accessor: "description",
        Cell: ({ value }) => (
          <div className="description-cell">{value.length > 100 ? `${value.substring(0, 100)}...` : value}</div>
        ),
      },
      {
        Header: "Giá",
        accessor: "price",
        Cell: ({ value }) => formatCurrency(value),
      },
      {
        Header: "Trạng thái",
        accessor: "isAvailable",
        Cell: ({ value }) => (
          <span className={`status-badge ${value ? "status-available" : "status-unavailable"}`}>
            {value ? "Có sẵn" : "Không có sẵn"}
          </span>
        ),
      },
      {
        Header: "Thao tác",
        Cell: ({ row }) => (
          <div className="action-buttons">
            <button className="edit-button" onClick={() => handleEditService(row.original)} title="Chỉnh sửa">
              <FaEdit />
            </button>
            <button className="delete-button" onClick={() => handleDeleteService(row.original.id)} title="Xóa">
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
      data: services,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
  )

  const { globalFilter, pageIndex, pageSize } = state

  return (
    <div className="services-container">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="page-header"
      >
        <h1>Quản lý dịch vụ</h1>
        <button className="add-button" onClick={handleAddService}>
          <FaPlus /> Thêm dịch vụ mới
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
            placeholder="Tìm kiếm dịch vụ..."
          />
        </div>

        <div className="filters">
          <div className="filter-group">
            <label>Danh mục:</label>
            <select name="category" value={filters.category} onChange={handleFilterChange}>
              <option value="">Tất cả</option>
              {SERVICE_CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
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
          <table {...getTableProps()} className="services-table">
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

      {/* Form component would be added here */}
      {showForm && (
        <div className="service-form-placeholder">
          <p>Form thêm/sửa dịch vụ sẽ được hiển thị ở đây</p>
          <button onClick={() => setShowForm(false)}>Đóng</button>
        </div>
      )}
    </div>
  )
}

export default Services

