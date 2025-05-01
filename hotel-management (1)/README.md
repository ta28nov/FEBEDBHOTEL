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

# Đặc tả API Backend - Quản lý Đặt phòng (Bookings)

Chào đội ngũ Frontend,

Tài liệu này mô tả chi tiết các API endpoints liên quan đến việc xem, tạo, sửa, xóa và quản lý trạng thái **Đặt phòng** (`Bookings`).

**Lưu ý chung:**

*   Hầu hết các API yêu cầu quyền truy cập cụ thể (`Admin`, `Employee`, `Customer` hoặc kết hợp). Luôn kiểm tra cột **Quyền yêu cầu**.
*   Tất cả API (trừ API công khai nếu có) yêu cầu gửi **JWT Token** hợp lệ trong header `Authorization: Bearer {token}`.
*   Backend trả về dữ liệu đặt phòng dưới dạng đối tượng `BookingDto` (chi tiết bên dưới).
*   Một số hành động (check-in, check-out, thêm/xóa dịch vụ) có **trigger tự động** cập nhật trạng thái phòng hoặc tổng tiền booking ở backend.
*   Xử lý lỗi: Chú ý các mã trạng thái HTTP (400, 401, 403, 404, 500) và thông báo lỗi (`message`) trong response body khi có lỗi xảy ra.

---

## I. Cấu trúc dữ liệu chính (`BookingDto`)

Đây là cấu trúc dữ liệu thường được trả về khi lấy thông tin đặt phòng. Backend đã join sẵn các thông tin cần thiết từ các bảng liên quan (`Customers`, `Rooms`, `RoomTypes`, `BookingServices`).

```json
{
  "id": int,                     // ID của đặt phòng
  "customerId": int,             // ID của khách hàng
  "customerName": "string",        // Tên đầy đủ của khách hàng (đã join)
  "customerEmail": "string",       // Email khách hàng (đã join, có thể null)
  "customerPhoneNumber": "string", // Số điện thoại khách hàng (đã join)
  "roomId": int,                 // ID của phòng
  "roomNumber": "string",        // Số phòng (đã join)
  "roomTypeName": "string",      // Tên loại phòng (đã join)
  "checkInDate": "datetime",     // Ngày giờ check-in dự kiến (ISO 8601 format)
  "checkOutDate": "datetime",    // Ngày giờ check-out dự kiến (ISO 8601 format)
  "adults": int,                 // Số người lớn
  "children": int,               // Số trẻ em
  "totalAmount": decimal,        // Tổng tiền đặt phòng (bao gồm cả dịch vụ, tự động cập nhật)
  "status": "string",            // Trạng thái đặt phòng ("pending", "confirmed", "checked_in", "checked_out", "cancelled", "no_show")
  "paymentStatus": "string",     // Trạng thái thanh toán ("pending", "partial", "paid", "refunded", "failed")
  "createdAt": "datetime",       // Ngày giờ tạo đặt phòng (ISO 8601 format)
  "services": [                  // Danh sách các dịch vụ đã sử dụng trong đặt phòng
    {
      "serviceId": int,          // ID của dịch vụ gốc
      "bookingServiceId": int,   // ID của bản ghi trong BookingServices
      "name": "string",        // Tên dịch vụ (đã join)
      "quantity": int,         // Số lượng
      "price": decimal,        // Đơn giá tại thời điểm thêm
      "serviceDate": "datetime"// Ngày giờ sử dụng/thêm dịch vụ
    }
  ],
  "history": [                   // Lịch sử thay đổi trạng thái đặt phòng
    {
      "id": int,
      "status": "string",        // Trạng thái tại thời điểm đó
      "paymentStatus": "string", // Trạng thái thanh toán tại thời điểm đó (có thể null)
      "changedAt": "datetime",   // Thời điểm thay đổi
      "changedByUserId": int,    // ID người dùng thực hiện thay đổi (có thể null)
      "changedByUserName": "string", // Tên người dùng thực hiện thay đổi (đã join, có thể null)
      "notes": "string"        // Ghi chú (có thể null)
    }
  ]
  // Có thể có thêm các trường khác tùy thuộc vào DTO mapper
}
```

---

## II. Lấy thông tin Đặt phòng

### 1. Lấy danh sách tất cả Đặt phòng

*   **Method & URL:** `GET /api/bookings`
*   **Quyền yêu cầu:** **Admin** hoặc **Employee**.
*   **Mô tả:** Lấy danh sách tất cả các đặt phòng trong hệ thống.
*   **Tham số:** Không có.
*   **Response Body (Thành công - 200 OK):**
    *   **Kiểu:** Mảng (Array) các đối tượng `BookingDto` (cấu trúc như Mục I, có thể lược bớt `history` và `services` để tối ưu).
*   **Response Body (Lỗi - 401 Unauthorized / 403 Forbidden):** Nếu không có quyền.

### 2. Lấy thông tin Đặt phòng theo ID

*   **Method & URL:** `GET /api/bookings/{id}`
*   **Quyền yêu cầu:** **Admin**, **Employee**, hoặc **Customer** (chỉ cho đặt phòng của chính họ).
*   **Mô tả:** Lấy thông tin chi tiết đầy đủ của một đặt phòng cụ thể, bao gồm cả dịch vụ và lịch sử. Backend sẽ tự kiểm tra quyền: Customer chỉ xem được booking của mình, Admin/Employee xem được mọi booking.
*   **Tham số URL:**
    *   `{id}` (int): ID của đặt phòng cần lấy.
*   **Response Body (Thành công - 200 OK):**
    *   **Kiểu:** Một đối tượng `BookingDto` (cấu trúc đầy đủ như Mục I).
*   **Response Body (Lỗi - 404 Not Found):** Nếu không tìm thấy đặt phòng với `id` cung cấp.
*   **Response Body (Lỗi - 401 Unauthorized):** Nếu token không hợp lệ (đối với Customer).
*   **Response Body (Lỗi - 403 Forbidden):** Nếu Customer cố gắng xem đặt phòng không phải của mình.

### 3. Lấy danh sách Đặt phòng của Người dùng hiện tại (My Bookings)

*   **Method & URL:** `GET /api/bookings/my-bookings`
*   **Quyền yêu cầu:** **Bất kỳ người dùng nào đã đăng nhập** (Admin, Employee, Customer).
*   **Mô tả:** Lấy danh sách các đặt phòng liên quan đến người dùng đang đăng nhập (dựa trên token).
    *   Nếu là Customer: Chỉ trả về các đặt phòng của Customer đó.
    *   Nếu là Admin/Employee: Trả về **tất cả** các đặt phòng (tương tự `GET /api/bookings`). *Lưu ý: Có vẻ logic này hơi thừa cho Admin/Employee, nhưng hiện tại đang implement như vậy.*
*   **Tham số:** Không có.
*   **Response Body (Thành công - 200 OK):**
    *   **Kiểu:** Mảng (Array) các đối tượng `BookingDto` (cấu trúc như Mục I, có thể lược bớt `history`/`services`).
*   **Response Body (Lỗi - 401 Unauthorized):** Nếu chưa đăng nhập hoặc token không hợp lệ.
*   **Response Body (Lỗi - 404 Not Found):** Nếu không tìm thấy thông tin User từ token.

### 4. Lọc và Tìm kiếm Đặt phòng

*   **Method & URL:** `GET /api/bookings/filter`
*   **Quyền yêu cầu:** **Admin** hoặc **Employee**.
*   **Mô tả:** Lọc danh sách đặt phòng dựa trên nhiều tiêu chí.
*   **Tham số (Query Params - Tất cả đều tùy chọn):**
    *   `fromDate` (datetime): Lọc theo ngày check-in từ ngày này trở đi.
    *   `toDate` (datetime): Lọc theo ngày check-in đến ngày này.
    *   `status` (string): Lọc theo trạng thái đặt phòng chính xác (ví dụ: "confirmed", "checked_in").
    *   `paymentStatus` (string): Lọc theo trạng thái thanh toán chính xác (ví dụ: "pending", "paid").
    *   `customerId` (int): Lọc theo ID khách hàng.
    *   `roomId` (int): Lọc theo ID phòng.
*   **Response Body (Thành công - 200 OK):**
    *   **Kiểu:** Mảng (Array) các đối tượng `BookingDto` phù hợp với tiêu chí lọc.
*   **Response Body (Lỗi - 401 Unauthorized / 403 Forbidden):** Nếu không có quyền.

---

## III. Tạo và Cập nhật Đặt phòng

### 1. Tạo Đặt phòng mới

*   **Method & URL:** `POST /api/bookings`
*   **Quyền yêu cầu:** **Bất kỳ người dùng nào đã đăng nhập** (Admin, Employee, Customer).
*   **Mô tả:** Tạo một yêu cầu đặt phòng mới. Trạng thái ban đầu thường là "pending". Backend sẽ kiểm tra phòng có sẵn không trong khoảng thời gian yêu cầu.
*   **Request Body:**
    ```json
    {
      "customerId": int,         // ID của khách hàng đặt phòng
      "roomId": int,             // ID của phòng muốn đặt (phải tồn tại)
      "checkInDate": "datetime", // Ngày giờ check-in (Bắt buộc)
      "checkOutDate": "datetime",// Ngày giờ check-out (Bắt buộc, phải sau checkInDate)
      "adults": int,             // Số người lớn (Bắt buộc, > 0)
      "children": int            // Số trẻ em (Bắt buộc, >= 0)
      // totalAmount, status, paymentStatus sẽ do backend tự tính toán/đặt mặc định
    }
    ```
*   **Response Body (Thành công - 201 Created):**
    *   Thông tin ID đặt phòng mới và thông báo thành công. Header `Location` trỏ đến URL của booking mới. Ví dụ:
        ```json
        {
          "bookingId": int,
          "message": "Tạo đặt phòng thành công"
        }
        ```
*   **Response Body (Lỗi - 400 Bad Request):** Nếu dữ liệu không hợp lệ (ngày không hợp lệ, phòng không tồn tại, phòng không có sẵn trong khoảng thời gian đó, số người không hợp lệ...).
*   **Response Body (Lỗi - 401 Unauthorized):** Nếu chưa đăng nhập.

### 2. Cập nhật thông tin Đặt phòng

*   **Method & URL:** `PUT /api/bookings/{id}`
*   **Quyền yêu cầu:** **Admin** hoặc **Employee**. (Customer không thể tự sửa booking qua API này).
*   **Mô tả:** Cập nhật các thông tin chung của đặt phòng.
*   **Tham số URL:**
    *   `{id}` (int): ID của đặt phòng cần cập nhật.
*   **Request Body:** (Gửi những trường cần cập nhật)
    ```json
    {
      "checkInDate": "datetime" (optional),
      "checkOutDate": "datetime" (optional), // Phải sau checkInDate nếu cập nhật cả 2
      "adults": int (optional),             // Nếu gửi, phải > 0
      "children": int (optional),           // Nếu gửi, phải >= 0
      "status": "string" (optional),        // Phải là giá trị hợp lệ ("confirmed", "cancelled"...)
      "paymentStatus": "string" (optional)  // Phải là giá trị hợp lệ ("paid", "pending"...)
      // Lưu ý: Cập nhật status ở đây có thể kích hoạt trigger thay đổi trạng thái phòng
      // Cập nhật CheckIn/Out cũng cần kiểm tra lại tính khả dụng của phòng
    }
    ```
*   **Response Body (Thành công - 200 OK / 204 No Content):**
    *   Thông báo thành công.
*   **Response Body (Lỗi - 400 Bad Request):** Nếu dữ liệu không hợp lệ (ngày sai, trạng thái không hợp lệ, phòng không còn trống nếu đổi ngày...).
*   **Response Body (Lỗi - 404 Not Found):** Nếu không tìm thấy đặt phòng với `id`.
*   **Response Body (Lỗi - 401 Unauthorized / 403 Forbidden):** Nếu không có quyền.

### 3. Xóa Đặt phòng

*   **Method & URL:** `DELETE /api/bookings/{id}`
*   **Quyền yêu cầu:** **Admin**. (Chỉ Admin có quyền xóa cứng booking).
*   **Mô tả:** Xóa hoàn toàn một đặt phòng khỏi hệ thống. **Thao tác nguy hiểm, cân nhắc kỹ**. Việc này cũng xóa các bản ghi liên quan trong `BookingHistory`, `BookingServices`, `Reviews`, `Invoices`... do cấu hình `ON DELETE CASCADE`.
*   **Tham số URL:**
    *   `{id}` (int): ID của đặt phòng cần xóa.
*   **Response Body (Thành công - 200 OK / 204 No Content):**
    *   Thông báo thành công.
*   **Response Body (Lỗi - 404 Not Found):** Nếu không tìm thấy đặt phòng với `id`.
*   **Response Body (Lỗi - 401 Unauthorized / 403 Forbidden):** Nếu không có quyền.

---

## IV. Quản lý Trạng thái và Nghiệp vụ

### 1. Check-in cho Đặt phòng

*   **Method & URL:** `PUT /api/bookings/{id}/check-in`
*   **Quyền yêu cầu:** **Admin** hoặc **Employee**.
*   **Mô tả:** Đánh dấu đặt phòng là đã check-in. Yêu cầu đặt phòng phải ở trạng thái "confirmed". **Trigger backend sẽ tự động cập nhật trạng thái Phòng (`Rooms.Status`) thành `occupied`**.
*   **Tham số URL:**
    *   `{id}` (int): ID của đặt phòng cần check-in.
*   **Request Body:** Không yêu cầu.
*   **Response Body (Thành công - 200 OK):**
    ```json
    {
      "message": "Check-in thành công"
    }
    ```
*   **Response Body (Lỗi - 400 Bad Request):** Nếu đặt phòng không ở trạng thái "confirmed" hoặc đã check-in/check-out/cancelled.
*   **Response Body (Lỗi - 404 Not Found):** Nếu không tìm thấy đặt phòng.
*   **Response Body (Lỗi - 401 Unauthorized / 403 Forbidden):** Nếu không có quyền.

### 2. Check-out cho Đặt phòng

*   **Method & URL:** `PUT /api/bookings/{id}/check-out`
*   **Quyền yêu cầu:** **Admin** hoặc **Employee**.
*   **Mô tả:** Đánh dấu đặt phòng là đã check-out. Yêu cầu đặt phòng phải ở trạng thái "checked_in". **Trigger backend sẽ tự động cập nhật trạng thái Phòng (`Rooms.Status`) thành `cleaning`**.
*   **Tham số URL:**
    *   `{id}` (int): ID của đặt phòng cần check-out.
*   **Request Body:** Không yêu cầu.
*   **Response Body (Thành công - 200 OK):**
    ```json
    {
      "message": "Check-out thành công"
    }
    ```
*   **Response Body (Lỗi - 400 Bad Request):** Nếu đặt phòng không ở trạng thái "checked_in" hoặc đã check-out/cancelled.
*   **Response Body (Lỗi - 404 Not Found):** Nếu không tìm thấy đặt phòng.
*   **Response Body (Lỗi - 401 Unauthorized / 403 Forbidden):** Nếu không có quyền.

### 3. Cập nhật Trạng thái Thanh toán

*   **Method & URL:** `PUT /api/bookings/{id}/payment`
*   **Quyền yêu cầu:** **Admin** hoặc **Employee**.
*   **Mô tả:** Cập nhật trạng thái thanh toán cho đặt phòng.
*   **Tham số URL:**
    *   `{id}` (int): ID của đặt phòng.
*   **Request Body:**
    ```json
    {
      // Có thể chỉ cần gửi trạng thái mới, hoặc chi tiết hơn tùy implementation
      "paymentStatus": "string" // Giá trị hợp lệ: "pending", "partial", "paid", "refunded", "failed"
      // Có thể cần thêm thông tin: paymentMethod, amountPaid, transactionId... (Cần kiểm tra Request DTO)
    }
    ```
    *   *Kiểm tra lại Request DTO (`UpdatePaymentRequest`):* Hiện tại chỉ có `PaymentStatus` và `PaymentMethod` (string, optional).
*   **Response Body (Thành công - 200 OK):**
    ```json
    {
      "message": "Cập nhật thanh toán thành công"
    }
    ```
*   **Response Body (Lỗi - 400 Bad Request):** Nếu `paymentStatus` không hợp lệ.
*   **Response Body (Lỗi - 404 Not Found):** Nếu không tìm thấy đặt phòng.
*   **Response Body (Lỗi - 401 Unauthorized / 403 Forbidden):** Nếu không có quyền.

### 4. Xử lý Thanh toán (Ví dụ: qua cổng thanh toán)

*   **Method & URL:** `POST /api/bookings/{id}/payment/process`
*   **Quyền yêu cầu:** **Bất kỳ người dùng nào đã đăng nhập** (Admin, Employee, Customer). (Thường là Customer tự thanh toán).
*   **Mô tả:** Gửi yêu cầu xử lý thanh toán cho đặt phòng (có thể tích hợp với cổng thanh toán bên ngoài). Logic cụ thể phụ thuộc vào implementation backend (`ProcessPayment` method).
*   **Tham số URL:**
    *   `{id}` (int): ID của đặt phòng cần thanh toán.
*   **Request Body:** (Phụ thuộc vào cổng thanh toán và implementation)
    ```json
    {
      "paymentMethod": "string", // Ví dụ: "CreditCard", "PayPal", "VNPay"
      "paymentToken": "string",  // Token hoặc thông tin thẻ từ frontend/cổng TT
      "amount": decimal         // Số tiền thanh toán (có thể backend tự lấy hoặc FE gửi)
      // ... các trường khác tùy cổng thanh toán
    }
    ```
    *   *Kiểm tra lại Request DTO (`ProcessPaymentRequest`):* Hiện tại chỉ có `PaymentMethod` và `PaymentToken`. Backend sẽ tự lấy `TotalAmount` từ booking.
*   **Response Body (Thành công - 200 OK):**
    ```json
    {
      "message": "Thanh toán thành công", // Hoặc "Yêu cầu thanh toán đang xử lý"
      "transactionId": "string" // (Optional) Mã giao dịch nếu có
      // Backend cũng sẽ cập nhật Booking.PaymentStatus
    }
    ```
*   **Response Body (Lỗi - 400 Bad Request):** Nếu thông tin thanh toán không hợp lệ, số tiền không đúng, booking đã thanh toán hoặc không hợp lệ.
*   **Response Body (Lỗi - 404 Not Found):** Nếu không tìm thấy đặt phòng.
*   **Response Body (Lỗi - 401 Unauthorized):** Nếu chưa đăng nhập.
*   **Response Body (Lỗi - 500 Internal Server Error):** Nếu có lỗi khi giao tiếp với cổng thanh toán hoặc cập nhật DB.

---

## V. Quản lý Dịch vụ trong Đặt phòng

### 1. Lấy danh sách Dịch vụ của Đặt phòng

*   **Method & URL:** `GET /api/bookings/{id}/services`
*   **Quyền yêu cầu:** **Bất kỳ người dùng nào đã đăng nhập** (Admin, Employee, Customer - Backend kiểm tra quyền sở hữu cho Customer).
*   **Mô tả:** Lấy danh sách các dịch vụ đã được thêm vào một đặt phòng cụ thể.
*   **Tham số URL:**
    *   `{id}` (int): ID của đặt phòng.
*   **Response Body (Thành công - 200 OK):**
    *   **Kiểu:** Mảng (Array) các đối tượng dịch vụ đã sử dụng (Cấu trúc tương tự phần `services` trong `BookingDto`).
        ```json
        [
          {
            "serviceId": int,
            "bookingServiceId": int,
            "name": "string",
            "quantity": int,
            "price": decimal,
            "serviceDate": "datetime"
          }
        ]
        ```
*   **Response Body (Lỗi - 404 Not Found):** Nếu không tìm thấy đặt phòng.
*   **Response Body (Lỗi - 401 Unauthorized / 403 Forbidden):** Nếu không có quyền xem (Customer xem booking người khác).

### 2. Thêm Dịch vụ vào Đặt phòng

*   **Method & URL:** `POST /api/bookings/{id}/services`
*   **Quyền yêu cầu:** **Admin** hoặc **Employee**. (Customer không thể tự thêm dịch vụ qua API này).
*   **Mô tả:** Thêm một dịch vụ (đã tồn tại trong bảng `Services`) vào đặt phòng. **Trigger backend sẽ tự động cộng giá trị dịch vụ vào `Bookings.TotalAmount`**.
*   **Tham số URL:**
    *   `{id}` (int): ID của đặt phòng.
*   **Request Body:**
    ```json
    {
      "serviceId": int, // ID của dịch vụ gốc cần thêm (phải tồn tại và isAvailable=true)
      "quantity": int  // Số lượng (Bắt buộc, > 0)
    }
    ```
*   **Response Body (Thành công - 200 OK / 201 Created):**
    *   Thông tin chi tiết về `BookingService` vừa được tạo. Ví dụ:
        ```json
        {
          "bookingServiceId": int,
          "bookingId": int,
          "serviceId": int,
          "serviceName": "string",
          "quantity": int,
          "price": decimal, // Giá được lấy từ bảng Services tại thời điểm thêm
          "serviceDate": "datetime",
          "message": "Thêm dịch vụ thành công"
        }
        ```
*   **Response Body (Lỗi - 400 Bad Request):** Nếu `serviceId` không tồn tại, không available, số lượng không hợp lệ, hoặc đặt phòng không ở trạng thái phù hợp để thêm dịch vụ.
*   **Response Body (Lỗi - 404 Not Found):** Nếu không tìm thấy đặt phòng.
*   **Response Body (Lỗi - 401 Unauthorized / 403 Forbidden):** Nếu không có quyền.

### 3. Xóa Dịch vụ khỏi Đặt phòng

*   **Method & URL:** `DELETE /api/bookings/{id}/services/{bookingServiceId}`
*   **Quyền yêu cầu:** **Admin** hoặc **Employee**.
*   **Mô tả:** Xóa một dịch vụ đã được thêm vào đặt phòng (xóa bản ghi trong `BookingServices`). **Trigger backend sẽ tự động trừ giá trị dịch vụ khỏi `Bookings.TotalAmount`**.
*   **Tham số URL:**
    *   `{id}` (int): ID của đặt phòng.
    *   `{bookingServiceId}` (int): ID của bản ghi trong `BookingServices` cần xóa (KHÔNG phải ID của dịch vụ gốc).
*   **Request Body:** Không yêu cầu.
*   **Response Body (Thành công - 200 OK / 204 No Content):**
    ```json
    {
      "message": "Xóa dịch vụ thành công"
    }
    ```
*   **Response Body (Lỗi - 404 Not Found):** Nếu không tìm thấy đặt phòng hoặc `bookingServiceId` không tồn tại hoặc không thuộc đặt phòng đó.
*   **Response Body (Lỗi - 401 Unauthorized / 403 Forbidden):** Nếu không có quyền.

---

Chào đội ngũ Frontend,

Chúng tôi đã xem xét kỹ các thắc mắc của các bạn liên quan đến việc tích hợp API quản lý Đặt phòng (`Bookings`) và xin cung cấp câu trả lời chính xác dựa trên mã nguồn backend hiện tại:

**1. Tham số Lọc Ngày (`GET /api/bookings/filter`)**

*   **Thắc mắc FE:** Backend cần tham số `fromDate`/`toDate` hay `start_date`/`end_date`?
*   **Trả lời Chính xác:** Backend **mong đợi `fromDate` và `toDate`**.
*   **Giải thích:** Chữ ký phương thức `FilterBookings` trong `BookingsController.cs` sử dụng `[FromQuery] DateTime? fromDate` và `[FromQuery] DateTime? toDate`. Tên tham số trong code C# là tên mà backend tìm kiếm trong query string URL.
*   **Hành động cần thiết (FE):** Vui lòng **sửa lại** hàm `filterBookings` trong `bookingService.js` để gửi tham số query string với tên là `fromDate` và `toDate`.

**2. Request Body khi Tạo Booking (`POST /api/bookings`)**

*   **Thắc mắc FE:**
    *   Cấu trúc body chính xác là gì? (`customerId` vs `customer_details`, `adults`/`children` vs `guests`, `paymentMethod`?)
    *   Làm sao FE lấy được `customerId`?
*   **Trả lời Chính xác:** Request body chính xác **phải chứa**: `customerId` (int), `roomId` (int), `checkInDate` (datetime), `checkOutDate` (datetime), `adults` (int), và `children` (int).
*   **Giải thích:**
    *   Backend (`CreateBooking` method) nhận DTO `CreateBookingRequest` và truy cập các thuộc tính `.CustomerId`, `.RoomId`, `.CheckInDate`, `.CheckOutDate`, `.Adults`, `.Children`. Nó **không** xử lý object `customer_details` hay trường `guests` gộp.
    *   Trường `paymentMethod` **không** cần thiết và không được xử lý khi tạo booking mới (trạng thái thanh toán mặc định là "pending").
*   **Hành động cần thiết (FE):**
    *   **Sửa lại** hàm `createBooking` trong `bookingService.js` để gửi đúng cấu trúc JSON body: `{ "customerId": ..., "roomId": ..., "checkInDate": ..., "checkOutDate": ..., "adults": ..., "children": ... }`.
    *   **Lấy `customerId`:** Đây là điểm cần làm rõ thêm. FE cần có `customerId` để gửi đi.
        *   **Trường hợp Khách hàng tự đặt:** Kiểm tra xem API lấy thông tin người dùng đang đăng nhập (ví dụ: `GET /api/auth/me`) có trả về `customerId` liên kết không. Nếu không, cần yêu cầu backend bổ sung.
        *   **Trường hợp Nhân viên đặt hộ:** Cần có API để tìm kiếm/lấy danh sách khách hàng (`Customers`) và ID của họ. Hiện tại chưa thấy `CustomersController`. Nếu chưa có, cần yêu cầu backend bổ sung API này.

**3. Request Body khi Cập nhật Trạng thái Thanh toán (`PUT /api/bookings/{id}/payment`)**

*   **Thắc mắc FE:** Backend cần body là chuỗi trạng thái đơn giản hay object JSON?
*   **Trả lời Chính xác:** Backend **mong đợi một object JSON**.
*   **Giải thích:** Phương thức `UpdatePayment` trong `BookingsController.cs` nhận tham số `[FromBody] UpdatePaymentRequest request`. Thuộc tính `[FromBody]` yêu cầu dữ liệu được gửi dưới dạng JSON trong body request để có thể deserialize thành đối tượng `UpdatePaymentRequest` (chứa các trường như `PaymentStatus`, `PaymentMethod`). Gửi chuỗi đơn giản sẽ gây lỗi.
*   **Hành động cần thiết (FE):** Vui lòng **sửa lại** hàm `updatePaymentStatus` trong `bookingService.js` để gửi một object JSON trong body. Ví dụ: `body: JSON.stringify({ paymentStatus: "paid", paymentMethod: "OptionalPaymentMethod" })`.

**4. Tham số khi Xóa Dịch vụ (`DELETE /api/bookings/{id}/services/{...}`)**

*   **Thắc mắc FE:** Có đúng là cần gửi `bookingServiceId` thay vì `serviceId` không?
*   **Trả lời Chính xác:** **Đúng**. Backend **yêu cầu `bookingServiceId`** trong URL.
*   **Giải thích:**
    *   Định nghĩa route của API là `[HttpDelete("{id}/services/{bookingServiceId}")]`.
    *   Phương thức backend `RemoveBookingService` nhận tham số `int bookingServiceId`.
    *   Logic backend sử dụng `bookingServiceId` này để xóa bản ghi **cụ thể** trong bảng `BookingServices` (bảng liên kết). `bookingServiceId` là ID của *lần sử dụng dịch vụ đó trong booking này*, không phải ID của dịch vụ gốc (`serviceId`).
    *   FE có thể lấy `bookingServiceId` từ response khi thêm dịch vụ (`POST /api/bookings/{id}/services`) hoặc từ danh sách dịch vụ khi lấy chi tiết đặt phòng (`GET /api/bookings/{id}` - xem trường `bookingServiceId` trong mảng `services`).
*   **Hành động cần thiết (FE):** Vui lòng **sửa lại** hàm `removeServiceFromBooking` trong `bookingService.js` để:
    *   Nhận vào `bookingServiceId`.
    *   Xây dựng URL đúng, đặt `bookingServiceId` vào vị trí cuối cùng.
    *   Đảm bảo FE có và sử dụng đúng giá trị `bookingServiceId` khi gọi hàm này.

---

Hy vọng những giải thích này giúp các bạn làm rõ các điểm còn vướng mắc. Vui lòng thực hiện các điều chỉnh cần thiết ở phía frontend.

Đặc biệt lưu ý điểm **lấy `customerId`** khi tạo booking, chúng ta cần phối hợp để đảm bảo FE có cách lấy được thông tin này một cách hợp lý.

Để đảm bảo việc tạo và cập nhật thông tin Đặt phòng (`Bookings`) diễn ra chính xác và dữ liệu được lưu trữ đúng cách vào cơ sở dữ liệu, vui lòng tuân thủ các yêu cầu về tham số và cấu trúc dữ liệu dưới đây khi gọi các API liên quan.

---

## 1. Tạo Đặt phòng mới (`POST /api/bookings`)

API này dùng để tạo một yêu cầu đặt phòng mới. Backend cần các thông tin sau trong **Request Body (JSON)** để tạo bản ghi `Bookings`:

```json
{
  "customerId": 123, // Kiểu: int. BẮT BUỘC.
                     // Yêu cầu: Phải là ID hợp lệ của một khách hàng (Customers.Id) đã tồn tại.
                     // Lưu ý: FE cần có cách lấy ID này (từ user đang login hoặc từ chức năng chọn/tìm kiếm khách hàng).

  "roomId": 45,     // Kiểu: int. BẮT BUỘC.
                     // Yêu cầu: Phải là ID hợp lệ của một phòng (Rooms.Id) đã tồn tại.
                     // Backend sẽ kiểm tra phòng này có trạng thái 'available' và không bị trùng lịch đặt trong khoảng thời gian check-in/check-out.

  "checkInDate": "2024-08-15T14:00:00Z", // Kiểu: string (định dạng ISO 8601 datetime, ví dụ: YYYY-MM-DDTHH:mm:ssZ). BẮT BUỘC.

  "checkOutDate": "2024-08-18T12:00:00Z", // Kiểu: string (định dạng ISO 8601 datetime). BẮT BUỘC.
                     // Yêu cầu: Phải lớn hơn (sau) `checkInDate`.

  "adults": 2,       // Kiểu: int. BẮT BUỘC.
                     // Yêu cầu: Phải lớn hơn 0.

  "children": 1      // Kiểu: int. BẮT BUỘC.
                     // Yêu cầu: Phải lớn hơn hoặc bằng 0.
}
```

**Backend sẽ tự động xử lý:**

*   Tính `TotalAmount` ban đầu (dựa trên giá loại phòng và số đêm).
*   Đặt `Status` = `"pending"`.
*   Đặt `PaymentStatus` = `"pending"`.
*   Ghi nhận `CreatedAt` = Thời điểm hiện tại.
*   Tạo bản ghi lịch sử (`BookingHistory`) ban đầu.

---

## 2. Cập nhật thông tin Đặt phòng (`PUT /api/bookings/{id}`)

API này dùng để cập nhật các thông tin của một đặt phòng đã tồn tại.

**Tham số URL:**

*   `{id}`: Kiểu `int`. BẮT BUỘC. ID của đặt phòng cần cập nhật.

**Request Body (JSON):** Gửi một object chứa **chỉ những trường cần cập nhật**. Các trường không được gửi sẽ không bị thay đổi.

```json
{
  "checkInDate": "2024-08-16T14:00:00Z" (optional), // Kiểu: string (ISO 8601).
                                                 // Nếu gửi, backend sẽ kiểm tra lại tính khả dụng của phòng.
  "checkOutDate": "2024-08-19T12:00:00Z" (optional), // Kiểu: string (ISO 8601).
                                                  // Yêu cầu: Phải lớn hơn checkInDate (cũ hoặc mới). Backend kiểm tra lại tính khả dụng.
  "adults": 3 (optional),                         // Kiểu: int. Yêu cầu: > 0.
  "children": 0 (optional),                       // Kiểu: int. Yêu cầu: >= 0.
  "status": "confirmed" (optional),             // Kiểu: string.
                                                 // Yêu cầu: Phải là một trong các giá trị hợp lệ: "pending", "confirmed", "checked_in", "checked_out", "cancelled", "no_show".
                                                 // Lưu ý: Thay đổi status có thể kích hoạt trigger cập nhật trạng thái phòng (ví dụ: checked_in -> phòng occupied, checked_out -> phòng cleaning).
  "paymentStatus": "paid" (optional)              // Kiểu: string.
                                                 // Yêu cầu: Phải là một trong các giá trị hợp lệ: "pending", "partial", "paid", "refunded", "failed".
}
```

**Lưu ý:** Backend sẽ kiểm tra tính hợp lệ của dữ liệu đầu vào (ví dụ: trạng thái hợp lệ, ngày hợp lệ, phòng còn trống nếu đổi ngày...).

---

## 3. Cập nhật Trạng thái Thanh toán (`PUT /api/bookings/{id}/payment`)

API này chuyên dùng để cập nhật trạng thái thanh toán.

**Tham số URL:**

*   `{id}`: Kiểu `int`. BẮT BUỘC. ID của đặt phòng.

**Request Body (JSON):** BẮT BUỘC gửi một object JSON.

```json
{
  "paymentStatus": "paid", // Kiểu: string. BẮT BUỘC.
                         // Yêu cầu: Phải là một trong các giá trị hợp lệ: "pending", "partial", "paid", "refunded", "failed".
  "paymentMethod": "CreditCard" (optional) // Kiểu: string. Tùy chọn. Phương thức thanh toán.
}
```

---

## 4. Thêm Dịch vụ vào Đặt phòng (`POST /api/bookings/{id}/services`)

API này dùng để ghi nhận một dịch vụ đã được sử dụng/thêm vào đặt phòng.

**Tham số URL:**

*   `{id}`: Kiểu `int`. BẮT BUỘC. ID của đặt phòng.

**Request Body (JSON):**

```json
{
  "serviceId": 25, // Kiểu: int. BẮT BUỘC.
                   // Yêu cầu: Phải là ID hợp lệ của một dịch vụ (Services.Id) đã tồn tại và có IsAvailable = true.
  "quantity": 2    // Kiểu: int. BẮT BUỘC.
                   // Yêu cầu: Phải lớn hơn 0.
}
```

**Backend sẽ tự động xử lý:**

*   Lấy giá (`Price`) của `serviceId` tại thời điểm hiện tại từ bảng `Services`.
*   Tạo một bản ghi mới trong `BookingServices` với `BookingId`, `ServiceId`, `Quantity`, `Price` đã lấy và `ServiceDate` hiện tại.
*   **Trigger cơ sở dữ liệu sẽ tự động cộng `(Price * Quantity)` vào `Bookings.TotalAmount`**.

---

**Tóm tắt:**

Việc gửi đúng **kiểu dữ liệu**, **định dạng** (đặc biệt là ngày tháng ISO 8601), **giá trị hợp lệ** (đúng ID tồn tại, đúng trạng thái cho phép), và **đầy đủ các trường bắt buộc** là rất quan trọng để backend xử lý thành công và lưu dữ liệu chính xác vào cơ sở dữ liệu. Vui lòng kiểm tra kỹ các yêu cầu trên khi thực hiện gọi API.

Liên hệ lại nếu có bất kỳ điểm nào cần làm rõ thêm.. 