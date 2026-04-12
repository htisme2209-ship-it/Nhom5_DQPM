import { RAY_STATUS_MAP } from '../../constants/infrastructureConstants';

export default function RayTable({ data, onEdit }) {
    return (
        <div className="card">
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Mã Ray</th>
                            <th>Số Ray</th>
                            <th>Chiều dài</th>
                            <th>Loại</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center text-muted" style={{ padding: '40px' }}>
                                    Chưa có dữ liệu
                                </td>
                            </tr>
                        ) : (
                            data.map(r => {
                                const st = RAY_STATUS_MAP[r.trangThai] || { label: r.trangThai, cls: 'badge-gray' };
                                return (
                                    <tr key={r.maRay}>
                                        <td className="font-bold text-navy">{r.maRay}</td>
                                        <td><span className="ray-badge">Ray {r.soRay}</span></td>
                                        <td>{r.chieuDaiRay}m</td>
                                        <td>{r.loaiRay}</td>
                                        <td><span className={`badge ${st.cls}`}>{st.label}</span></td>
                                        <td>
                                            <button className="btn btn-secondary btn-sm" onClick={() => onEdit(r)}>
                                                ✏️
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
