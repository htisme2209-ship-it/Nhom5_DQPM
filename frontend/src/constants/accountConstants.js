export const ROLE_MAP = {
    'QUAN_TRI_VIEN': { label: 'Quản trị viên', cls: 'badge-navy' },
    'NHAN_VIEN_DIEU_HANH': { label: 'Điều phối viên', cls: 'badge-info' },
    'NHAN_VIEN_NHA_GA': { label: 'NV Nhà ga', cls: 'badge-success' },
    'BAN_QUAN_LY': { label: 'Quản lý', cls: 'badge-warning' },
};

export const STATUS_MAP = {
    'HOAT_DONG': { label: 'Đang hoạt động', color: 'var(--green-500)' },
    'CHO_XAC_NHAN': { label: 'Chờ xác nhận', color: 'var(--orange-500)' },
    'KHOA': { label: 'Đã khóa', color: 'var(--red-500)' },
};

export const DEFAULT_ACCOUNT_FORM = {
    maTaiKhoan: '',
    hoTen: '',
    email: '',
    matKhau: '123456',
    quyenTruyCap: 'NHAN_VIEN_NHA_GA',
    soDienThoai: '',
    gioiTinh: 'NAM',
    trangThai: 'HOAT_DONG'
};
