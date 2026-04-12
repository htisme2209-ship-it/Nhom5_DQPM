import AccountTableRow from './AccountTableRow';

export default function AccountTable({ accounts, loading, onEdit }) {
    return (
        <div className="card">
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Mã TK</th>
                            <th>Danh tính</th>
                            <th>Email</th>
                            <th>Vai trò</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="text-center text-muted" style={{ padding: '40px' }}>
                                    Đang tải...
                                </td>
                            </tr>
                        ) : accounts.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center text-muted" style={{ padding: '40px' }}>
                                    Không có dữ liệu
                                </td>
                            </tr>
                        ) : (
                            accounts.map(account => (
                                <AccountTableRow
                                    key={account.maTaiKhoan}
                                    account={account}
                                    onEdit={onEdit}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
