export default function GaTable({ data, onEdit }) {
    return (
        <div className="card">
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Mã Ga</th>
                            <th>Tên Ga</th>
                            <th>Địa chỉ</th>
                            <th>Loại Ga</th>
                            <th>Thứ tự</th>
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
                            data.map(ga => (
                                <tr key={ga.maGa}>
                                    <td className="font-bold text-navy">{ga.maGa}</td>
                                    <td className="font-bold">{ga.tenGa}</td>
                                    <td>{ga.diaChi || '---'}</td>
                                    <td>{ga.loaiGa || 'Ga hành khách'}</td>
                                    <td>{ga.thuTuTrenTuyen || '---'}</td>
                                    <td>
                                        <span className={`badge ${ga.trangThai === 'HOAT_DONG' ? 'badge-success' : 'badge-gray'}`}>
                                            {ga.trangThai === 'HOAT_DONG' ? 'Hoạt động' : 'Dừng'}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn btn-secondary btn-sm" onClick={() => onEdit(ga)}>
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
