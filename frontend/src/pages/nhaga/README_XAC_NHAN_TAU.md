# UC-10: Xác Nhận Tàu

## Tổng quan
Chức năng cho phép Nhân viên Nhà ga xác nhận trạng thái thực tế của tàu tại sân ga (Tàu vào ga hoặc Tàu xuất phát) để đồng bộ với trung tâm điều hành.

## Actors
- Nhân viên Nhà ga

## Luồng chính (Basic Flow)

### 1. Xem danh sách tàu chờ xác nhận
- Hệ thống hiển thị 2 bảng:
  - **Tàu chờ vào ga**: Các tàu có trạng thái `CHO_XAC_NHAN` hoặc `DA_XAC_NHAN`
  - **Tàu đang đỗ**: Các tàu có trạng thái `DUNG_TAI_GA`

### 2. Xác nhận tàu vào ga
1. Nhân viên chọn "Xác nhận vào ga" cho chuyến tàu
2. Modal hiển thị thông tin:
   - Mã lịch trình
   - Đường ray
   - Giờ đến dự kiến
   - Thời gian hiện tại
3. Nhân viên tích checkbox: "Đã kiểm tra đường đón tàu thông thoáng và các bộ ghi đã khóa an toàn"
4. (Tùy chọn) Nhập ghi chú vận hành
5. Nhấn "Xác nhận vào ga"
6. Hệ thống:
   - Lưu `gio_den_thuc_te` = thời gian hiện tại
   - Tính `so_phut_tre` = giờ đến thực tế - giờ đến dự kiến
   - Cập nhật `trang_thai` = `DUNG_TAI_GA`
   - Lưu ghi chú (nếu có)

### 3. Xác nhận tàu xuất phát
1. Nhân viên chọn "Xuất phát" cho tàu đang đỗ
2. Modal hiển thị tương tự
3. Nhân viên tích checkbox an toàn (đường gửi tàu)
4. Nhấn "Xác nhận xuất phát"
5. Hệ thống:
   - Lưu `gio_di_thuc_te` = thời gian hiện tại
   - Cập nhật `trang_thai` = `DA_ROI_GA`
   - Tính số phút trễ (nếu chưa có)

## Luồng ngoại lệ (Exception Flow)

### 1. Ngưỡng 10 phút - Mất liên lạc
- Nếu tàu quá 10 phút so với giờ dự kiến mà chưa xác nhận
- Hệ thống tự động:
  - Tạo sự cố `MAT_LIEN_LAC` trong bảng `SU_CO`
  - Mức độ: `KHAN_CAP`
  - Hiển thị cảnh báo đỏ trên dashboard
  - Thông báo đến Nhân viên Điều hành

### 2. Chưa xác nhận an toàn
- Nếu checkbox an toàn chưa được tích
- Nút "Xác nhận" bị vô hiệu hóa (disabled)
- Hiển thị tooltip: "Vui lòng xác nhận đã kiểm tra an toàn kỹ thuật"

### 3. Xác nhận nhầm
- Nhân viên có thể nhấn nút "Hủy xác nhận" (↩️)
- Hệ thống:
  - Reset `trang_thai` về `CHO_XAC_NHAN`
  - Xóa `gio_den_thuc_te`, `gio_di_thuc_te`
  - Reset `so_phut_tre` = 0
- Cho phép xác nhận lại

## Luồng thay thế (Alternative Flow)

### Thêm ghi chú vận hành
- Trước khi xác nhận, nhân viên có thể nhập ghi chú
- Ví dụ:
  - "Hành khách đông, cần thêm thời gian lên xuống"
  - "Phát hiện tiếng động bất thường ở toa 3"
  - "Thời tiết mưa, đường ray trơn"
- Ghi chú được lưu vào trường `ghi_chu` của `LICH_TRINH`

## Tính năng đặc biệt

### 1. Auto-refresh
- Trang tự động làm mới mỗi 30 giây
- Đảm bảo dữ liệu luôn cập nhật

### 2. Visual indicators
- **Tàu quá hạn**: Background đỏ, border đỏ
- **Tàu đang đỗ**: Background xanh lá, border xanh
- **Badge độ lệch**: 
  - Đỏ: Trễ >= 10 phút
  - Cam: Trễ < 10 phút
  - Xanh: Sớm
  - Xanh lá: Đúng giờ

### 3. Thống kê real-time
- Số tàu chờ vào ga
- Số tàu đang đỗ
- Số tàu quá hạn

## API Endpoints

### Backend
```java
GET  /api/xac-nhan-tau/cho-xac-nhan
POST /api/xac-nhan-tau/xac-nhan
POST /api/xac-nhan-tau/huy-xac-nhan/{maLichTrinh}
GET  /api/xac-nhan-tau/kiem-tra-qua-han
```

### Frontend
```javascript
xacNhanTauAPI.getDanhSachChoXacNhan()
xacNhanTauAPI.xacNhan(data)
xacNhanTauAPI.huyXacNhan(maLichTrinh)
xacNhanTauAPI.kiemTraQuaHan()
```

## Database Changes

### Thêm cột mới
```sql
ALTER TABLE LICH_TRINH
ADD ghi_chu NVARCHAR(500) NULL;
```

### Index mới
```sql
CREATE INDEX IX_LICH_TRINH_TRANG_THAI 
ON LICH_TRINH(trang_thai);
```

## Quy trình an toàn (QCVN 08:2018/BGTVT)

### Đón tàu
- Kiểm tra đường đón tàu thông thoáng
- Các bộ ghi đã khóa an toàn
- Tín hiệu đèn xanh
- Không có chướng ngại vật

### Gửi tàu
- Kiểm tra đường gửi tàu thông thoáng
- Các bộ ghi đã khóa an toàn
- Tín hiệu đèn xanh
- Hành khách đã lên tàu đầy đủ

## Testing

### Test case 1: Xác nhận tàu đúng giờ
1. Tàu đến đúng giờ dự kiến
2. Xác nhận vào ga
3. Kết quả: `so_phut_tre` = 0

### Test case 2: Xác nhận tàu trễ 5 phút
1. Tàu đến trễ 5 phút
2. Xác nhận vào ga
3. Kết quả: `so_phut_tre` = 5, hiển thị warning

### Test case 3: Tàu quá hạn 10 phút
1. Tàu quá 10 phút chưa xác nhận
2. Hệ thống tự động tạo sự cố `MAT_LIEN_LAC`
3. Hiển thị cảnh báo đỏ

### Test case 4: Xác nhận nhầm
1. Xác nhận tàu vào ga
2. Nhấn "Hủy xác nhận"
3. Kết quả: Trạng thái reset về `CHO_XAC_NHAN`

### Test case 5: Chưa tích checkbox an toàn
1. Mở modal xác nhận
2. Không tích checkbox
3. Kết quả: Nút "Xác nhận" bị disabled

## Files liên quan

### Backend
- `XacNhanTauController.java`
- `XacNhanTauService.java`
- `XacNhanTauRequest.java`
- `LichTrinhRepository.java` (thêm queries)
- `SuCoRepository.java` (thêm method)
- `LichTrinh.java` (thêm field `ghiChu`)

### Frontend
- `XacNhanTauPage.jsx`
- `api.js` (thêm `xacNhanTauAPI`)
- `App.jsx` (thêm route)
- `AppLayout.jsx` (thêm menu item)

### Database
- `migration_add_ghi_chu_to_lich_trinh.sql`

## Lợi ích
1. **Tự động hóa**: Tính toán số phút trễ tự động
2. **An toàn**: Bắt buộc xác nhận kiểm tra an toàn
3. **Phát hiện sớm**: Cảnh báo tàu quá hạn 10 phút
4. **Truy vết**: Lưu ghi chú vận hành cho mỗi lần xác nhận
5. **Real-time**: Cập nhật trạng thái ngay lập tức
