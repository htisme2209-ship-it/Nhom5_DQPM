import { VAI_TRO_MAP } from '../../constants/infrastructureConstants';

export default function ChuyenTauTable({ data, tuyenDuong, onEdit }) {
    const getTuyenName = (maTuyen) => tuyenDuong.find(t => t.maTuyen === maTuyen)?.tenTuyen || maTuyen;

    const getVaiTroLabel = (vaiTro) => {
        return VAI_TRO_MAP[vaiTro] || { text: vaiTro, color: '#6B7280', bg: '#F3F4F6' };
    };

    return (
        <div className="card">
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Mã chuyến</th>
                            <th>Mã tàu</th>
                            <th>Tuyến</th>
                            <th>Vai trò tại ĐN</th>
                            <th>Giờ đến</th>
                            <th>Giờ đi</th>
                            <th>Ngày chạy</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.length === 0 ? (
                            <tr>
                                <td colSpan="9" className="text-center text-muted" style={{ padding: '40px' }}>
                                    Chưa có dữ liệu
                                </td>
                            </tr>
                        ) : (
                            data.map(ct => {
                                const vaiTroInfo = getVaiTroLabel(ct.vaiTroTaiDaNang);
                                return (
                                    <tr key={ct.maChuyenTau}>
                                        <td className="font-bold text-navy">{ct.maChuyenTau}</td>
                                        <td>{ct.maTau}</td>
                                        <td>{getTuyenName(ct.maTuyen)}</td>
                                        <td>
                                            <span
                                                className="badge"
                                                style={{
                                                    background: vaiTroInfo.bg,
                                                    color: vaiTroInfo.color,
                                                    border: `1px solid ${vaiTroInfo.color}30`
                                                }}
                                            >
                                                {vaiTroInfo.text}
                                            </span>
                                        </td>
                                        <td>{ct.gioDenDuKien || '---'}</td>
                                        <td>{ct.gioDiDuKien || '---'}</td>
                                        <td>{ct.ngayChay ? new Date(ct.ngayChay).toLocaleDateString('vi-VN') : '---'}</td>
                                        <td>
                                            <span className={`badge ${ct.trangThai === 'HOAT_DONG' ? 'badge-success' : 'badge-gray'}`}>
                                                {ct.trangThai === 'HOAT_DONG' ? 'Hoạt động' : 'Dừng'}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="btn btn-secondary btn-sm" onClick={() => onEdit(ct)}>
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
