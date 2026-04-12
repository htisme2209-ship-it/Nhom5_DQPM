export default function TauTable({ data, onEdit }) {
    return (
        <div className="card">
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Mã Tàu</th>
                            <th>Tên Tàu</th>
                            <th>Loại</th>
                            <th>Số toa</th>
                            <th>Sức chứa</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="text-center text-muted" style={{ padding: '40px' }}>
                                    Chưa có dữ liệu
                                </td>
                            </tr>
                        ) : (
                            data.map(t => (
                                <tr key={t.maTau}>
                                    <td className="font-bold text-navy">{t.maTau}</td>
                                    <td>{t.tenTau}</td>
                                    <td>{t.loaiTau}</td>
                                    <td>{t.soToa}</td>
                                    <td>{t.sucChua}</td>
                                    <td>
                                        <span className={`badge ${t.trangThai === 'HOAT_DONG' ? 'badge-success' : 'badge-warning'}`}>
                                            {t.trangThai === 'HOAT_DONG' ? 'Hoạt động' : t.trangThai}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn btn-secondary btn-sm" onClick={() => onEdit(t)}>
                                            ✏️
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
