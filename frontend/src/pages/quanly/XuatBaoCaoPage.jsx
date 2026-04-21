import { useState, useEffect, useMemo } from 'react';
import { lichTrinhAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function XuatBaoCaoPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [allLichTrinh, setAllLichTrinh] = useState([]);
  const [loading, setLoading] = useState(true);
  const [format, setFormat] = useState('PDF'); // Trạng thái chọn PDF hoặc Excel
  
  const [dateRange, setDateRange] = useState({
    from: '2025-01-01',
    to: '2025-12-31'
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await lichTrinhAPI.getAll({});
      const data = res.data.data || res.data || [];
      setAllLichTrinh(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const reportData = useMemo(() => {
    const filtered = allLichTrinh.filter(lt => {
      const dateStr = lt.ngayTao || lt.gioDenDuKien;
      if (!dateStr) return false;
      const date = dateStr.split('T')[0];
      return date >= dateRange.from && date <= dateRange.to;
    });
    const tongChuyen = filtered.length;
    const dungGio = filtered.filter(lt => (lt.soPhutTre || 0) === 0).length;
    const tyLe = tongChuyen > 0 ? ((dungGio / tongChuyen) * 100).toFixed(1) : 0;
    const treTB = tongChuyen > 0 ? (filtered.reduce((sum, lt) => sum + (lt.soPhutTre || 0), 0) / tongChuyen).toFixed(1) : 0;
    return { filtered, tongChuyen, tyLe, treTB };
  }, [allLichTrinh, dateRange]);

  // Hàm xử lý xuất Excel chuẩn
  const exportToExcel = () => {
    if (reportData.filtered.length === 0) return alert("Không có dữ liệu!");
    let csvContent = "\uFEFF"; // Fix lỗi font tiếng Việt
    csvContent += "Mã Chuyến,Đường Ray,Phút Trễ,Trạng Thái,Thời Gian\n";
    reportData.filtered.forEach(lt => {
      csvContent += `${lt.maChuyenTau},${lt.maRay || '---'},${lt.soPhutTre},${lt.trangThai},${lt.ngayTao || ''}\n`;
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Bao_cao_Ga_Da_Nang_${dateRange.from}.csv`;
    link.click();
  };

  const handleAction = () => {
    if (format === 'PDF') window.print();
    else exportToExcel();
  };

  if (loading) return <div className="flex-center" style={{height: '100vh'}}>⌛ Đang chuẩn bị báo cáo...</div>;

  return (
    <div className="report-container-global" style={{ 
      backgroundColor: '#f4f7f6', 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', /* CÂN GIỮA TOÀN TRANG */
      padding: '40px 20px' 
    }}>
      
      {/* Nút quay lại lẻ loi phía trên */}
      <div style={{ width: '100%', maxWidth: '1200px', marginBottom: '20px' }} className="no-print">
        <button className="btn btn-secondary btn-sm" onClick={() => navigate(-1)}>← Quay lại Phân tích</button>
      </div>

      <div className="main-layout" style={{ 
        display: 'grid', 
        gridTemplateColumns: '350px 1fr', 
        gap: '40px', 
        width: '100%', 
        maxWidth: '1250px', /* Giới hạn độ rộng để cân giữa đẹp */
        alignItems: 'start' 
      }}>
        
        {/* CỘT TRÁI: CẤU HÌNH (SẼ BỊ ẨN KHI IN) */}
        <div className="config-sidebar no-print" style={{ position: 'sticky', top: '20px' }}>
          <div className="card shadow-lg" style={{ padding: '28px', background: '#fff', borderRadius: '20px', border: 'none' }}>
            <h3 style={{ marginBottom: '25px', fontSize: '20px', fontWeight: 800, color: '#1e293b' }}>⚙️ Cấu hình báo cáo</h3>
            
            {/* CHỌN ĐỊNH DẠNG */}
            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#94a3b8', marginBottom: '10px', textTransform: 'uppercase' }}>Định dạng xuất</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button className={`btn ${format === 'PDF' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFormat('PDF')}>📄 PDF</button>
                <button className={`btn ${format === 'EXCEL' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setFormat('EXCEL')}>📊 EXCEL</button>
              </div>
            </div>

            {/* CHỌN NGÀY */}
            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#94a3b8', marginBottom: '12px', textTransform: 'uppercase' }}>Khoảng thời gian</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div className="date-input-group">
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Từ ngày:</span>
                  <input type="date" className="form-control" value={dateRange.from} onChange={e => setDateRange({...dateRange, from: e.target.value})} />
                </div>
                <div className="date-input-group">
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>Đến ngày:</span>
                  <input type="date" className="form-control" value={dateRange.to} onChange={e => setDateRange({...dateRange, to: e.target.value})} />
                </div>
              </div>
            </div>

            <button className="btn btn-primary w-full shadow-md" style={{ background: '#1e293b', padding: '16px', fontWeight: 800, borderRadius: '12px' }} onClick={handleAction}>
              {format === 'PDF' ? '📥 XUẤT BÁO CÁO PDF' : '📊 TẢI FILE EXCEL (.CSV)'}
            </button>
          </div>
        </div>

        {/* CỘT PHẢI: TỜ BÁO CÁO A4 */}
        <div className="report-preview-column" style={{ display: 'flex', justifyContent: 'center' }}>
          
          <div id="printable-area" style={{ 
            width: '210mm', 
            minHeight: '297mm', 
            backgroundColor: '#fff', 
            padding: '25mm 20mm', 
            boxShadow: '0 10px 50px rgba(0,0,0,0.1)',
            boxSizing: 'border-box',
            position: 'relative',
            borderRadius: '4px'
          }}>
            {/* Header Văn bản */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #000', paddingBottom: '10px', marginBottom: '35px' }}>
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '12px' }}>TỔNG CÔNG TY ĐƯỜNG SẮT VN</h4>
                <h3 style={{ margin: '5px 0 0', fontSize: '14px', fontWeight: 900 }}>GA ĐÀ NẴNG</h3>
                <div style={{ width: '80px', height: '1.5px', background: '#000', margin: '5px auto' }}></div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <h4 style={{ margin: 0, fontSize: '12px', fontWeight: 900 }}>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h4>
                <p style={{ margin: '3px 0 0', fontSize: '11px', fontWeight: 700 }}>Độc lập - Tự do - Hạnh phúc</p>
                <div style={{ width: '130px', height: '1.5px', background: '#000', margin: '5px auto' }}></div>
              </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '45px' }}>
              <h2 style={{ fontSize: '28px', fontWeight: 900, margin: '0', letterSpacing: '1px' }}>BÁO CÁO HIỆU SUẤT VẬN HÀNH</h2>
              <p style={{ fontStyle: 'italic', fontSize: '14px', marginTop: '15px' }}>
                (Dữ liệu hệ thống từ ngày {new Date(dateRange.from).toLocaleDateString('vi-VN')} đến {new Date(dateRange.to).toLocaleDateString('vi-VN')})
              </p>
            </div>

            {/* Mục 1 */}
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 900, textTransform: 'uppercase', borderLeft: '5px solid #000', paddingLeft: '12px', marginBottom: '18px' }}>I. CÁC CHỈ SỐ VẬN HÀNH TỔNG QUAN</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ border: '1px solid #000', padding: '12px', width: '65%' }}>Tổng lượt tàu thực tế phục vụ:</td>
                    <td style={{ border: '1px solid #000', padding: '12px', textAlign: 'right', fontWeight: 800 }}>{reportData.tongChuyen} chuyến</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #000', padding: '12px' }}>Tỷ lệ tàu đúng giờ (On-time):</td>
                    <td style={{ border: '1px solid #000', padding: '12px', textAlign: 'right', fontWeight: 800, color: '#16a34a' }}>{reportData.tyLe}%</td>
                  </tr>
                  <tr>
                    <td style={{ border: '1px solid #000', padding: '12px' }}>Thời gian trễ bình quân (Phút/chuyến):</td>
                    <td style={{ border: '1px solid #000', padding: '12px', textAlign: 'right', fontWeight: 800, color: '#ef4444' }}>{reportData.treTB}p</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Mục 2 */}
            <div style={{ marginBottom: '40px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 900, textTransform: 'uppercase', borderLeft: '5px solid #000', paddingLeft: '12px', marginBottom: '18px' }}>II. CHI TIẾT DANH SÁCH LỊCH TRÌNH</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5' }}>
                    <th style={{ border: '1px solid #000', padding: '10px' }}>Mã Chuyến</th>
                    <th style={{ border: '1px solid #000', padding: '10px' }}>Ngày Vận Hành</th>
                    <th style={{ border: '1px solid #000', padding: '10px' }}>Ray Đỗ</th>
                    <th style={{ border: '1px solid #000', padding: '10px' }}>Trễ (P)</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.filtered.length > 0 ? reportData.filtered.map((lt, idx) => (
                    <tr key={idx} style={{ pageBreakInside: 'avoid' }}>
                      <td style={{ border: '1px solid #000', padding: '10px', textAlign: 'center', fontWeight: 700 }}>{lt.maChuyenTau}</td>
                      <td style={{ border: '1px solid #000', padding: '10px', textAlign: 'center' }}>{new Date(lt.ngayTao || lt.gioDenDuKien).toLocaleDateString('vi-VN')}</td>
                      <td style={{ border: '1px solid #000', padding: '10px', textAlign: 'center' }}>{lt.maRay}</td>
                      <td style={{ border: '1px solid #000', padding: '10px', textAlign: 'right', fontWeight: 800 }}>{lt.soPhutTre}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan="4" style={{ border: '1px solid #000', padding: '20px', textAlign: 'center' }}>Không có dữ liệu thỏa mãn điều kiện lọc</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Chữ ký */}
            <div style={{ marginTop: '80px', display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <div style={{ textAlign: 'center', width: '220px' }}>
                <p style={{ fontWeight: 800, margin: 0 }}>NGƯỜI LẬP BIỂU</p>
                <p style={{ fontSize: '12px', fontStyle: 'italic', marginBottom: '80px' }}>(Ký và ghi rõ họ tên)</p>
                <p style={{ fontWeight: 900, color: '#1e293b' }}>{user?.hoTen || 'Nguyễn Văn A'}</p>
              </div>
              <div style={{ textAlign: 'center', width: '280px' }}>
                <p style={{ margin: 0 }}>Đà Nẵng, ngày {new Date().getDate()} tháng {new Date().getMonth() + 1} năm {new Date().getFullYear()}</p>
                <p style={{ fontWeight: 800, marginTop: '8px' }}>XÁC NHẬN BAN QUẢN LÝ</p>
                <div style={{ marginBottom: '80px' }}></div>
                <p style={{ fontWeight: 900 }}>Trương Quang Vinh</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          /* 1. Tăng lề trên trang sau cực mạnh */
          @page {
            size: A4;
            margin: 25mm 15mm 20mm 15mm;
          }

          /* 2. Dọn sạch giao diện */
          body { background: white !important; }
          .no-print, button { display: none !important; }
          body * { visibility: hidden; }

          /* 3. Chỉ hiện vùng in và đẩy nó lên đầu trang */
          .preview-centering-container { display: block !important; }
          #printable-area, #printable-area * { visibility: visible; }
          #printable-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 0 !important; /* Lề ngoài do @page lo */
          }

          /* 4. Tiêu đề bảng lặp lại khi sang trang mới */
          thead { display: table-header-group; }
          table { width: 100% !important; border-collapse: collapse; }
          
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>
    </div>
  );
}