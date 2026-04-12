export const INFRASTRUCTURE_TABS = [
    { key: 'ray', label: '\u{1F6E4}\uFE0F \u0110\u01B0\u1EDDng ray', icon: '\u{1F6E4}\uFE0F' },
    { key: 'tau', label: '\u{1F682} \u0110o\u00E0n t\u00E0u', icon: '\u{1F682}' },
    { key: 'ga', label: '\u{1F3E2} Ga', icon: '\u{1F3E2}' },
    { key: 'tuyen', label: '\u{1F5FA}\uFE0F Tuy\u1EBFn \u0111\u01B0\u1EDDng', icon: '\u{1F5FA}\uFE0F' },
    { key: 'chuyen-tau', label: '\u{1F684} Chuy\u1EBFn t\u00E0u', icon: '\u{1F684}' }
];

export const RAY_STATUS_MAP = {
    SAN_SANG: { label: 'S\u1EB5n s\u00E0ng', cls: 'badge-success' },
    DANG_SU_DUNG: { label: '\u0110ang s\u1EED d\u1EE5ng', cls: 'badge-info' },
    BAO_TRI: { label: 'B\u1EA3o tr\u00EC', cls: 'badge-warning' },
    PHONG_TOA: { label: 'Phong t\u1ECDa', cls: 'badge-danger' }
};

export const VAI_TRO_MAP = {
    TRUNG_GIAN: { text: 'Trung gian', color: '#10B981', bg: '#D1FAE5' },
    XUAT_PHAT: { text: 'Xu\u1EA5t ph\u00E1t', color: '#F59E0B', bg: '#FEF3C7' },
    DIEM_CUOI: { text: '\u0110i\u1EC3m cu\u1ED1i', color: '#8B5CF6', bg: '#EDE9FE' }
};

export const DEFAULT_RAY_FORM = {
    maRay: '',
    soRay: '',
    chieuDaiRay: '',
    loaiRay: '\u0110\u01B0\u1EDDng ch\u00EDnh',
    trangThai: 'SAN_SANG'
};

export const DEFAULT_TAU_FORM = {
    maTau: '',
    tenTau: '',
    loaiTau: 'T\u00E0u kh\u00E1ch',
    soToa: '',
    sucChua: '',
    trangThai: 'HOAT_DONG'
};

export const DEFAULT_GA_FORM = {
    maGa: '',
    tenGa: '',
    diaChi: '',
    loaiGa: 'Ga h\u00E0nh kh\u00E1ch',
    thuTuTrenTuyen: '',
    trangThai: 'HOAT_DONG'
};

export const DEFAULT_TUYEN_FORM = {
    maTuyen: '',
    tenTuyen: '',
    maGaDau: '',
    maGaCuoi: '',
    khoangCachKm: '',
    trangThai: 'HOAT_DONG'
};

export const DEFAULT_CHUYEN_TAU_FORM = {
    maChuyenTau: '',
    maTau: '',
    maTuyen: '',
    vaiTroTaiDaNang: '',
    gioDenDuKien: '',
    gioDiDuKien: '',
    ngayChay: '',
    trangThai: 'HOAT_DONG'
};
