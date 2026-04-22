import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { duongRayAPI, lichTrinhAPI, chuyenTauAPI, suCoAPI } from '../../services/api';
import {
    HOUR_WIDTH, TOTAL_WIDTH, TIMELINE_START, TIMELINE_END,
    generateTimeSlots, getPxPos, getPxWidth, formatTime
} from '../../utils/timeUtils';

// ─── Màu theo vai trò tàu ──────────────────────────────────────────────────
const TRAIN_COLORS = {
    TRUNG_GIAN: { bg: '#E8F5E9', border: '#4CAF50', text: '#2E7D32' },
    XUAT_PHAT:  { bg: '#FFF3E0', border: '#FF9800', text: '#E65100' },
    DIEM_CUOI:  { bg: '#F3E5F5', border: '#9C27B0', text: '#6A1B9A' }
};
const INCIDENT_COLORS = { bg: '#FEF2F2', border: '#EF4444', text: '#991B1B' };
const TRACK_STATUS_CONFIG = {
    SAN_SANG:      { color: '#16A34A', label: 'SẴN SÀNG',       dot: '●' },
    PHONG_TOA_TAM: { color: '#D97706', label: 'PHONG TỎA TẠM', dot: '●' },
    PHONG_TOA_CUNG:{ color: '#DC2626', label: 'PHONG TỎA CỨNG', dot: '●' },
};

const getTrainColors = (vaiTro, isIncidentSchedule) =>
    isIncidentSchedule ? INCIDENT_COLORS : (TRAIN_COLORS[vaiTro] || TRAIN_COLORS.TRUNG_GIAN);

// Lấy ngày (YYYY-MM-DD) từ datetime string
const getDateStr = (dtStr) => {
    if (!dtStr) return null;
    return new Date(dtStr).toISOString().split('T')[0];
};

export default function DieuPhoiRayPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Context từ URL params (khi chuyển từ XuLySuCoPage)
    const suCoId = searchParams.get('suCoId');
    const lichTrinhIdsParam = searchParams.get('lichTrinhIds');
    const incidentLichTrinhIds = lichTrinhIdsParam ? lichTrinhIdsParam.split(',') : [];
    const isIncidentMode = !!suCoId;

    const [duongRay, setDuongRay] = useState([]);
    const [allLichTrinh, setAllLichTrinh] = useState([]); // toàn bộ lịch trình của ngày
    const [chuyenTau, setChuyenTau] = useState([]);
    const [incidentSchedules, setIncidentSchedules] = useState([]); // lịch trình bị sự cố cần đổi ray
    const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [draggedSchedule, setDraggedSchedule] = useState(null);
    const [hoveredRay, setHoveredRay] = useState(null);
    const [tooltipSchedule, setTooltipSchedule] = useState(null);
    const [doneIds, setDoneIds] = useState(new Set()); // lịch trình đã được đổi ray thành công
    const [autoReleased, setAutoReleased] = useState(null); // { maRay, soRay } nếu ray được tự động giải phóng

    const ganttScrollRef = useRef(null);
    const isDragging = useRef(false);
    const dragStartX = useRef(0);
    const scrollStartX = useRef(0);
    const timeSlots = generateTimeSlots();

    // Drag-to-scroll Gantt
    const onMouseDown = useCallback((e) => {
        if (e.button !== 0 || draggedSchedule) return;
        isDragging.current = true;
        dragStartX.current = e.clientX;
        scrollStartX.current = ganttScrollRef.current?.scrollLeft || 0;
        if (ganttScrollRef.current) ganttScrollRef.current.style.cursor = 'grabbing';
    }, [draggedSchedule]);

    const onMouseMove = useCallback((e) => {
        if (!isDragging.current) return;
        const dx = e.clientX - dragStartX.current;
        if (ganttScrollRef.current) ganttScrollRef.current.scrollLeft = scrollStartX.current - dx;
    }, []);

    const onMouseUp = useCallback(() => {
        isDragging.current = false;
        if (ganttScrollRef.current) ganttScrollRef.current.style.cursor = 'grab';
    }, []);

    useEffect(() => {
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
    }, [onMouseMove, onMouseUp]);

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [rayRes, ltRes, ctRes] = await Promise.all([
                duongRayAPI.getAll(),
                lichTrinhAPI.getAll(),
                chuyenTauAPI.getAll()
            ]);
            const rays    = rayRes.data?.data || rayRes.data || [];
            const allSched = ltRes.data?.data  || ltRes.data  || [];
            const trains  = ctRes.data?.data   || ctRes.data  || [];

            setDuongRay(rays);
            setChuyenTau(trains);

            if (isIncidentMode && incidentLichTrinhIds.length > 0) {
                // Tách lịch trình bị sự cố
                const incSched = allSched.filter(lt => incidentLichTrinhIds.includes(lt.maLichTrinh));
                setIncidentSchedules(incSched);

                // Xác định ngày từ lịch trình đầu tiên bị sự cố
                const firstDate = getDateStr(incSched[0]?.gioDenDuKien);
                const date = firstDate || new Date().toISOString().split('T')[0];
                setTargetDate(date);

                // Lọc TẤT CẢ lịch trình cùng ngày để hiển thị trên Gantt
                const sameDaySchedules = allSched.filter(lt => {
                    const d = getDateStr(lt.gioDenDuKien);
                    return d === date;
                });
                setAllLichTrinh(sameDaySchedules);
            } else {
                // Không có sự cố — hiển thị lịch trình hôm nay
                const today = new Date().toISOString().split('T')[0];
                const todaySchedules = allSched.filter(lt => getDateStr(lt.gioDenDuKien) === today);
                setAllLichTrinh(todaySchedules);
            }
        } catch (e) {
            console.error(e);
            showToast('Lỗi khi tải dữ liệu', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    // Kiểm tra xung đột ray
    const checkConflict = (schedule, targetRayId) => {
        const raySchedules = allLichTrinh.filter(
            lt => lt.maRay === targetRayId && lt.maLichTrinh !== schedule.maLichTrinh
        );
        const newStart = new Date(schedule.gioDenDuKien);
        const newEnd   = new Date(schedule.gioDiDuKien);
        for (const ex of raySchedules) {
            if (new Date(ex.gioDenDuKien) < newEnd && newStart < new Date(ex.gioDiDuKien)) {
                return { hasConflict: true, conflictWith: ex.maChuyenTau };
            }
        }
        return { hasConflict: false };
    };

    const handleDrop = async (e, rayId) => {
        e.preventDefault();
        setHoveredRay(null);
        if (!draggedSchedule) return;

        const ray = duongRay.find(r => r.maRay === rayId);
        if (ray?.trangThai === 'PHONG_TOA_TAM' || ray?.trangThai === 'PHONG_TOA_CUNG') {
            showToast(`Ray ${ray.soRay || rayId} đang bị phong tỏa`, 'error');
            setDraggedSchedule(null);
            return;
        }

        // Không cho drop vào ray cũ
        if (draggedSchedule.maRay === rayId) {
            showToast('Đây là ray hiện tại của lịch trình', 'error');
            setDraggedSchedule(null);
            return;
        }

        const conflict = checkConflict(draggedSchedule, rayId);
        if (conflict.hasConflict) {
            showToast(`Xung đột với tàu ${conflict.conflictWith} trên Ray ${ray?.soRay || rayId}`, 'error');
            setDraggedSchedule(null);
            return;
        }

        try {
            // Lưu trạng thái ray hiện tại trước khi gọi API
            const rayTruocKhi = duongRay.find(r => r.maRay === (draggedSchedule.maSuCoAnhHuong
                ? incidentSchedules[0]?.maRay
                : draggedSchedule.maRay));

            // Gọi API xử lý đổi ray (ghi nhật ký đầy đủ)
            await suCoAPI.xuLyPhuongAn({
                maLichTrinh: draggedSchedule.maLichTrinh,
                phuongAn: 'DOI_RAY',
                maRayMoi: rayId
            });

            showToast(`✓ Đã đổi ${draggedSchedule.maChuyenTau} → Ray ${ray?.soRay || rayId}`);
            setDoneIds(prev => new Set([...prev, draggedSchedule.maLichTrinh]));

            // Reload và kiểm tra xem ray có được tự động giải phóng không
            await loadData();

            // So sánh trạng thái ray sự cố sau reload
            const suCoRayId = incidentSchedules.find(lt => lt.maLichTrinh === draggedSchedule.maLichTrinh)?.maRay
                || draggedSchedule.maRay;
            setTimeout(() => {
                setDuongRay(prev => {
                    const rayAfter = prev.find(r => r.maRay === suCoRayId);
                    if (rayAfter?.trangThai === 'SAN_SANG' && rayTruocKhi?.trangThai === 'PHONG_TOA_TAM') {
                        setAutoReleased({ maRay: rayAfter.maRay, soRay: rayAfter.soRay });
                        showToast(`🟢 Ray ${rayAfter.soRay || rayAfter.maRay} tự động chuyển SẴN SÀNG!`, 'success');
                    }
                    return prev;
                });
            }, 300);
        } catch (err) {
            showToast(err.response?.data?.message || 'Lỗi khi đổi ray', 'error');
        }
        setDraggedSchedule(null);
    };

    // Lịch trình còn cần đổi ray (chưa xong)
    const pendingSidebarSchedules = incidentSchedules.filter(
        lt => !doneIds.has(lt.maLichTrinh) && lt.phuongAnXuLy !== 'DOI_RAY'
    );
    const allDone = isIncidentMode && pendingSidebarSchedules.length === 0 && incidentSchedules.length > 0;

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>⏳ Đang tải...</div>;

    return (
        <>
            {toast && (
                <div className="toast-container">
                    <div className={`toast ${toast.type}`}>
                        {toast.type === 'success' ? '✅' : '❌'} {toast.msg}
                    </div>
                </div>
            )}

            {/* Page Header */}
            <div className="page-header">
                <div className="page-header-actions">
                    <div>
                        <p style={{ fontSize: '11px', color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                            {isIncidentMode ? `SỰ CỐ ${suCoId} — ĐIỀU PHỐI RAY` : 'ĐIỀU PHỐI ĐƯỜNG RAY'}
                        </p>
                        <h1>Điều phối Đường ray</h1>
                        <p style={{ fontSize: '13px', color: 'var(--gray-500)' }}>
                            Ngày {formatDate(targetDate)} • Kéo thả lịch trình sang đường ray mới
                        </p>
                    </div>
                    {isIncidentMode && (
                        <button className="btn btn-secondary" onClick={() => navigate('/dieu-hanh/xu-ly-su-co')}>
                            ← Quay lại xử lý sự cố
                        </button>
                    )}
                </div>
            </div>

            {/* Banner sự cố */}
            {isIncidentMode && (
                <div style={{
                    background: allDone ? '#F0FDF4' : '#FEF2F2',
                    border: `1.5px solid ${allDone ? '#86EFAC' : '#FCA5A5'}`,
                    borderRadius: 'var(--radius-md)', padding: '14px 20px',
                    marginBottom: autoReleased ? '8px' : '16px',
                    display: 'flex', alignItems: 'center', gap: '14px'
                }}>
                    <span style={{ fontSize: '24px' }}>{allDone ? '✅' : '🚨'}</span>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '14px', color: allDone ? '#15803D' : '#991B1B' }}>
                            {allDone
                                ? `Đã hoàn tất điều phối sự cố ${suCoId}`
                                : `Đang điều phối sự cố: ${suCoId}`
                            }
                        </div>
                        <div style={{ fontSize: '12px', color: allDone ? '#166534' : '#B91C1C', marginTop: '2px' }}>
                            {allDone
                                ? 'Tất cả lịch trình bị ảnh hưởng đã được phân bổ lại đường ray thành công.'
                                : `${pendingSidebarSchedules.length}/${incidentSchedules.length} lịch trình cần đổi ray. Kéo từ danh sách trái vào đường ray phù hợp.`
                            }
                        </div>
                    </div>
                </div>
            )}

            {/* Banner tự động giải phóng ray */}
            {autoReleased && (
                <div style={{
                    background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
                    border: '2px solid #22C55E', borderRadius: 'var(--radius-md)',
                    padding: '14px 20px', marginBottom: '16px',
                    display: 'flex', alignItems: 'center', gap: '14px',
                    boxShadow: '0 0 0 4px rgba(34,197,94,0.12)'
                }}>
                    <span style={{ fontSize: '28px' }}>🟢</span>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: '14px', color: '#15803D', marginBottom: '3px' }}>
                            Ray {autoReleased.soRay || autoReleased.maRay} đã tự động chuyển → SẴN SÀNG
                        </div>
                        <div style={{ fontSize: '12px', color: '#166534' }}>
                            Hệ thống tự động giải phóng đường ray phong tỏa tạm vì không còn lịch trình nào cần xử lý.
                            Sự cố <strong>{suCoId}</strong> đã được đánh dấu <strong>ĐÃ XỬ LÝ</strong>.
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/dieu-hanh/xu-ly-su-co')}
                        style={{
                            padding: '8px 16px', borderRadius: '8px', border: 'none',
                            background: '#16A34A', color: 'white', fontSize: '12px',
                            fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap'
                        }}
                    >
                        Về trang sự cố →
                    </button>
                </div>
            )}



            {!isIncidentMode && (
                <div style={{
                    background: '#EFF6FF', border: '1.5px solid #BFDBFE',
                    borderRadius: 'var(--radius-md)', padding: '12px 20px',
                    marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px'
                }}>
                    <span style={{ fontSize: '20px' }}>ℹ️</span>
                    <div style={{ fontSize: '13px', color: '#1E40AF' }}>
                        <strong>Điều phối đường ray</strong> — Trang này dùng để đổi ray cho lịch trình bị ảnh hưởng bởi sự cố.
                        Truy cập từ trang <strong>Xử lý Sự cố → Điều phối ray</strong> để sử dụng đầy đủ chức năng.
                    </div>
                </div>
            )}

            <div style={{ display: 'flex', gap: '16px', height: isIncidentMode ? 'calc(100vh - 310px)' : 'calc(100vh - 260px)' }}>

                {/* ─── Sidebar lịch trình cần đổi ray ───────────────────── */}
                {isIncidentMode && (
                    <div style={{ width: '290px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{
                            background: 'white', borderRadius: '10px', padding: '14px 16px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                            borderTop: allDone ? '3px solid #22C55E' : '3px solid #EF4444'
                        }}>
                            <div style={{ fontSize: '11px', color: 'var(--gray-500)', fontWeight: 700, marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                ⚡ Cần đổi đường ray
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--gray-400)' }}>
                                {pendingSidebarSchedules.length > 0
                                    ? `${pendingSidebarSchedules.length} lịch trình — Kéo vào ray mới`
                                    : '✓ Đã xử lý tất cả'}
                            </div>
                        </div>

                        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {pendingSidebarSchedules.length === 0 ? (
                                <div style={{
                                    padding: '40px 16px', textAlign: 'center',
                                    color: 'var(--gray-400)', background: 'white',
                                    borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
                                }}>
                                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>✅</div>
                                    <div style={{ fontSize: '12px' }}>Tất cả lịch trình đã được phân bổ lại</div>
                                </div>
                            ) : pendingSidebarSchedules.map(schedule => {
                                const train = chuyenTau.find(ct => ct.maChuyenTau === schedule.maChuyenTau);
                                const colors = getTrainColors(train?.vaiTroTaiDaNang, true);
                                const isDragged = draggedSchedule?.maLichTrinh === schedule.maLichTrinh;

                                return (
                                    <div
                                        key={schedule.maLichTrinh}
                                        draggable
                                        onDragStart={() => setDraggedSchedule(schedule)}
                                        onDragEnd={() => setDraggedSchedule(null)}
                                        style={{
                                            background: 'white', borderRadius: '10px', padding: '14px',
                                            cursor: 'grab',
                                            border: `2px dashed ${colors.border}`,
                                            boxShadow: isDragged
                                                ? '0 8px 24px rgba(239,68,68,0.25)'
                                                : '0 1px 4px rgba(0,0,0,0.08)',
                                            opacity: isDragged ? 0.55 : 1,
                                            transition: 'box-shadow 0.15s, opacity 0.15s',
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                            <div style={{ fontWeight: 700, fontSize: '14px', color: colors.text }}>
                                                {schedule.maChuyenTau}
                                            </div>
                                            <span style={{
                                                fontSize: '10px', background: '#FEE2E2', color: '#DC2626',
                                                padding: '2px 7px', borderRadius: '8px', fontWeight: 700
                                            }}>SỰ CỐ</span>
                                        </div>
                                        <div style={{ fontSize: '11px', color: 'var(--gray-500)', marginBottom: '5px' }}>
                                            {schedule.maLichTrinh}
                                        </div>
                                        <div style={{ fontSize: '12px', color: 'var(--gray-700)', fontWeight: 500, marginBottom: '3px' }}>
                                            🕐 {formatTime(schedule.gioDenDuKien)} → {formatTime(schedule.gioDiDuKien)}
                                        </div>
                                        <div style={{ fontSize: '11px', color: 'var(--gray-500)' }}>
                                            🛤 Ray hiện tại: <strong>{schedule.maRay || '—'}</strong>
                                        </div>
                                        {schedule.soPhutTre > 0 && (
                                            <div style={{ fontSize: '11px', color: '#DC2626', marginTop: '4px', fontWeight: 600 }}>
                                                ⏱ Trễ {schedule.soPhutTre} phút
                                            </div>
                                        )}
                                        <div style={{
                                            marginTop: '10px', paddingTop: '8px',
                                            borderTop: '1px dashed #FCA5A5',
                                            fontSize: '10px', color: 'var(--gray-400)',
                                            textAlign: 'center'
                                        }}>
                                            ↕ Kéo thả vào đường ray mới
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Lịch trình đã xong */}
                            {doneIds.size > 0 && (
                                <div style={{
                                    background: '#F0FDF4', border: '1px solid #BBF7D0',
                                    borderRadius: '10px', padding: '12px 14px'
                                }}>
                                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#15803D', marginBottom: '6px' }}>
                                        ✓ Đã đổi ray ({doneIds.size})
                                    </div>
                                    {incidentSchedules
                                        .filter(lt => doneIds.has(lt.maLichTrinh))
                                        .map(lt => (
                                            <div key={lt.maLichTrinh} style={{
                                                fontSize: '12px', color: '#16A34A',
                                                padding: '3px 0', borderTop: '1px solid #DCFCE7'
                                            }}>
                                                ✓ {lt.maChuyenTau} — {lt.maLichTrinh}
                                            </div>
                                        ))
                                    }
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ─── Gantt Chart ─────────────────────────────────────────── */}
                <div style={{
                    flex: 1, background: 'white', borderRadius: '10px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                    display: 'flex', flexDirection: 'column', overflow: 'hidden'
                }}>
                    {/* Gantt header */}
                    <div style={{
                        padding: '12px 20px', borderBottom: '1px solid var(--gray-200)',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                        <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--gray-700)' }}>
                            BIỂU ĐỒ ĐƯỜNG RAY — {formatDate(targetDate)} (00:00–24:00)
                            <span style={{ marginLeft: '12px', fontSize: '11px', color: 'var(--gray-400)', fontWeight: 400 }}>
                                {allLichTrinh.length} lịch trình
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: '14px', fontSize: '11px', color: 'var(--gray-400)', alignItems: 'center' }}>
                            {[
                                { color: '#E8F5E9', border: '#4CAF50', label: 'Trung gian' },
                                { color: '#FFF3E0', border: '#FF9800', label: 'Xuất phát' },
                                { color: '#F3E5F5', border: '#9C27B0', label: 'Điểm cuối' },
                                { color: '#FEF2F2', border: '#EF4444', label: 'Sự cố' },
                            ].map(({ color, border, label }) => (
                                <span key={label} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: color, border: `2px solid ${border}`, display: 'inline-block' }} />
                                    {label}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                        {/* Ray label column */}
                        <div style={{ width: '140px', flexShrink: 0, borderRight: '1px solid var(--gray-200)' }}>
                            <div style={{ height: '40px', borderBottom: '2px solid var(--gray-200)', background: 'var(--gray-50)' }} />
                            {duongRay.map(ray => {
                                const statusCfg = TRACK_STATUS_CONFIG[ray.trangThai] || TRACK_STATUS_CONFIG.SAN_SANG;
                                const isBlocked = ray.trangThai === 'PHONG_TOA_TAM' || ray.trangThai === 'PHONG_TOA_CUNG';
                                return (
                                    <div
                                        key={ray.maRay}
                                        onDragOver={e => { e.preventDefault(); setHoveredRay(ray.maRay); }}
                                        onDrop={e => handleDrop(e, ray.maRay)}
                                        onDragLeave={() => setHoveredRay(null)}
                                        style={{
                                            height: '80px', padding: '12px 16px',
                                            borderBottom: '1px solid var(--gray-200)',
                                            background: hoveredRay === ray.maRay
                                                ? (isBlocked ? '#FEF2F2' : '#EFF6FF')
                                                : (isBlocked ? '#FFF8F8' : 'transparent'),
                                            transition: 'background 0.15s'
                                        }}
                                    >
                                        <div style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>
                                            Ray {ray.soRay || ray.maRay}
                                        </div>
                                        <div style={{ fontSize: '10px', color: statusCfg.color, fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            {statusCfg.dot} {statusCfg.label}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Scrollable timeline */}
                        <div
                            ref={ganttScrollRef}
                            onMouseDown={onMouseDown}
                            style={{ flex: 1, overflowX: 'auto', cursor: 'grab', scrollbarWidth: 'thin' }}
                        >
                            <div style={{ minWidth: `${TOTAL_WIDTH}px` }}>
                                {/* Time header */}
                                <div style={{ display: 'flex', height: '40px', borderBottom: '2px solid var(--gray-200)', background: 'var(--gray-50)' }}>
                                    {timeSlots.map((slot, i) => (
                                        <div key={i} style={{
                                            flex: `0 0 ${HOUR_WIDTH}px`, textAlign: 'center',
                                            fontSize: '10px', fontWeight: 600, color: 'var(--gray-500)',
                                            padding: '12px 0', borderLeft: i > 0 ? '1px solid var(--gray-200)' : 'none'
                                        }}>
                                            {slot.substring(0, 5)}
                                        </div>
                                    ))}
                                </div>

                                {/* Track rows */}
                                {duongRay.map(ray => {
                                    const raySchedules = allLichTrinh.filter(lt => lt.maRay === ray.maRay);
                                    const isBlocked = ray.trangThai === 'PHONG_TOA_TAM' || ray.trangThai === 'PHONG_TOA_CUNG';

                                    return (
                                        <div
                                            key={ray.maRay}
                                            onDragOver={e => { e.preventDefault(); setHoveredRay(ray.maRay); }}
                                            onDrop={e => handleDrop(e, ray.maRay)}
                                            onDragLeave={() => setHoveredRay(null)}
                                            style={{
                                                height: '80px', position: 'relative',
                                                borderBottom: '1px solid var(--gray-200)',
                                                background: isBlocked
                                                    ? 'repeating-linear-gradient(45deg,#FFF8F8,#FFF8F8 8px,#FEE2E2 8px,#FEE2E2 16px)'
                                                    : hoveredRay === ray.maRay ? '#EFF6FF' : 'white',
                                                transition: 'background 0.15s'
                                            }}
                                        >
                                            {/* Grid lines */}
                                            {timeSlots.map((_, i) => (
                                                <div key={i} style={{
                                                    position: 'absolute', left: `${i * HOUR_WIDTH}px`,
                                                    top: 0, bottom: 0, width: '1px', background: 'var(--gray-100)',
                                                    pointerEvents: 'none'
                                                }} />
                                            ))}

                                            {/* Current time line */}
                                            {(() => {
                                                const now = new Date();
                                                const nowH = now.getHours() + now.getMinutes() / 60;
                                                if (nowH >= TIMELINE_START && nowH <= TIMELINE_END) {
                                                    const px = (nowH - TIMELINE_START) * HOUR_WIDTH;
                                                    return (
                                                        <div style={{
                                                            position: 'absolute', left: `${px}px`,
                                                            top: 0, bottom: 0, width: '2px',
                                                            background: 'rgba(59,85,149,0.4)', zIndex: 3, pointerEvents: 'none'
                                                        }}>
                                                            <div style={{
                                                                position: 'absolute', top: '-3px', left: '-4px',
                                                                width: '10px', height: '10px',
                                                                background: 'var(--navy-600)', borderRadius: '50%'
                                                            }} />
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })()}

                                            {/* Schedule blocks */}
                                            {raySchedules.map(lt => {
                                                if (!lt.gioDenDuKien || !lt.gioDiDuKien) return null;
                                                const tDen   = formatTime(lt.gioDenDuKien);
                                                const tDi    = formatTime(lt.gioDiDuKien);
                                                const leftPx = getPxPos(tDen);
                                                const delayPx = ((lt.soPhutTre || 0) / 60) * HOUR_WIDTH;
                                                const widthPx = Math.max(60, getPxWidth(tDen, tDi) + delayPx);
                                                const train   = chuyenTau.find(ct => ct.maChuyenTau === lt.maChuyenTau);
                                                const isIncSched = incidentLichTrinhIds.includes(lt.maLichTrinh);
                                                const colors  = getTrainColors(train?.vaiTroTaiDaNang, isIncSched);
                                                const isNewlyDone = doneIds.has(lt.maLichTrinh);

                                                return (
                                                    <div
                                                        key={lt.maLichTrinh}
                                                        onMouseEnter={() => setTooltipSchedule(lt)}
                                                        onMouseLeave={() => setTooltipSchedule(null)}
                                                        style={{
                                                            position: 'absolute',
                                                            left: `${leftPx}px`, width: `${widthPx}px`,
                                                            top: '10px', bottom: '10px',
                                                            borderRadius: '8px',
                                                            background: colors.bg,
                                                            border: isIncSched
                                                                ? `2.5px dashed ${colors.border}`
                                                                : `2px solid ${colors.border}`,
                                                            padding: '5px 10px',
                                                            display: 'flex', flexDirection: 'column',
                                                            justifyContent: 'center', zIndex: 5,
                                                            boxShadow: isNewlyDone
                                                                ? '0 0 0 2px #22C55E, 0 2px 8px rgba(0,0,0,0.1)'
                                                                : '0 1px 4px rgba(0,0,0,0.1)',
                                                            cursor: 'default', overflow: 'hidden'
                                                        }}
                                                    >
                                                        <div style={{
                                                            fontWeight: 700, fontSize: '12px', color: colors.text,
                                                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                                            display: 'flex', alignItems: 'center', gap: '4px'
                                                        }}>
                                                            {isIncSched && <span style={{ fontSize: '10px' }}>⚡</span>}
                                                            {lt.maChuyenTau}
                                                            {isNewlyDone && <span style={{ fontSize: '10px', color: '#22C55E' }}>✓</span>}
                                                        </div>
                                                        <div style={{ fontSize: '10px', color: colors.text, opacity: 0.75, whiteSpace: 'nowrap' }}>
                                                            {tDen}–{tDi}
                                                        </div>
                                                        {lt.soPhutTre > 0 && (
                                                            <div style={{ fontSize: '9px', color: '#DC2626', fontWeight: 700 }}>
                                                                +{lt.soPhutTre}p
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}

                                            {/* Ray đang bị phong tỏa overlay */}
                                            {isBlocked && (
                                                <div style={{
                                                    position: 'absolute', inset: 0, display: 'flex',
                                                    alignItems: 'center', justifyContent: 'center',
                                                    pointerEvents: 'none', zIndex: 10
                                                }}>
                                                    <span style={{
                                                        background: 'white', border: '2px solid #DC2626',
                                                        borderRadius: '6px', padding: '4px 12px',
                                                        fontSize: '11px', fontWeight: 700, color: '#DC2626',
                                                        display: 'flex', alignItems: 'center', gap: '6px',
                                                        boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
                                                    }}>
                                                        🔒 {ray.trangThai === 'PHONG_TOA_CUNG' ? 'PHONG TỎA CỨNG' : 'PHONG TỎA TẠM'}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Drop target highlight */}
                                            {hoveredRay === ray.maRay && draggedSchedule && !isBlocked && (
                                                <div style={{
                                                    position: 'absolute', inset: '3px',
                                                    border: '2px dashed var(--navy-400)',
                                                    borderRadius: '8px', pointerEvents: 'none',
                                                    background: 'rgba(59,85,149,0.05)'
                                                }} />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tooltip bottom */}
            {tooltipSchedule && (
                <div style={{
                    position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
                    background: 'rgba(17,24,39,0.95)', color: 'white', padding: '8px 20px',
                    borderRadius: '10px', fontSize: '12px', zIndex: 9999,
                    display: 'flex', gap: '20px', alignItems: 'center',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)', whiteSpace: 'nowrap'
                }}>
                    <span>🚂 <strong>{tooltipSchedule.maChuyenTau}</strong></span>
                    <span>📋 {tooltipSchedule.maLichTrinh}</span>
                    <span>🛤 Ray: {tooltipSchedule.maRay || '—'}</span>
                    <span>🕐 {formatTime(tooltipSchedule.gioDenDuKien)} → {formatTime(tooltipSchedule.gioDiDuKien)}</span>
                    {tooltipSchedule.soPhutTre > 0 &&
                        <span style={{ color: '#FCA5A5' }}>⏱ Trễ {tooltipSchedule.soPhutTre}p</span>}
                </div>
            )}
        </>
    );
}
