# Tính năng Báo cáo Sự cố Nhanh

## Tổng quan
Cho phép nhân viên nhà ga báo cáo nhanh về tàu trễ hoặc vấn đề khác trực tiếp từ trang Xác nhận tàu, không cần vào trang Ghi nhận sự cố đầy đủ.

## Đã implement

### Backend
1. ✅ API endpoint: `POST /api/su-co/bao-cao-nhanh`
2. ✅ Service method: `baoCaoNhanh()` trong SuCoService.java
3. ✅ Tự động xác định mức độ dựa trên số phút trễ
4. ✅ Tự động tạo mô tả nếu không nhập
5. ✅ Gắn thẻ sự cố cho lịch trình

### Frontend
1. ✅ API method: `suCoAPI.baoCaoNhanh()`
2. ✅ Handler: `handleBaoCaoNhanh()` trong XacNhanTauPage.jsx

## Cần thêm vào UI

### Trong bảng "Tàu chờ xác nhận vào ga"

Thêm nút báo cáo nhanh bên cạnh nút "Xác nhận vào ga":

```jsx
<td>
    <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
        <button
            className="btn btn-primary btn-sm"
            onClick={() => openXacNhan(lt, 'VAO_GA')}
            style={{ width: '100%' }}
        >
            ✅ Xác nhận vào ga
        </button>
        
        {/* NÚT MỚI: Báo cáo nhanh */}
        {diff > 5 && ( // Chỉ hiện khi trễ > 5 phút
            <button
                className="btn btn-warning btn-sm"
                onClick={() => handleBaoCaoNhanh(lt)}
                style={{ width: '100%', fontSize: '11px' }}
                title="Báo cáo nhanh đến Điều hành"
            >
                📢 Báo cáo trễ
            </button>
        )}
    </div>
</td>
```

### Vị trí chính xác

Tìm đoạn code này trong XacNhanTauPage.jsx (khoảng dòng 280-300):

```jsx
<td>
    <button
        className="btn btn-primary btn-sm"
        onClick={() => openXacNhan(lt, 'VAO_GA')}
        style={{ width: '100%' }}
    >
        ✅ Xác nhận vào ga
    </button>
</td>
```

Thay thế bằng:

```jsx
<td>
    <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
        <button
            className="btn btn-primary btn-sm"
            onClick={() => openXacNhan(lt, 'VAO_GA')}
            style={{ width: '100%' }}
        >
            ✅ Xác nhận vào ga
        </button>
        
        {diff > 5 && (
            <button
                className="btn btn-warning btn-sm"
                onClick={() => handleBaoCaoNhanh(lt)}
                style={{ width: '100%', fontSize: '11px' }}
                title="Báo cáo nhanh đến Điều hành"
            >
                📢 Báo cáo trễ
            </button>
        )}
    </div>
</td>
```

## Luồng hoạt động

1. Nhân viên nhà ga thấy tàu trễ > 5 phút
2. Nhấn nút "📢 Báo cáo trễ"
3. Popup hiện ra cho phép nhập mô tả (có thể để trống)
4. Hệ thống tự động:
   - Tạo sự cố với mã `SC-QUICK-{timestamp}`
   - Xác định mức độ dựa trên số phút trễ:
     - Trễ >= 20 phút: MỨC ĐỘ CAO
     - Trễ >= 10 phút: MỨC ĐỘ TRUNG BÌNH
     - Trễ < 10 phút: MỨC ĐỘ THẤP
   - Tạo mô tả tự động nếu không nhập
   - Gắn thẻ sự cố cho lịch trình
   - Gửi thông báo đến Điều hành
5. Toast hiển thị: "Đã gửi báo cáo đến Điều hành!"

## Ưu điểm

1. **Nhanh chóng**: Chỉ 2 click (nút + OK)
2. **Tự động**: Không cần nhập đầy đủ thông tin
3. **Thông minh**: Tự động xác định mức độ
4. **Linh hoạt**: Có thể thêm mô tả hoặc để trống
5. **Không phong tỏa**: Không tự động phong tỏa ray (để Điều hành quyết định)

## Test Cases

1. ✅ Báo cáo tàu trễ 7 phút (mức độ THẤP)
2. ✅ Báo cáo tàu trễ 12 phút (mức độ TRUNG BÌNH)
3. ✅ Báo cáo tàu trễ 25 phút (mức độ CAO)
4. ✅ Báo cáo với mô tả tùy chỉnh
5. ✅ Báo cáo để trống mô tả (dùng tự động)
6. ✅ Kiểm tra sự cố được tạo đúng
7. ✅ Kiểm tra lịch trình được gắn thẻ
8. ✅ Kiểm tra Điều hành nhận được thông báo

## CSS cần thêm (nếu chưa có)

```css
.btn-warning {
    background: var(--orange-500);
    color: white;
    border: 1px solid var(--orange-600);
}

.btn-warning:hover {
    background: var(--orange-600);
}

.btn-warning:disabled {
    background: var(--orange-300);
    cursor: not-allowed;
}
```

## Ghi chú

- Nút chỉ hiện khi tàu trễ > 5 phút
- Không thay thế chức năng "Ghi nhận sự cố" đầy đủ
- Dành cho các trường hợp cần báo cáo nhanh
- Nhân viên Điều hành sẽ xử lý sau
