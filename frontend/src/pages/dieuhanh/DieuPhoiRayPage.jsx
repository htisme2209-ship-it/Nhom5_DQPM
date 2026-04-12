import { useState, useEffect, useRef } from 'react';
import { duongRayAPI, lichTrinhAPI, chuyenTauAPI } from '../../services/api';
import { HOUR_WIDTH, TOTAL_WIDTH, generateTimeSlots, getPxPos, getPxWidth, formatTime } from '../../utils/timeUtils';

export default function DieuPhoiRayPage() {
    const [duongRay, setDuongRay] = useState([]);
    const [lichTrinh, setLichTrinh] = useState([]);
    const [chuyenTau, setChuyenTau] = useState([]);
    const [unassignedSchedules, setUnassignedSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [toast, setToast] = useState(null);
    const [draggedSchedule, setDraggedSchedule] = useState(null);
    const [hoveredRay, setHoveredRay] = useState(null);

    const ganttScrollRef = useRef(null);
    const timeSlots = generateTimeSlots();

    useEffect(() => {
        loadData();
    }, [selectedDate]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [rayRes, ltRes, ctRes] = await Promise.all([
                duongRayAPI.getAll(),
                lichTrinhAPI.getAll({ ngay: selectedDate }),
                chuyenTauAPI.getAll()
            ]);

            const rays = rayRes.data.data || rayRes.data || [];
            const schedules = ltRes.data.data || ltRes.data || [];
            const trains = ctRes.data.data || ctRes.data || [];

            setDuongRay(rays);
            setLichTrinh(schedules);
            setChuyenTau(trains);

            const unassigned = schedules.filter(lt => !lt.maRay || lt.trangThai === 'CHO_XAC_NHAN');
            setUnassignedSchedules(unassigned);
        } catch (e) {
            console.error(e);
            showToast('Lỗi khi tải dữ liệu', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showToast = (msg, type = 'success') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    const checkConflict = (schedule, targetRay) => {
        const raySchedules = lichTrinh.filter(
            lt => lt.maRay === targetRay && lt.maLichTrinh !== schedule.maLichTrinh
        );

        const newStart = new Date(schedule.gioDenDuKien);
        const newEnd = new Date(schedule.gioDiDuKien);

        for (const existing of raySchedules) {
            const existStart = new Date(existing.gioDenDuKien);
            const existEnd = new Date(existing.gioDiDuKien);
            if (newStart < existEnd && existStart < newEnd) {
                return { hasConflict: true, conflictWith: existing.maChuyenTau };
            }
        }
        return { hasConflict: false };
    };

    const handleDragStart = (schedule) => setDraggedSchedule(schedule);
    const handleDragOver = (e, rayId) => { e.preventDefault(); setHoveredRay(rayId); };
    const handleDragEnd = () => { setDraggedSchedule(null); setHoveredRay(null); };

    const handleDrop = async (e, rayId) => {
        e.preventDefault();
        setHoveredRay(null);
        if (!draggedSchedule) return;

        const ray = duongRay.find(r => r.maRay === rayId);
        if (ray.trangThai === 'PHONG_TOA_TAM' || ray.trangThai === 'PHONG_TOA_CUNG') {
            showToast(`Ray ${ray.soRay} đang bị phong tỏa`, 'error');
            setDraggedSchedule(null);
            return;
        }

        const conflict = checkConflict(draggedSchedule, rayId);
        if (conflict.hasConflict) {
            showToast(`Xung đột với tàu ${conflict.conflictWith}`, 'error');
            setDraggedSchedule(null);
            return;
        }

        try {
            await lichTrinhAPI.update(draggedSchedule.maLichTrinh, {
                ...draggedSchedule,
                maRay: rayId,
                trangThai: 'DA_XAC_NHAN'
            });
            showToast(`Đã phân bổ ${draggedSchedule.maChuyenTau} vào Ray ${ray.soRay}`);
            loadData();
        } catch (e) {
            showToast('Lỗi khi phân bổ ray', 'error');
        }
        setDraggedSchedule(null);
    };

    const getTrainTypeColor = (vaiTro) => {
        const colors = {
            'TRUNG_GIAN': { bg: '#E8F5E9', border: '#4CAF50', text: '#2E7D32' },
            'XUAT_PHAT': { bg: '#FFF3E0', border: '#FF9800', text: '#E65100' },
            'DIEM_CUOI': { bg: '#F3E5F5', border: '#9C27B0', text: '#6A1B9A' }
        };
        return colors[vaiTro] || colors['TRUNG_GIAN'];
    };

    const getTrainTypeLabel = (vaiTro) => {
        const labels = {
            'TRUNG_GIAN': 'TRUNG GIAN',
            'XUAT_PHAT': 'XUẤT PHÁT',
            'DIEM_CUOI': 'ĐIỂM CUỐI'
        };
        return labels[vaiTro] || vaiTro;
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

            <div className="page-header">
                <div className="page-header-actions">
                    <div>
                        <p style={{ fontSize: '11px', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                            ĐIỀU PHỐI ĐƯỜNG RAY
                        </p>
                        <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '4px' }}>Điều phối Đường ray</h1>
                        <p style={{ fontSize: '13px', color: '#6B7280' }}>Ga Đà Nẵng (DAD) • Hôm nay, 24 tháng 10</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn btn-primary">Dùng thời gian</button>
                        <button className="btn btn-secondary">Lưới</button>
                        <button className="btn btn-secondary">⚙️ Bộ lọc</button>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', height: 'calc(100vh - 220px)' }}>
                {/* Sidebar */}
                <div style={{ width: '340px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ background: 'white', borderRadius: '8px', padding: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                        <div style={{ fontSize: '11px', color: '#6B7280', fontWeight: 600, marginBottom: '4px' }}>CHỜ PHÂN BỔ</div>
                        <div style={{ fontSize: '12px', color: '#9CA3AF' }}>Kéo thả vào đường ray</div>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {unassignedSchedules.map(schedule => {
                            const train = chuyenTau.find(ct => ct.maChuyenTau === schedule.maChuyenTau);
                            const colors = getTrainTypeColor(train?.vaiTroTaiDaNang);

                            return (
                                <div
                                    key={schedule.maLichTrinh}
                                    draggable
                                    onDragStart={() => handleDragStart(schedule)}
                                    onDragEnd={handleDragEnd}
                                    style={{
                                        background: 'white',
                                        borderRadius: '8px',
                                        padding: '14px',
                                        cursor: 'grab',
                                        borderLeft: `4px solid ${colors.border}`,
                                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                        opacity: draggedSchedule?.maLichTrinh === schedule.maLichTrinh ? 0.5 : 1
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <div style={{ fontSize: '18px', fontWeight: 700 }}>{schedule.maChuyenTau}</div>
                                        <div style={{ fontSize: '16px', color: '#D1D5DB' }}>⋮</div>
                                    </div>
                                    <div style={{ fontSize: '10px', color: colors.text, fontWeight: 700, marginBottom: '8px' }}>
                                        {getTrainTypeLabel(train?.vaiTroTaiDaNang)}
                                    </div>
                                    <div style={{ fontSize: '13px', color: '#6B7280' }}>
                                        {formatTime(schedule.gioDenDuKien)} - {formatTime(schedule.gioDiDuKien)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Gantt Chart */}
                <div style={{ flex: 1, background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ padding: '16px 20px', borderBottom: '1px solid #E5E7EB', fontSize: '13px', fontWeight: 600 }}>
                        TUYẾN / ĐƯỜNG RAY
                    </div>

                    <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                        <div style={{ width: '180px', flexShrink: 0, borderRight: '1px solid #E5E7EB' }}>
                            <div style={{ height: '48px', borderBottom: '2px solid #E5E7EB', background: '#F9FAFB' }} />
                            {duongRay.map(ray => (
                                <div
                                    key={ray.maRay}
                                    onDragOver={(e) => handleDragOver(e, ray.maRay)}
                                    onDrop={(e) => handleDrop(e, ray.maRay)}
                                    style={{
                                        height: '100px',
                                        padding: '20px',
                                        borderBottom: '1px solid #E5E7EB',
                                        background: hoveredRay === ray.maRay ? '#EFF6FF' : 'transparent'
                                    }}
                                >
                                    <div style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>Đường ray 0{ray.soRay}</div>
                                    <div style={{ fontSize: '11px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <span style={{ fontSize: '8px', color: '#10B981' }}>●</span>
                                        {ray.trangThai === 'SAN_SANG' && 'SẴN SÀNG'}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div ref={ganttScrollRef} style={{ flex: 1, overflowX: 'auto' }}>
                            <div style={{ minWidth: `${TOTAL_WIDTH}px` }}>
                                <div style={{ display: 'flex', height: '48px', borderBottom: '2px solid #E5E7EB', background: '#F9FAFB' }}>
                                    {timeSlots.map((slot, i) => (
                                        <div key={i} style={{ flex: `0 0 ${HOUR_WIDTH}px`, textAlign: 'center', fontSize: '11px', fontWeight: 600, color: '#6B7280', padding: '16px 0', borderLeft: i > 0 ? '1px solid #E5E7EB' : 'none' }}>
                                            {slot.substring(0, 5)}
                                        </div>
                                    ))}
                                </div>

                                {duongRay.map((ray, rayIndex) => {
                                    const raySchedules = lichTrinh.filter(lt => lt.maRay === ray.maRay);
                                    const isMaintenanceRay = rayIndex === 1;

                                    return (
                                        <div
                                            key={ray.maRay}
                                            onDragOver={(e) => handleDragOver(e, ray.maRay)}
                                            onDrop={(e) => handleDrop(e, ray.maRay)}
                                            style={{
                                                height: '100px',
                                                position: 'relative',
                                                borderBottom: '1px solid #E5E7EB',
                                                background: isMaintenanceRay ? 'repeating-linear-gradient(45deg, #F9FAFB, #F9FAFB 10px, #F3F4F6 10px, #F3F4F6 20px)' : 'white'
                                            }}
                                        >
                                            {timeSlots.map((_, i) => (
                                                <div key={i} style={{ position: 'absolute', left: `${i * HOUR_WIDTH}px`, top: 0, bottom: 0, width: '1px', background: '#E5E7EB' }} />
                                            ))}

                                            {raySchedules.map(lt => {
                                                if (!lt.gioDenDuKien || !lt.gioDiDuKien) return null;
                                                const leftPx = getPxPos(formatTime(lt.gioDenDuKien));
                                                const widthPx = Math.max(80, getPxWidth(formatTime(lt.gioDenDuKien), formatTime(lt.gioDiDuKien)));
                                                const train = chuyenTau.find(ct => ct.maChuyenTau === lt.maChuyenTau);
                                                const colors = getTrainTypeColor(train?.vaiTroTaiDaNang);
                                                const hasConflict = lt.soPhutTre > 0;

                                                return (
                                                    <div
                                                        key={lt.maLichTrinh}
                                                        style={{
                                                            position: 'absolute',
                                                            left: `${leftPx}px`,
                                                            width: `${widthPx}px`,
                                                            top: '12px',
                                                            bottom: '12px',
                                                            borderRadius: '8px',
                                                            background: colors.bg,
                                                            border: hasConflict ? '3px dashed #EF4444' : `3px solid ${colors.border}`,
                                                            padding: '10px 12px',
                                                            fontSize: '13px',
                                                            fontWeight: 700,
                                                            color: colors.text,
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            justifyContent: 'center',
                                                            zIndex: 5,
                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                        }}
                                                    >
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                                            <span style={{ fontSize: '10px', color: colors.border }}>●</span>
                                                            <span>{lt.maChuyenTau}</span>
                                                            {hasConflict && <span style={{ fontSize: '12px', color: '#EF4444' }}>●</span>}
                                                        </div>
                                                        <div style={{ fontSize: '11px', opacity: 0.8 }}>
                                                            {formatTime(lt.gioDenDuKien)} - {formatTime(lt.gioDiDuKien)}
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                            {isMaintenanceRay && (
                                                <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', padding: '10px 20px', background: 'white', border: '2px solid #DC2626', borderRadius: '6px', fontSize: '12px', fontWeight: 600, color: '#DC2626', zIndex: 20, display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                                                    <span style={{ fontSize: '16px' }}>🔧</span>
                                                    LỊCH BẢO TRÌ ĐỊNH KỲ (08:00 - 18:00)
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
