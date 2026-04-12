import { STATUS_OPTIONS } from '../../constants/scheduleConstants';

/**
 * Schedule Filters Component
 * Date and status filters for schedule list
 */
export default function ScheduleFilters({ filter, onFilterChange, onRefresh, totalCount }) {
    return (
        <div className="filter-bar">
            <input
                type="date"
                className="form-control"
                style={{ width: 'auto' }}
                value={filter.ngay}
                onChange={(e) => onFilterChange({ ...filter, ngay: e.target.value })}
            />
            <select
                className="form-control"
                style={{ width: 'auto' }}
                value={filter.trangThai || ''}
                onChange={(e) => onFilterChange({ ...filter, trangThai: e.target.value || undefined })}
            >
                {STATUS_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            <button className="btn btn-secondary btn-sm" onClick={onRefresh}>
                🔄 Làm mới
            </button>
            <span className="text-sm text-muted" style={{ marginLeft: 'auto' }}>
                Tổng: {totalCount} lịch trình
            </span>
        </div>
    );
}
