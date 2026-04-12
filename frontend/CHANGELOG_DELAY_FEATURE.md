# Cập nhật: Tính toán Cửa sổ Chiếm Ray với Số Phút Trễ

## Tổng quan
Đã cập nhật hệ thống để tính toán và hiển thị cửa sổ chiếm ray có tính đến số phút trễ của tàu. Khi tàu bị trễ, cửa sổ chiếm ray sẽ tự động được mở rộng để phản ánh thời gian thực tế mà tàu chiếm dụng đường ray.

## Các thay đổi chính

### 1. Logic tính toán cửa sổ chiếm ray (`useScheduleForm.js`)
- **Trước**: Cửa sổ chiếm ray = Giờ đến - 15p → Giờ đi + 15p (buffer cố định)
- **Sau**: Cửa sổ chiếm ray = Giờ đến - 15p + trễ → Giờ đi + 15p + trễ

**Công thức mới theo vai trò tàu:**
- **Tàu xuất phát**: Lên tàu → Đi + buffer + trễ
- **Tàu điểm cuối**: Đến + trễ → Rời ray + buffer + trễ  
- **Tàu trung gian**: Đến - buffer + trễ → Đi + buffer + trễ

### 2. Hiển thị UI (`ScheduleFormModal.jsx`)
- Di chuyển trường "Số phút trễ" lên trước phần "Thời gian thực tế"
- Thêm visual indicator màu cam khi có số phút trễ
- Hiển thị thông tin chi tiết: "CỬA SỔ CHIẾM RAY (+ 15 PHÚT BUFFER + X PHÚT TRỄ)"
- Badge "TRỄ X PHÚT" với thông báo "Cửa sổ chiếm ray đã được mở rộng để bù trễ"

### 3. Phát hiện xung đột (`useScheduleConflicts.js`)
- Cập nhật logic phát hiện xung đột để tính cả số phút trễ
- Hiển thị số phút trễ trong thông báo xung đột: "SE1 (10:30 - 11:00 +12p trễ)"

### 4. Visualization Gantt Chart
#### `GanttTimeline.jsx`
- Tính toán width của schedule block bao gồm cả số phút trễ
- Công thức: `widthPx = baseWidth + (delayMinutes / 60) * HOUR_WIDTH`

#### `ScheduleBlock.jsx`
- Hiển thị gradient màu cam ở phần cuối block khi có trễ
- Badge "+Xp" hiển thị số phút trễ trên block
- Thêm thông tin trễ trong popover hover

#### `SchedulePreviewBlock.jsx`
- Preview block cũng hiển thị số phút trễ với gradient màu cam
- Badge "+Xp" trên preview block
- Thông báo "Trễ X phút - Cửa sổ chiếm ray đã mở rộng" trong popover

## Ví dụ minh họa

### Trường hợp 1: Tàu trung gian trễ 12 phút
```
Giờ đến dự kiến: 10:30
Giờ đi dự kiến: 11:00
Số phút trễ: 12

Cửa sổ chiếm ray:
- Trước: 10:15 - 11:15 (60 phút)
- Sau: 10:27 - 11:27 (60 phút, nhưng dịch về sau 12 phút)
```

### Trường hợp 2: Tàu điểm cuối trễ 20 phút
```
Giờ đến dự kiến: 14:00
Giờ rời ray: 14:15 (tự động)
Số phút trễ: 20

Cửa sổ chiếm ray:
- Trước: 14:00 - 14:30 (30 phút)
- Sau: 14:20 - 14:50 (30 phút, nhưng dịch về sau 20 phút)
```

## Lợi ích
1. **Chính xác hơn**: Phản ánh đúng thời gian thực tế tàu chiếm ray
2. **Phát hiện xung đột tốt hơn**: Tránh gán ray cho tàu khác khi tàu trước còn trễ
3. **Trực quan**: Người dùng thấy rõ ảnh hưởng của việc trễ tàu
4. **Tự động**: Không cần tính toán thủ công

## Files đã thay đổi
- `frontend/src/hooks/useScheduleForm.js`
- `frontend/src/hooks/useScheduleConflicts.js`
- `frontend/src/components/schedule/ScheduleFormModal.jsx`
- `frontend/src/components/schedule/GanttTimeline.jsx`
- `frontend/src/components/schedule/ScheduleBlock.jsx`
- `frontend/src/components/schedule/SchedulePreviewBlock.jsx`

## Testing
Để test tính năng này:
1. Mở trang Lịch trình
2. Chỉnh sửa một lịch trình
3. Nhập số phút trễ (ví dụ: 15)
4. Quan sát:
   - Cửa sổ chiếm ray tự động cập nhật
   - Block trên Gantt chart mở rộng và có màu cam
   - Badge "+15p" hiển thị trên block
   - Phát hiện xung đột tính cả phần trễ
