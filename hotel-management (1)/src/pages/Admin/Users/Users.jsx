"use client"

/**
 * Users.jsx
 *
 * Vai trò: Trang quản lý người dùng cho admin.
 * Chức năng:
 * - Hiển thị danh sách người dùng
 * - Thêm, sửa, xóa người dùng
 * - Phân quyền người dùng
 *
 * Quyền truy cập: Admin
 */

import { useState, useEffect, useMemo } from "react"
import { useTable, useSortBy, useGlobalFilter, usePagination } from "react-table"
import { motion } from "framer-motion"
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa"
import { toast } from "react-toastify"
import authService from "../../../services/authService"
import { ROLES } from "../../../config/constants"
import "./Users.css"

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  // Fetch users data
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await authService.getAllUsers()
      setUsers(response.data)
    } catch (error) {
      toast.error("Không thể tải danh sách người dùng")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Handle user operations
  const handleAddUser = () => {
    setCurrentUser(null)
    setShowForm(true)
  }

  const handleEditUser = (user) => {
    setCurrentUser(user)
    setShowForm(true)
  }

  const handleDeleteUser = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      try {
        await authService.deleteUser(id)
        toast.success("Xóa người dùng thành công")
        fetchUsers()
      } catch (error) {
        toast.error("Không thể xóa người dùng")
        console.error(error)
      }
    }
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
        Header: "Vai trò",
        accessor: "role",
        Cell: ({ value }) => {
          const roleLabel = value === ROLES.ADMIN ? "Admin" : value === ROLES.EMPLOYEE ? "Nhân viên" : "Khách hàng"

          return <span className={`role-badge role-${value}`}>{roleLabel}</span>
        },
      },
      {
        Header: "Ngày tạo",
        accessor: "createdAt",
        Cell: ({ value }) => new Date(value).toLocaleDateString("vi-VN"),
      },
      {
        Header: "Thao tác",
        Cell: ({ row }) => (
          <div className="action-buttons">
            <button className="edit-button" onClick={() => handleEditUser(row.original)} title="Chỉnh sửa">
              <FaEdit />
            </button>
            <button className="delete-button" onClick={() => handleDeleteUser(row.original.id)} title="Xóa">
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
      data: users,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
  )

  const { globalFilter, pageIndex, pageSize } = state

  return (
    <div className="users-container">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="page-header"
      >
        <h1>Quản lý người dùng</h1>
        <button className="add-button" onClick={handleAddUser}>
          <FaPlus /> Thêm người dùng mới
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
            placeholder="Tìm kiếm người dùng..."
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
          <table {...getTableProps()} className="users-table">
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
        <div className="user-form-placeholder">
          <p>Form thêm/sửa người dùng sẽ được hiển thị ở đây</p>
          <button onClick={() => setShowForm(false)}>Đóng</button>
        </div>
      )}
    </div>
  )
}

export default Users

