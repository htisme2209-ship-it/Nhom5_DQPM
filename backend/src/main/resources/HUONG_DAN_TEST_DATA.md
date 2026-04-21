# Hướng Dẫn Sử Dụng Dữ Liệu Test

## File SQL: test-data-chuyen-tau-1-thang.sql

### Tổng quan
File này tạo dữ liệu chuyến tàu cho **1 tháng** (từ 21/04/2026 đến 20/05/2026) để test các tính năng:
- Tạo lịch trình
- Validation 24 giờ
- Mô phỏng lịch trình
- Xung đột ray và thời gian

---

## Cách Chạy

### SQL Server Management Studio (SSMS)
```sql
-- 1. Mở file test-data-chuyen-tau-1-thang.sql
-- 2. Chọn database railway_danang
-- 3. Nhấn F5 hoặc Execute
```

### Command Line
```bash
sqlcmd -S localhost -d railway_danang -i test-data-chuyen-tau-1-thang.sql
```

### Spring Boot Application
```bash
# File sẽ tự động chạy nếu đặt trong resources/
# Hoặc chạy thủ công qua SQL client
```

---

## Dữ Liệu Được Tạo

### 1. Chuyến Tàu Hàng Ngày (30 ngày × 6 tàu = 180 chuyến)

| Mã tàu | Loại | Giờ đến | Giờ đi | Vai trò |
|--------|------|---------|--------|---------|
| SE1 | HN→SG | 08:30 | 08:45 | Trung gian |
| SE2 | SG→HN | 14:20 | 14:35 | Trung gian |
| SE3 | HN→SG | 19:00 | 19:15 | Trung gian |
| SE4 | SG→HN | 22:30 | 22:45 | Trung gian |
| SE5 | HN→DN | 06:00 | 06:15 | Điểm cuối |
| SE6 | DN→HN | 20:00 | 20:30 | Xuất phát |

**Tổng**: 180 chuyến

---

### 2. Chuyến Tàu Chẵn/Lẻ (15 ngày × 2 tàu = 30 chuyến)

#### Ngày Chẵn (22, 24, 26, 28, 30/4 và 2, 4, 6, 8, 10, 12, 14, 16, 18, 20/5)
| Mã tàu | Loại | Giờ đến | Giờ đi | Vai trò |
|--------|------|---------|--------|---------|
| TN1 | HUE→DN | 10:30 | 10:45 | Điểm cuối |
| TN2 | DN→NTR | 15:30 | 16:00 | Xuất phát |

#### Ngày Lẻ (21, 23, 25, 27, 29/4 và 1, 3, 5, 7, 9, 11, 13, 15, 17, 19/5)
| Mã tàu | Loại | Giờ đến | Giờ đi | Vai trò |
|--------|------|---------|--------|---------|
| TN3 | NTR→DN | 11:00 | 11:15 | Điểm cuối |
| TN4 | DN→HUE | 16:30 | 17:00 | Xuất phát |

**Tổng**: ~30 chuyến

---

### 3. Chuyến Tàu Cuối Tuần (8-9 ngày × 4 tàu = 32-36 chuyến)

**Chỉ chạy Thứ 7 và Chủ nhật**

| Mã tàu | Loại | Giờ đến | Giờ đi | Vai trò |
|--------|------|---------|--------|---------|
| SE7 | HN→SG | 05:00 | 05:15 | Trung gian |
| SE8 | SG→HN | 23:00 | 23:15 | Trung gian |
| DL1 | DN→HA | 09:00 | 09:30 | Xuất phát (Du lịch) |
| DL2 | HA→DN | 17:30 | 17:45 | Điểm cuối (Du lịch) |

**Tổng**: ~34 chuyến

---

### 4. Chuyến Tàu Đặc Biệt (Ngày lễ)

#### 30/04/2026
- SE13: HN→SG (12:00-12:15)
- SE14: SG→HN (16:00-16:15)

#### 01/05/2026 (Lễ 30/4 - 01/05)
- SE9: HN→SG (07:00-07:15)
- SE10: SG→HN (13:00-13:15)
- SE11: HN→DN (18:00-18:15)
- SE12: DN→SG (21:00-21:30)

**Tổng**: 6 chuyến

---

## Tổng Kết

### Số Lượng Chuyến Tàu
```
Hàng ngày:     180 chuyến
Chẵn/Lẻ:        30 chuyến
Cuối tuần:      34 chuyến
Đặc biệt:        6 chuyến
─────────────────────────
TỔNG CỘNG:     250 chuyến
```

### Phân Bố Theo Vai Trò
```
TRUNG_GIAN:    ~140 chuyến (56%)
XUAT_PHAT:     ~55 chuyến (22%)
DIEM_CUOI:     ~55 chuyến (22%)
```

### Phân Bố Theo Thời Gian
```
Sáng sớm (05:00-08:00):   ~40 chuyến
Buổi sáng (08:00-12:00):  ~70 chuyến
Buổi chiều (12:00-18:00): ~80 chuyến
Buổi tối (18:00-00:00):   ~60 chuyến
```

---

## Kịch Bản Test

### 1. Test Validation 24 Giờ

**Ngày hiện tại**: 20/04/2026 14:00

✅ **Hợp lệ** - Tạo lịch trình cho:
- 22/04/2026 (còn 56 giờ)
- 23/04/2026 (còn 80 giờ)
- Bất kỳ ngày nào sau 21/04 14:00

❌ **Không hợp lệ** - Tạo lịch trình cho:
- 21/04/2026 08:00 (chỉ còn 18 giờ)
- 21/04/2026 12:00 (chỉ còn 22 giờ)

---

### 2. Test Xung Đột 10 Phút

**Ví dụ ngày 22/04/2026**:

Các tàu xuất phát:
- SE6: 20:00 (xuất phát)
- TN2: 15:30 (xuất phát)
- TN4: Không có (ngày chẵn)

✅ **Hợp lệ** - Tạo lịch trình xuất phát:
- 14:00 (cách TN2 90 phút)
- 15:00 (cách TN2 30 phút)
- 20:30 (cách SE6 30 phút)

❌ **Không hợp lệ** - Tạo lịch trình xuất phát:
- 15:25 (cách TN2 5 phút)
- 15:35 (cách TN2 5 phút)
- 20:05 (cách SE6 5 phút)

---

### 3. Test Mô Phỏng

**Chọn ngày**: 22/04/2026

**Số tàu**: 8 chuyến
- SE1, SE2, SE3, SE4, SE5, SE6 (hàng ngày)
- TN1, TN2 (ngày chẵn)

**Timeline**:
```
05:00 ────────────────────────────────────────── 23:59
  │     │     │     │     │     │     │     │
 SE5   SE1   TN1  SE2  TN2  SE3  SE6  SE4
06:00 08:30 10:30 14:20 15:30 19:00 20:00 22:30
```

**Kịch bản mô phỏng**:
1. 05:30: SE5 approaching
2. 06:00: SE5 arrived
3. 08:20: SE1 approaching
4. 08:30: SE1 arrived
5. ... (tiếp tục)

---

### 4. Test Cuối Tuần

**Chọn ngày**: 26/04/2026 (Chủ nhật)

**Số tàu**: 10 chuyến
- 6 tàu hàng ngày (SE1-SE6)
- 2 tàu ngày chẵn (TN1, TN2)
- 4 tàu cuối tuần (SE7, SE8, DL1, DL2)

**Đặc biệt**: Có tàu du lịch DL1, DL2

---

### 5. Test Ngày Lễ

**Chọn ngày**: 01/05/2026

**Số tàu**: 10 chuyến
- 6 tàu hàng ngày
- 2 tàu ngày lẻ (TN3, TN4)
- 4 tàu đặc biệt (SE9, SE10, SE11, SE12)

**Mật độ cao**: Test khả năng xử lý nhiều tàu

---

## Queries Hữu Ích

### Xem tàu theo ngày
```sql
SELECT ma_chuyen_tau, vai_tro_tai_da_nang, gio_den_du_kien, gio_di_du_kien
FROM CHUYEN_TAU
WHERE ngay_chay = '2026-04-22'
ORDER BY gio_den_du_kien;
```

### Đếm tàu theo vai trò
```sql
SELECT vai_tro_tai_da_nang, COUNT(*) as so_luong
FROM CHUYEN_TAU
WHERE ngay_chay BETWEEN '2026-04-21' AND '2026-05-20'
GROUP BY vai_tro_tai_da_nang;
```

### Tìm ngày có nhiều tàu nhất
```sql
SELECT TOP 5 ngay_chay, COUNT(*) as so_tau
FROM CHUYEN_TAU
WHERE ngay_chay BETWEEN '2026-04-21' AND '2026-05-20'
GROUP BY ngay_chay
ORDER BY COUNT(*) DESC;
```

### Xem tàu xuất phát (để test xung đột 10 phút)
```sql
SELECT ma_chuyen_tau, gio_di_du_kien, ngay_chay
FROM CHUYEN_TAU
WHERE vai_tro_tai_da_nang = 'XUAT_PHAT'
  AND ngay_chay = '2026-04-22'
ORDER BY gio_di_du_kien;
```

---

## Xóa Dữ Liệu Test

```sql
-- Xóa tất cả chuyến tàu trong khoảng thời gian
DELETE FROM CHUYEN_TAU 
WHERE ngay_chay >= '2026-04-21' 
  AND ngay_chay <= '2026-05-20';

-- Xóa lịch trình liên quan (nếu có)
DELETE FROM LICH_TRINH
WHERE ngay_chay >= '2026-04-21' 
  AND ngay_chay <= '2026-05-20';
```

---

## Lưu Ý

1. **Múi giờ**: Tất cả thời gian theo GMT+7 (Việt Nam)

2. **Trạng thái**: Tất cả chuyến tàu có `trang_thai = 'HOAT_DONG'`

3. **Tàu và Tuyến**: Sử dụng mã tàu và tuyến đã có trong data.sql

4. **Ngày chạy**: Đảm bảo ngày chạy >= ngày hiện tại để test validation

5. **Performance**: 250 chuyến tàu là số lượng hợp lý cho test, không làm chậm hệ thống

---

## Troubleshooting

### Lỗi: "Cannot insert duplicate key"
```sql
-- Xóa dữ liệu cũ trước
DELETE FROM CHUYEN_TAU WHERE ngay_chay >= '2026-04-21';
-- Sau đó chạy lại script
```

### Lỗi: "Foreign key constraint"
```sql
-- Đảm bảo các bảng liên quan đã có dữ liệu:
-- TAU, TUYEN, GA
-- Chạy data.sql trước nếu chưa có
```

### Lỗi: "Invalid datetime format"
```sql
-- Kiểm tra format ngày tháng của SQL Server
-- Có thể cần đổi format từ 'YYYY-MM-DD' sang 'DD/MM/YYYY'
```

---

## Mở Rộng

### Thêm nhiều tháng
```sql
-- Thay đổi @EndDate
DECLARE @EndDate DATE = '2026-06-20'; -- Thêm 1 tháng nữa
```

### Thêm tàu mới
```sql
-- Copy pattern của SE1-SE6 và thay đổi:
-- - ma_chuyen_tau
-- - ma_tau
-- - gio_den_du_kien, gio_di_du_kien
```

### Tạo dữ liệu random
```sql
-- Sử dụng RAND() để tạo delay ngẫu nhiên
-- Thêm vào so_phut_tre khi tạo lịch trình
```

---

## Kết Luận

File SQL này cung cấp đủ dữ liệu để test toàn bộ tính năng:
- ✅ Validation 24 giờ
- ✅ Xung đột 10 phút
- ✅ Mô phỏng lịch trình
- ✅ Filter theo ngày
- ✅ Các loại tàu khác nhau
- ✅ Ngày thường, cuối tuần, ngày lễ

**Chúc test vui vẻ! 🚂**
