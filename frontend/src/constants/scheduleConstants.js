// ============================================================
// Schedule Constants
// ============================================================

export const STATUS_MAP = {
    'CHO_XAC_NHAN': { label: 'Chờ xác nhận', cls: 'badge-warning' },
    'DA_XAC_NHAN': { label: 'Đã xác nhận', cls: 'badge-info' },
    'DUNG_TAI_GA': { label: 'Đang ở ga', cls: 'badge-success' },
    'DA_ROI_GA': { label: 'Đã rời ga', cls: 'badge-gray' },
    'BI_HUY': { label: 'Bị hủy', cls: 'badge-danger' },
};

export const ROLE_LABELS = {
    'TRUNG_GIAN': {
        text: 'Trung gian',
        color: 'var(--navy-600)',
        bg: '#DBEAFE',
        desc: 'Giờ đến VÀ giờ đi — chiếm ray từ (đến − 15\') đến (đi + 15\')'
    },
    'XUAT_PHAT': {
        text: 'Xuất phát',
        color: '#C2410C',
        bg: '#FEF3C7',
        desc: 'Chỉ sự kiện ĐI — chiếm ray từ Lên tàu (đi − 30\') đến (đi + 15\' đệm)'
    },
    'DIEM_CUOI': {
        text: 'Điểm cuối',
        color: '#166534',
        bg: 'var(--green-100)',
        desc: 'Chỉ sự kiện ĐẾN — chiếm ray từ Đến ga đến Rời ray (đến + 15\') + 15\' đệm'
    },
};

export const STATUS_OPTIONS = [
    { value: '', label: 'Tất cả trạng thái' },
    { value: 'CHO_XAC_NHAN', label: 'Chờ xác nhận' },
    { value: 'DA_XAC_NHAN', label: 'Đã xác nhận' },
    { value: 'DUNG_TAI_GA', label: 'Đang ở ga' },
    { value: 'DA_ROI_GA', label: 'Đã rời ga' },
];
