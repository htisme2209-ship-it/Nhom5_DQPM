export default function InfrastructureHeader({ activeTab, onCreate }) {
    const tabConfig = {
        ray: { icon: '🛤️', label: 'Đường ray' },
        tau: { icon: '🚂', label: 'Tàu' },
        ga: { icon: '🏢', label: 'Ga' },
        tuyen: { icon: '🗺️', label: 'Tuyến đường' },
        'chuyen-tau': { icon: '🚄', label: 'Chuyến tàu' }
    };

    const currentTab = tabConfig[activeTab] || tabConfig.ray;

    return (
        <div className="page-header">
            <div className="page-header-actions">
                <div>
                    <h1>Cơ sở Hạ tầng</h1>
                    <p>Quản lý đường ray, tàu, tuyến đường và chuyến tàu</p>
                </div>
                <button className="btn btn-primary" onClick={onCreate}>
                    {currentTab.icon} Thêm {currentTab.label}
                </button>
            </div>
        </div>
    );
}
