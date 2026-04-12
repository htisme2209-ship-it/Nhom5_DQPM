export default function AccountStatsCards({ accounts }) {
    const stats = [
        {
            label: 'Tổng nhân sự',
            value: accounts.length,
            icon: '👥',
            color: 'blue'
        },
        {
            label: 'Hoạt động',
            value: accounts.filter(a => a.trangThai === 'HOAT_DONG').length,
            icon: '🟢',
            color: 'green'
        },
        {
            label: 'Chờ xác nhận',
            value: accounts.filter(a => a.trangThai === 'CHO_XAC_NHAN').length,
            icon: '⏳',
            color: 'orange'
        },
        {
            label: 'Đã khóa',
            value: accounts.filter(a => a.trangThai === 'KHOA').length,
            icon: '🚫',
            color: 'red'
        }
    ];

    return (
        <div className="stats-grid">
            {stats.map((stat, index) => (
                <div key={index} className={`stat-card ${stat.color}`}>
                    <div className="stat-info">
                        <div className="stat-label">{stat.label}</div>
                        <div className="stat-value">{stat.value}</div>
                    </div>
                    <div className="stat-icon">{stat.icon}</div>
                </div>
            ))}
        </div>
    );
}
