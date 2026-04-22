# Hướng dẫn Dữ liệu Test Toàn diện

## Tổng quan
File này mô tả các test cases cần có trong data.sql để test đầy đủ tất cả tính năng.

## Test Cases cần có

### 1. Tài khoản (14 users - đã có)
- ✅ 2 Quản trị viên
- ✅ 4 Nhân viên Điều hành
- ✅ 4 Nhân viên Nhà ga
- ✅ 3 Ban Quản lý

### 2. Ga (15 ga thay vì 11)
Thêm các ga:
- GA-DA_LAT (Đà Lạt)
- GA-PHAN_THIET (Phan Thiết)
- GA-BIEN_HOA (Biên Hòa)
- GA-THU_DUC (Thủ Đức)

### 3. Tuyến đường (8 tuyến thay vì 5)
Thêm:
- TU-DN-NTR (Đà Nẵng - Nha Trang)
- TU-NTR-SGN (Nha Trang - Sài Gòn)
- TU-HUE-DN (Huế - Đà Nẵng)

### 4. Tàu (20 tàu thay vì 15)
Thêm:
- SE9, SE10 (Tàu nhanh)
- TN3, TN4 (Tàu Đà Nẵng - Huế)
- QN3 (Tàu Đà Nẵng - Quảng Ngãi)
- HD3 (Tàu hàng)
- DN2 (Tàu nội đô)

### 5. Đường ray (5 ray - đã có)
- ✅ RAY-01 đến RAY-05

### 6. Chuyến tàu (30 chuyến thay vì 18)
Cần có đủ các loại:
- 15 chuyến TRUNG_GIAN
- 8 chuyến XUAT_PHAT
- 7 chuyến DIEM_CUOI

### 7. Lịch trình (40 lịch trình thay vì 18)

#### Test Cases quan trọng:

**A. Trạng thái đa dạng:**
- 5 CHO_XAC_NHAN (để test xác nhận tàu)
- 10 DA_XAC_NHAN (đã xác nhận, chưa đến)
- 5 DUNG_TAI_GA (đang đỗ, để test xuất phát)
- 8 DA_ROI_GA (đã rời ga)
- 2 BI_HUY (bị hủy)
- 5 TRE (trễ < 20 phút)
- 3 TRE_NGHIEM_TRONG (trễ >= 20 phút)
- 2 HUY_CHUYEN (hủy chuyến)

**B. Số phút trễ đa dạng:**
- 10 lịch trình: soPhutTre = 0 (đúng giờ)
- 8 lịch trình: soPhutTre = 5-15 (trễ nhẹ)
- 5 lịch trình: soPhutTre = 16-19 (trễ vừa)
- 3 lịch trình: soPhutTre = 20-25 (ngưỡng 20 phút)
- 2 lịch trình: soPhutTre = 30-45 (trễ nặng)

**C. Thời gian đa dạng:**
- 5 lịch trình: trong quá khứ (đã qua)
- 10 lịch trình: trong 2 giờ tới (sắp đến)
- 15 lịch trình: trong ngày hôm nay
- 10 lịch trình: ngày mai

**D. Phân bổ ray:**
- RAY-01: 10 lịch trình (ray bận nhất)
- RAY-02: 8 lịch trình
- RAY-03: 8 lịch trình
- RAY-04: 7 lịch trình
- RAY-05: 7 lịch trình

**E. Xung đột ray (để test):**
- 3 cặp lịch trình có thời gian giao nhau trên cùng ray
- 2 lịch trình cách nhau < 15 phút (buffer conflict)

### 8. Sự cố (12 sự cố thay vì 3)

**A. Loại sự cố:**
- 3 SU_CO_KY_THUAT
- 2 SU_CO_TAU
- 2 SU_CO_DUONG_RAY
- 2 MAT_LIEN_LAC (để test vận hành khẩn cấp)
- 1 TRE_TAU
- 2 KHAC

**B. Mức độ:**
- 3 THAP
- 4 TRUNG_BINH
- 3 CAO
- 2 KHAN_CAP

**C. Trạng thái xử lý:**
- 5 CHUA_XU_LY (để test xử lý)
- 3 DANG_XU_LY
- 3 DA_XU_LY
- 1 NHAP (để test kích hoạt từ nháp)

**D. Phong tỏa:**
- 2 sự cố: kichHoatPhongToa = true
- 10 sự cố: kichHoatPhongToa = false

**E. Ảnh hưởng lịch trình:**
- Sự cố 1: ảnh hưởng 5 lịch trình (RAY-01)
- Sự cố 2: ảnh hưởng 3 lịch trình (RAY-02)
- Sự cố 3: ảnh hưởng 2 lịch trình (RAY-03)
- Các sự cố khác: 0-1 lịch trình

### 9. Kế hoạch đặc biệt (8 kế hoạch thay vì 4)

**Trạng thái:**
- 3 CHO_PHE_DUYET
- 2 DA_PHE_DUYET
- 2 TU_CHOI
- 1 NHAP

**Mức độ ưu tiên:**
- 2 KHAN_CAP
- 3 CAO
- 2 BINH_THUONG
- 1 THAP

### 10. Chỉ đạo (10 chỉ đạo thay vì 3)

**Trạng thái:**
- 4 DA_GUI (chưa đọc)
- 6 DA_DOC

**Mức độ:**
- 3 KHAN_CAP
- 4 CAO
- 3 BINH_THUONG

### 11. Nhật ký (30 bản ghi thay vì 8)

**Hành động đa dạng:**
- 5 TAO_LICH_TRINH
- 5 PHAN_BO_RAY
- 3 GHI_NHAN_SU_CO
- 3 XU_LY_SU_CO
- 2 XU_LY_TRE_CHUYEN
- 2 THU_HOI_LENH
- 3 CAP_NHAT_TAI_KHOAN
- 2 PHE_DUYET
- 3 DOI_RAY
- 2 GIAI_PHONG_RAY

## Script SQL mẫu

### Thêm lịch trình với test cases đặc biệt:

```sql
-- Test case: Tàu trễ 25 phút (ngưỡng 20 phút)
INSERT INTO LICH_TRINH VALUES (
    'LT-TRE-20', 'CT-SE1-BN', 'RAY-01', 'NVDH-001', NULL,
    DATEADD(HOUR, 8, @today), 
    DATEADD(HOUR, 8, @today) + CAST('00:20:00' AS DATETIME),
    NULL, NULL, 25, 'TRE_NGHIEM_TRONG', NULL, 
    GETDATE(), GETDATE()
);

-- Test case: Tàu chờ xác nhận quá 10 phút (mất liên lạc)
INSERT INTO LICH_TRINH VALUES (
    'LT-MLL-01', 'CT-SE2-BN', 'RAY-02', 'NVDH-001', NULL,
    DATEADD(MINUTE, -15, GETDATE()), -- 15 phút trước
    DATEADD(MINUTE, -15, GETDATE()) + CAST('00:20:00' AS DATETIME),
    NULL, NULL, 0, 'CHO_XAC_NHAN', NULL,
    GETDATE(), GETDATE()
);

-- Test case: Xung đột ray
INSERT INTO LICH_TRINH VALUES (
    'LT-CONFLICT-1', 'CT-SE3-BN', 'RAY-01', 'NVDH-001', NULL,
    DATEADD(HOUR, 10, @today),
    DATEADD(HOUR, 10, @today) + CAST('00:30:00' AS DATETIME),
    NULL, NULL, 0, 'DA_XAC_NHAN', NULL,
    GETDATE(), GETDATE()
);

INSERT INTO LICH_TRINH VALUES (
    'LT-CONFLICT-2', 'CT-SE4-BN', 'RAY-01', 'NVDH-002', NULL,
    DATEADD(HOUR, 10, @today) + CAST('00:20:00' AS DATETIME), -- Giao nhau
    DATEADD(HOUR, 10, @today) + CAST('00:50:00' AS DATETIME),
    NULL, NULL, 0, 'DA_XAC_NHAN', NULL,
    GETDATE(), GETDATE()
);

-- Test case: Sự cố ảnh hưởng nhiều lịch trình
INSERT INTO SU_CO VALUES (
    'SC-MULTI-01', 'LT-001', 'NVNG-001', 'RAY-01', 0,
    'SU_CO_DUONG_RAY', 
    N'Đường ray 1 bị nứt, ảnh hưởng nhiều chuyến tàu',
    'CAO', 'DANG_XU_LY', GETDATE(), NULL, GETDATE()
);

-- Gắn thẻ sự cố cho nhiều lịch trình
UPDATE LICH_TRINH 
SET ma_su_co_anh_huong = 'SC-MULTI-01', phuong_an_xu_ly = 'CHO_RAY'
WHERE ma_ray = 'RAY-01' 
AND trang_thai IN ('CHO_XAC_NHAN', 'DA_XAC_NHAN');
```

## Checklist Test

### UC-10: Xác nhận tàu
- [ ] Xác nhận tàu vào ga đúng giờ
- [ ] Xác nhận tàu vào ga trễ 5 phút
- [ ] Xác nhận tàu vào ga trễ 15 phút
- [ ] Xác nhận tàu xuất phát
- [ ] Hủy xác nhận
- [ ] Tàu quá 10 phút chưa xác nhận (tự động tạo sự cố)

### UC-09: Ghi nhận sự cố
- [ ] Ghi nhận sự cố mức độ thấp
- [ ] Ghi nhận sự cố mức độ cao (phong tỏa cứng)
- [ ] Lưu nháp sự cố
- [ ] Kích hoạt sự cố từ nháp
- [ ] Upload hình ảnh
- [ ] Validation thiếu thông tin

### UC-06: Xử lý sự cố
- [ ] Xử lý trễ chuyến 10 phút
- [ ] Xử lý trễ chuyến 25 phút (ngưỡng 20)
- [ ] Thu hồi lệnh
- [ ] Đổi ray (không xung đột)
- [ ] Đổi ray (có xung đột - phải báo lỗi)
- [ ] Hủy chuyến
- [ ] Giải phóng ray
- [ ] Vận hành khẩn cấp (mất liên lạc)

### Tính năng khác
- [ ] Tính toán cửa sổ chiếm ray với số phút trễ
- [ ] Phát hiện xung đột ray
- [ ] Tính toán ảnh hưởng domino
- [ ] Phong tỏa tự động
- [ ] Gắn thẻ lịch trình bị ảnh hưởng

## Lưu ý
- Sử dụng `@today = CAST(GETDATE() AS DATE)` để tạo thời gian động
- Dùng `DATEADD()` để tạo thời gian tương đối
- Đảm bảo có đủ dữ liệu cho mỗi vai trò user
- Tạo dữ liệu có tính liên kết (sự cố → lịch trình, lịch trình → chuyến tàu, etc.)
