import { ROLE_MAP, STATUS_MAP } from '../../constants/accountConstants';

export default function AccountTableRow({ account, onEdit }) {
    const role = ROLE_MAP[account.quyenTruyCap] || {
        label: account.quyenTruyCap,
        cls: 'badge-gray'
    };

    const status = STATUS_MAP[account.trangThai] || {
        label: account.trangThai,
        color: 'var(--gray-500)'
    };

    const initials = account.hoTen
        ? account.hoTen.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase()
        : '?';

    return (
        <tr>
            <td className="font-semibold">{account.maTaiKhoan}</td>
            <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background: 'var(--navy-100)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '13px',
                        color: 'var(--navy-700)'
                    }}>
                        {initials}
                    </div>
                    <div>
                        <div className="font-semibold">{account.hoTen}</div>
                        <div className="text-xs text-muted">{account.soDienThoai}</div>
                    </div>
                </div>
            </td>
            <td className="text-sm">{account.email}</td>
            <td>
                <span className={`badge ${role.cls}`}>{role.label}</span>
            </td>
            <td>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                    <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: status.color
                    }}></span>
                    {status.label}
                </span>
            </td>
            <td>
                <div style={{ display: 'flex', gap: '4px' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => onEdit(account)}>
                        ✏️
                    </button>
                </div>
            </td>
        </tr>
    );
}
