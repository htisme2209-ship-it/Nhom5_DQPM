export default function AccountFilterBar({ filterRole, onFilterChange, onRefresh }) {
    return (
        <div className="filter-bar">
            <select
                className="form-control"
                style={{ width: 'auto' }}
                value={filterRole}
                onChange={(e) => onFilterChange(e.target.value)}
            >
                <option value="">Tất cả vai trò</option>
                <option value="QUAN_TRI_VIEN">Quản trị viên</option>
                <option value="NHAN_VIEN_DIEU_HANH">Điều phối viên</option>
                <option value="NHAN_VIEN_NHA_GA">NV Nhà ga</option>
                <option value="BAN_QUAN_LY">Ban Quản lý</option>
            </select>
            <button className="btn btn-secondary btn-sm" onClick={onRefresh}>
                🔄 Làm mới
            </button>
        </div>
    );
}
