# Changelog - Validation UI Enhancement

## Ngày cập nhật: 2026-04-14

## Tổng quan
Cập nhật giao diện frontend để hiển thị trực quan các quy tắc validation khi tạo/chỉnh sửa lịch trình tàu.

---

## 🎨 Các Thay Đổi UI

### 1. Warning Box - Quy Tắc 24 Giờ

**Vị trí**: Trong Time Section của ScheduleFormModal

**Hiển thị khi**:
- ❌ **Lỗi (Đỏ)**: Thời gian đã chọn trong quá khứ
- ⚠️ **Cảnh báo (Cam)**: Còn < 24 giờ đến giờ chạy
- ✅ **OK (Ẩn)**: Còn ≥ 24 giờ

**Nội dung**:
```
🚫 Không thể tạo lịch trình trong quá khứ
Thời gian đã chọn (XX:XX) đã qua

⚠️ Lịch trình phải được tạo trước ít nhất 24 giờ
Hiện tại chỉ còn X giờ Y phút. Vui lòng chuyển sang luồng xử lý sự cố nếu cần tạo gấp.
```

**Styling**:
- Background: `#FEF2F2` (error) / `#FFF7ED` (warning)
- Border: `#FCA5A5` (error) / `#FED7AA` (warning)
- Icon: 🚫 (error) / ⚠️ (warning)

---

### 2. Departure Conflict Warning - Quy Tắc 10 Phút

**Vị trí**: Dưới input giờ đi trong Time Section

**Hiển thị khi**: Có tàu khác xuất phát trong khoảng ±10 phút

**Nội dung**:
```
🚦 Khoảng cách giữa các tàu xuất phát phải ≥ 10 phút
Tàu SE1 (Ray RAY-1) đã có lịch xuất phát lúc 10:00 (cách 5 phút).
Vui lòng chọn thời gian khác.
```

**Styling**:
- Background: `#FEF2F2`
- Border: `#FCA5A5`
- Color: `#991B1B`

---

### 3. Timeline Visual Indicators

**Vùng 10 Phút (Buffer Zones)**:
- Hiển thị vùng đỏ mờ xung quanh mỗi thời điểm xuất phát
- Width: 10 phút (±5 phút từ giờ xuất phát)
- Background: `rgba(239, 68, 68, 0.08)`
- Border: `1px dashed rgba(239, 68, 68, 0.3)`
- Label: Mã tàu + icon ⬅️

**Đường kẻ giữa**:
- Đường thẳng đứng màu đỏ tại thời điểm xuất phát chính xác
- Width: `2px`
- Color: `rgba(239, 68, 68, 0.5)`

---

### 4. Info Box - Quy Tắc Tạo Lịch Trình

**Vị trí**: Trên Gantt Timeline

**Nội dung**:
```
ℹ️ QUY TẮC TẠO LỊCH TRÌNH
• Phải tạo trước ít nhất 24 giờ so với giờ chạy
• Các tàu xuất phát phải cách nhau ≥ 10 phút (vùng đỏ trên timeline)
• Không được tạo lịch trình trong quá khứ
```

**Styling**:
- Background: `var(--blue-50)`
- Border: `var(--blue-200)`
- Color: `var(--blue-800)`
- Font size: `11px`

---

### 5. Legend Update

**Thêm vào legend**:
```
🔴 VÙNG 10 PHÚT - Vùng buffer xung quanh thời điểm xuất phát
```

**Visual**:
- Box với pattern dashed border
- Background màu đỏ nhạt

---

### 6. Save Button States

**Trạng thái nút Lưu**:

1. **Normal** (Có thể lưu):
   - Text: `🔒 Lưu lịch trình` / `🔒 Cập nhật`
   - Background: Primary blue
   - Enabled: ✅

2. **Error** (Lỗi nghiêm trọng):
   - Text: `🚫 Không thể lưu`
   - Background: Red (opacity 0.5)
   - Disabled: ❌
   - Trigger: Quá khứ, xung đột ray, xung đột 10 phút

3. **Warning** (Cảnh báo < 24h):
   - Text: `⚠️ Cần > 24h`
   - Background: Orange (opacity 0.5)
   - Disabled: ❌
   - Trigger: Còn < 24 giờ

4. **Loading**:
   - Text: `⏳ Đang lưu...`
   - Disabled: ❌

---

## 📝 Logic Validation

### Frontend Validation (Real-time)

```javascript
// 1. Time Validation
const timeValidation = useMemo(() => {
  // Kiểm tra quá khứ
  if (earliestTime < now) return { type: 'error', ... }
  
  // Kiểm tra 24 giờ
  const hoursUntil = (earliestTime - now) / (1000 * 60 * 60);
  if (hoursUntil < 24) return { type: 'warning', ... }
  
  return { type: 'success', ... }
}, [form.gioDenDuKien, form.gioDiDuKien]);

// 2. Departure Conflict
const departureConflict = useMemo(() => {
  const conflicts = lichTrinh.filter(lt => {
    const diffMinutes = Math.abs((newDeparture - ltDeparture) / (1000 * 60));
    return diffMinutes < 10;
  });
  
  return conflicts.length > 0 ? conflicts[0] : null;
}, [form.gioDiDuKien, lichTrinh]);
```

### Backend Validation (On Save)

Backend sẽ validate lại tất cả các quy tắc và trả về error message chi tiết nếu vi phạm.

---

## 🎯 User Experience Flow

### Khi Tạo Lịch Trình Mới

1. **Chọn mã tàu** → Form tự động điền giờ đến/đi
2. **Nhập/điều chỉnh thời gian**:
   - ✅ Nếu OK: Không có warning
   - ⚠️ Nếu < 24h: Hiển thị warning cam
   - ❌ Nếu quá khứ: Hiển thị error đỏ
3. **Xem timeline**:
   - Vùng đỏ hiển thị các thời điểm xuất phát đã có
   - Preview block hiển thị lịch trình mới
4. **Chọn ray**:
   - Kiểm tra xung đột chiếm ray
   - Kiểm tra xung đột 10 phút xuất phát
5. **Lưu**:
   - Nút disable nếu có lỗi
   - Backend validate lại trước khi lưu

### Khi Có Lỗi

**Quá khứ**:
- Input border đỏ
- Warning box đỏ
- Nút lưu disable với text "🚫 Không thể lưu"

**< 24 giờ**:
- Warning box cam
- Nút lưu disable với text "⚠️ Cần > 24h"
- Gợi ý chuyển sang luồng sự cố

**Xung đột 10 phút**:
- Warning box đỏ dưới input giờ đi
- Vùng đỏ trên timeline
- Nút lưu disable
- Hiển thị tàu xung đột và khoảng cách

---

## 🔧 Technical Details

### Files Modified

1. **ScheduleFormModal.jsx**:
   - Added `timeValidation` useMemo
   - Added `departureConflict` useMemo
   - Added warning boxes
   - Updated save button logic

2. **GanttTimeline.jsx**:
   - Added departure buffer zones visualization
   - Added departure markers with labels

3. **useScheduleForm.js**:
   - No changes (validation logic in component)

### Dependencies

- React `useMemo` for performance optimization
- Date manipulation for time calculations
- Existing timeline utilities (`getPxPos`, `HOUR_WIDTH`, etc.)

---

## 🧪 Testing Checklist

- [ ] Warning hiển thị khi chọn thời gian < 24h
- [ ] Error hiển thị khi chọn thời gian quá khứ
- [ ] Vùng 10 phút hiển thị đúng trên timeline
- [ ] Conflict warning hiển thị khi tàu cách < 10 phút
- [ ] Nút lưu disable đúng lúc
- [ ] Backend validation hoạt động
- [ ] Error message từ backend hiển thị rõ ràng
- [ ] UI responsive trên các màn hình khác nhau

---

## 📚 Related Documentation

- Backend: `backend/src/main/java/com/danang/railway/service/README_LICH_TRINH_VALIDATION.md`
- Service: `LichTrinhService.java`
- Controller: `LichTrinhController.java`

---

## 🎨 Color Palette

```css
/* Error */
--error-bg: #FEF2F2
--error-border: #FCA5A5
--error-text: #991B1B

/* Warning */
--warning-bg: #FFF7ED
--warning-border: #FED7AA
--warning-text: #C2410C

/* Info */
--info-bg: var(--blue-50)
--info-border: var(--blue-200)
--info-text: var(--blue-800)

/* Buffer Zone */
--buffer-bg: rgba(239, 68, 68, 0.08)
--buffer-border: rgba(239, 68, 68, 0.3)
--buffer-line: rgba(239, 68, 68, 0.5)
```

---

## 💡 Future Enhancements

1. **Tooltip on hover**: Hiển thị chi tiết khi hover vào vùng 10 phút
2. **Animation**: Highlight vùng xung đột khi có lỗi
3. **Smart suggestions**: Gợi ý thời gian phù hợp gần nhất
4. **Batch validation**: Kiểm tra nhiều lịch trình cùng lúc
5. **Export validation report**: Xuất báo cáo các lỗi validation
