# Quick Start Guide - Tính Năng Tối Ưu Hóa Lịch Trình

## Bước 1: Chạy Backend

```bash
cd backend
./mvnw spring-boot:run
```

Hoặc trong IDE, chạy `RailwayApplication.java`

Kiểm tra backend đã chạy: http://localhost:8080/api/duong-ray

## Bước 2: Chạy SQL Script Tạo Dữ Liệu Test

Mở SQL Server Management Studio hoặc Azure Data Studio:

```sql
-- File: backend/src/main/resources/test-data-chuyen-tau-1-thang.sql
-- Chạy toàn bộ file này để tạo 250 chuyến tàu trong 1 tháng
```

Hoặc dùng command line:
```bash
sqlcmd -S localhost -d railway_danang -i backend/src/main/resources/test-data-chuyen-tau-1-thang.sql
```

## Bước 3: Kiểm Tra Dữ Liệu

```sql
-- Kiểm tra số lượng chuyến tàu
SELECT COUNT(*) FROM CHUYEN_TAU WHERE ngay_chay >= '2026-04-21';

-- Xem chuyến tàu ngày hôm nay
SELECT * FROM CHUYEN_TAU WHERE ngay_chay = '2026-04-22';
```

## Bước 4: Chạy Frontend

```bash
cd frontend
npm run dev
```

## Bước 5: Test Tính Năng

1. Đăng nhập với tài khoản điều hành:
   - Username: `tuan.dh@dsvn.vn`
   - Password: `123456`

2. Vào menu: **Điều hành** → **Mô phỏng**

3. Chọn ngày (ví dụ: 22/04/2026)

4. Bấm **"Chạy Tối Ưu Hóa Tự Động"**

5. Xem kết quả và bấm **"Áp dụng"**

## Troubleshooting

### Lỗi: Network Error

**Nguyên nhân**: Backend chưa chạy hoặc CORS issue

**Giải pháp**:
1. Kiểm tra backend: http://localhost:8080/api/duong-ray
2. Kiểm tra CORS trong `WebConfig.java`:
```java
@Override
public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:5173")
            .allowedMethods("*");
}
```

### Lỗi: Không có chuyến tàu

**Nguyên nhân**: Chưa chạy SQL script hoặc chọn ngày không có dữ liệu

**Giải pháp**:
1. Chạy `test-data-chuyen-tau-1-thang.sql`
2. Chọn ngày từ 21/04/2026 đến 20/05/2026

### Lỗi: 401 Unauthorized

**Nguyên nhân**: Token hết hạn hoặc chưa đăng nhập

**Giải pháp**:
1. Đăng xuất và đăng nhập lại
2. Clear localStorage: `localStorage.clear()`

## API Endpoints

```
GET  /api/chuyen-tau?ngay=2026-04-22  - Lấy chuyến tàu theo ngày
GET  /api/duong-ray                   - Lấy danh sách ray
POST /api/lich-trinh                  - Tạo lịch trình mới
```

## Dữ Liệu Test

File SQL tạo:
- 180 chuyến tàu hàng ngày (SE1-SE6)
- 30 chuyến tàu chẵn/lẻ (TN1-TN4)
- 34 chuyến tàu cuối tuần (SE7-SE8, DL1-DL2)
- 6 chuyến tàu đặc biệt (ngày lễ)

**Tổng**: ~250 chuyến tàu

## Kiểm Tra Nhanh

```bash
# Backend health check
curl http://localhost:8080/api/duong-ray

# Lấy chuyến tàu ngày 22/04/2026
curl http://localhost:8080/api/chuyen-tau?ngay=2026-04-22

# Đếm số chuyến tàu
curl http://localhost:8080/api/chuyen-tau | jq '.data | length'
```

## Video Demo

1. Chọn ngày → Hiển thị số chuyến tàu
2. Bấm "Chạy Tối Ưu Hóa" → Xem kết quả
3. Kiểm tra điểm tối ưu, warnings, failures
4. Bấm "Áp dụng" → Tự động tạo lịch trình
5. Chuyển sang trang Lịch Trình → Xem kết quả

## Liên Hệ

Nếu gặp vấn đề, kiểm tra:
1. Console log (F12)
2. Network tab (F12)
3. Backend logs
4. Database connection
