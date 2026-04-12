import { INFRASTRUCTURE_TABS } from '../../constants/infrastructureConstants';

export default function InfrastructureTabs({ activeTab, onTabChange, counts }) {
    return (
        <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
            {INFRASTRUCTURE_TABS.map(tab => (
                <button
                    key={tab.key}
                    className={`btn ${activeTab === tab.key ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => onTabChange(tab.key)}
                >
                    {tab.label} ({counts[tab.key] || 0})
                </button>
            ))}
        </div>
    );
}
