# Account Management Components

Các component được tái cấu trúc để quản lý tài khoản nhân sự theo best practices của React.

## Cấu trúc Component

### 1. Components (UI Layer)

#### `AccountStatsCards.jsx`
- Hiển thị thống kê tổng quan về tài khoản
- Props: `{ accounts }`
- Tái sử dụng: Có thể dùng ở dashboard hoặc báo cáo

#### `AccountTable.jsx`
- Bảng hiển thị danh sách tài khoản
- Props: `{ accounts, loading, onEdit }`
- Composition: Sử dụng `AccountTableRow` bên trong

#### `AccountTableRow.jsx`
- Một dòng trong bảng tài khoản
- Props: `{ account, onEdit }`
- Tái sử dụng: Có thể dùng trong các bảng khác

#### `AccountFormModal.jsx`
- Form modal để tạo/sửa tài khoản
- Props: `{ isOpen, onClose, form, onChange, onSave, isEdit, loading }`
- Controlled component: Nhận form data và onChange từ parent

#### `AccountFilterBar.jsx`
- Thanh lọc và làm mới dữ liệu
- Props: `{ filterRole, onFilterChange, onRefresh }`
- Tái sử dụng: Có thể mở rộng thêm filter khác

### 2. Custom Hooks (Business Logic Layer)

#### `useAccounts.js`
- Quản lý state và logic load danh sách tài khoản
- Returns: `{ accounts, loading, error, reload }`
- Tách biệt logic API khỏi UI

#### `useAccountForm.js`
- Quản lý state và logic form tạo/sửa tài khoản
- Params: `(onSuccess, onError)`
- Returns: `{ form, setForm, editItem, loading, openCreate, openEdit, handleSave }`
- Tái sử dụng: Có thể dùng cho các form tương tự

#### `useToast.js`
- Quản lý thông báo toast
- Params: `(duration = 3000)`
- Returns: `{ toast, showToast, showSuccess, showError }`
- Tái sử dụng: Dùng cho toàn bộ app

### 3. Constants

#### `accountConstants.js`
- `ROLE_MAP`: Mapping vai trò và hiển thị
- `STATUS_MAP`: Mapping trạng thái và màu sắc
- `DEFAULT_ACCOUNT_FORM`: Form mặc định
- Tập trung quản lý constants, dễ bảo trì

### 4. Common Components

#### `Toast.jsx`
- Component hiển thị thông báo
- Props: `{ message, type, onClose }`
- Tái sử dụng: Dùng cho toàn bộ app

## Lợi ích của cấu trúc mới

### 1. Separation of Concerns
- UI components chỉ lo render
- Custom hooks lo business logic
- Constants tập trung ở một nơi

### 2. Reusability
- Mỗi component có thể tái sử dụng độc lập
- Hooks có thể dùng cho nhiều page khác nhau
- Toast, Filter có thể dùng cho toàn bộ app

### 3. Testability
- Dễ test từng component riêng lẻ
- Hooks có thể test độc lập
- Mock data dễ dàng

### 4. Maintainability
- Code ngắn gọn, dễ đọc
- Thay đổi một component không ảnh hưởng component khác
- Dễ mở rộng thêm tính năng

### 5. Performance
- useMemo cho filtered data
- useCallback trong hooks
- Component nhỏ, re-render ít hơn

## Cách sử dụng

```jsx
import TaiKhoanPage from './pages/admin/TaiKhoanPage';

// Page đã tích hợp sẵn tất cả components và hooks
<TaiKhoanPage />
```

## Mở rộng

### Thêm filter mới
Chỉnh sửa `AccountFilterBar.jsx`:
```jsx
<select value={filterStatus} onChange={onStatusChange}>
  <option value="">Tất cả trạng thái</option>
  ...
</select>
```

### Thêm action mới
Chỉnh sửa `AccountTableRow.jsx`:
```jsx
<button onClick={() => onDelete(account)}>🗑️</button>
```

### Tái sử dụng cho module khác
```jsx
// Dùng AccountTable cho module khác
import AccountTable from '../../components/account/AccountTable';

<AccountTable 
  accounts={myAccounts} 
  loading={loading} 
  onEdit={handleEdit} 
/>
```

## Best Practices được áp dụng

1. ✅ Single Responsibility Principle
2. ✅ Component Composition
3. ✅ Custom Hooks for Logic Reuse
4. ✅ Controlled Components
5. ✅ Props Drilling Prevention
6. ✅ Memoization for Performance
7. ✅ Constants Extraction
8. ✅ Error Handling
9. ✅ Loading States
10. ✅ Accessibility Ready
