export default function TuyenTable({ data, gaList, onEdit }) {
    const getGaName = (maGa) => gaList.find(g => g.maGa === maGa)?.tenGa || maGa;

    const formatRoute = (tuyen) => {
        const gaDau = getGaName(tuyen.maGaDau);
        const gaCuoi = getGaName(tuyen.maGaCuoi);
        
        if (tuyen.gaGiua && tuyen.gaGiua.length > 0) {
            const gasGiua = tuyen.gaGiua.map(maGa => getGaName(maGa)).join(' → ');
            return `${gaDau} → ${gasGiua} → ${gaCuoi}`;
        }
        
        return `${gaDau} → ${gaCuoi}`;
    };

    return (
        <div className="card">
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Mã tuyến</th>
                            <th>Tên tuyến</th>
                            <th>Lộ trình</th>
                            <th>Khoảng cách</th>
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
                            data.map(tuyen => (
                                <tr key={tuyen.maTuyen}>
                                    <td className="font-bold text-navy">{tuyen.maTuyen}</td>
                                    <td className="font-bold">{tuyen.tenTuyen}</td>
                                    <td className="text-sm">{formatRoute(tuyen)}</td>
                                    <td>{tuyen.khoangCachKm} km</td>
                                    <td>
                                        <span className={`badge ${tuyen.trangThai === 'HOAT_DONG' ? 'badge-success' : 'badge-gray'}`}>
                                            {tuyen.trangThai === 'HOAT_DONG' ? 'Hoạt động' : 'Dừng'}
                                        </span>
                                    </td>
                                    <td>
                                        <button className="btn btn-secondary btn-sm" onClick={() => onEdit(tuyen)}>
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
