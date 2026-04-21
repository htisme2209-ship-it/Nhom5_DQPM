import { useState, useEffect } from 'react';
import { chuyenTauAPI, duongRayAPI, lichTrinhAPI } from '../../services/api';
import { optimizeSchedule } from '../../utils/scheduleOptimizer';
import SimulationGanttChart from '../../components/simulation/SimulationGanttChart';
import SimulationImpactPanel from '../../components/simulation/SimulationImpactPanel';
import SimulationConflictPanel from '../../components/simulation/SimulationConflictPanel';
import SimulationChangesLog from '../../components/simulation/SimulationChangesLog';

/**
 * Mô Phỏng Lịch Trình - Full Layout
 * Sidebar + Gantt Chart + 3 Bottom Panels
 */
export default function MoPhongLichTrinhPage() {
    const [chuyenTau, setChuyenTau] = useState([]);
    const [duongRay, setDuongRay] = useState([]);
    const [draftSchedules, setDraftSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [timeRange, setTimeRange] = useState({ start: '06:00', end: '23:00' });
    const [conflicts, setConflicts] = useState([]);
    const [impacts, setImpacts] = useState({ networkDelay: 0, trackUtilization: 0, arrivals: 0, departures: 0 });
    const [changes, setChanges] = useState([]);

    useEffect(() => {
        fetchData();
    }, [selectedDate]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [ctRes, rayRes, ltRes] = await Promise.all([
                chuyenTauAPI.getAll({ ngay: selectedDate }),
                duongRayAPI.getAll(),
                lichTrinhAPI.getAll({ ngay: selectedDate })   // lấy lịch trình đã có trong ngày
            ]);

            if (ctRes.data?.success && rayRes.data?.success) {
                const allChuyenTau   = ctRes.data.data  || [];
                const allDuongRay    = rayRes.data.data  || [];
                const existingLt     = ltRes.data?.data  || [];

                // Tập mã chuyến tàu đã có lịch trình (bất kể trạng thái)
                const daCoLichTrinh = new Set(existingLt.map(lt => lt.maChuyenTau));

                // Chỉ giữ những chuyến tàu chưa được xếp lịch
                const chuaCoLich = allChuyenTau.filter(ct => !daCoLichTrinh.has(ct.maChuyenTau));

                setChuyenTau(chuaCoLich);
                setDuongRay(allDuongRay);
                setDraftSchedules([]);

                console.info(
                    `[MoPhong] Ngày ${selectedDate}: ${allChuyenTau.length} chuyến tàu,`,
                    `${existingLt.length} đã có lịch trình,`,
                    `${chuaCoLich.length} chưa xếp lịch`
                );
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAutoOptimize = () => {
        try {
            console.log('Starting optimization...', { chuyenTau, duongRay });

            if (!chuyenTau || chuyenTau.length === 0) {
                alert('Không có chuyến tàu nào để tối ưu!');
                return;
            }

            if (!duongRay || duongRay.length === 0) {
                alert('Không có đường ray nào!');
                return;
            }

            // Log sample train data
            console.log('Sample train data:', chuyenTau[0]);

            const result = optimizeSchedule(chuyenTau, duongRay);
            console.log('Optimization result:', result);

            if (!result || !result.success) {
                alert('Lỗi: Không có kết quả tối ưu');
                return;
            }

            // Lưu kết quả tạm thời và hiển thị trên Gantt Chart
            const optimized = result.success.map(s => ({
                id: `draft-${s.maChuyenTau}`,
                ...s,
                status: 'assigned'
            }));

            console.log('Optimized schedules:', optimized);

            setDraftSchedules(optimized);
            detectConflicts(optimized);
            calculateImpacts(optimized);

            setChanges([{
                time: new Date(),
                action: 'AUTO_OPTIMIZE',
                message: `Đã tối ưu ${result.success.length}/${chuyenTau.length} chuyến tàu`,
                type: 'success'
            }, ...changes]);

            // Hiển thị thông báo kết quả
            if (result.failed.length > 0) {
                alert(`✅ Đã tối ưu ${result.success.length}/${chuyenTau.length} chuyến tàu\n⚠️ ${result.failed.length} chuyến không thể sắp xếp`);
            } else {
                alert(`✅ Đã tối ưu thành công ${result.success.length}/${chuyenTau.length} chuyến tàu!`);
            }

        } catch (error) {
            console.error('Error in handleAutoOptimize:', error);
            alert('Lỗi khi tối ưu: ' + error.message);
        }
    };

    const detectConflicts = (schedules) => {
        const detected = [];
        schedules.forEach((s1, i) => {
            schedules.slice(i + 1).forEach(s2 => {
                if (s1.maRay === s2.maRay) {
                    const overlap = checkTimeOverlap(s1, s2);
                    if (overlap) {
                        detected.push({
                            id: `conflict-${i}`,
                            severity: 'HIGH',
                            trains: [s1.maChuyenTau, s2.maChuyenTau],
                            type: 'TRACK_OVERLAP',
                            track: s1.maRay,
                            suggestion: `Dời ${s2.maChuyenTau} sang ray khác`
                        });
                    }
                }
            });
        });
        setConflicts(detected);
    };

    const checkTimeOverlap = (s1, s2) => {
        const start1 = new Date(`2000-01-01T${s1.gioDenDuKien}`);
        const end1 = new Date(`2000-01-01T${s1.gioDiDuKien}`);
        const start2 = new Date(`2000-01-01T${s2.gioDenDuKien}`);
        const end2 = new Date(`2000-01-01T${s2.gioDiDuKien}`);
        return !(end1 <= start2 || end2 <= start1);
    };

    const calculateImpacts = (schedules) => {
        setImpacts({
            networkDelay: (schedules.length * 0.5).toFixed(1),
            trackUtilization: ((schedules.length / chuyenTau.length) * 100).toFixed(1),
            arrivals: schedules.filter(s => s.vaiTroTaiDaNang !== 'XUAT_PHAT').length,
            departures: schedules.filter(s => s.vaiTroTaiDaNang === 'XUAT_PHAT').length
        });
    };

    const handleScheduleDrag = (scheduleId, newTrack) => {
        setDraftSchedules(prev => {
            const updated = prev.map(s =>
                s.id === scheduleId ? { ...s, maRay: newTrack, status: 'modified' } : s
            );
            detectConflicts(updated);
            calculateImpacts(updated);
            return updated;
        });

        setChanges([{
            time: new Date(),
            action: 'MANUAL_CHANGE',
            message: `Đã di chuyển tàu sang ${newTrack}`,
            type: 'info'
        }, ...changes]);
    };

    const handleApply = async () => {
        if (conflicts.length > 0 && !window.confirm('Vẫn còn xung đột. Tiếp tục?')) return;

        /**
         * Backend field gioDenDuKien/gioDiDuKien là LocalDateTime.
         * Cần ghép: selectedDate ("2026-04-21") + timeStr ("22:30") → "2026-04-21T22:30:00"
         */
        const toLocalDateTime = (dateStr, timeStr) => {
            if (!dateStr || !timeStr) return null;
            const timePart = timeStr.length === 5 ? `${timeStr}:00` : timeStr;
            return `${dateStr}T${timePart}`;
        };

        try {
            const ts = Date.now();
            const promises = draftSchedules.map((s, idx) => {
                // Cột ma_lich_trinh tối đa 20 ký tự
                // Dùng 6 số cuối của timestamp + idx để đảm bảo unique mà không vượt giới hạn
                const shortTs = String(ts).slice(-6);
                const rawId = `LT-${s.maChuyenTau}-${shortTs}${idx}`;
                const maLichTrinh = rawId.slice(0, 20); // đảm bảo ≤ 20 ký tự

                return lichTrinhAPI.create({
                    maLichTrinh,
                    maChuyenTau: s.maChuyenTau,
                    maRay: s.maRay,
                    ngayChay: selectedDate,
                    gioDenDuKien: toLocalDateTime(selectedDate, s.gioDenDuKien),
                    gioDiDuKien: toLocalDateTime(selectedDate, s.gioDiDuKien),
                    trangThai: 'CHO_XAC_NHAN',
                    soPhutTre: 0
                });
            });

            await Promise.all(promises);
            alert(`✅ Đã áp dụng ${draftSchedules.length} lịch trình!`);
            window.location.href = '/dieu-hanh/lich-trinh';
        } catch (error) {
            alert('Lỗi khi áp dụng lịch trình: ' + error.message);
        }
    };

    if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>⏳ Đang tải...</div>;

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 56px)', background: 'var(--gray-50)', margin: '-24px', overflow: 'hidden' }}>
            {/* LEFT SIDEBAR */}
            <div style={{ width: '300px', background: 'white', borderRight: '2px solid var(--gray-200)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '20px', borderBottom: '2px solid var(--gray-200)', background: 'var(--navy-600)', color: 'white' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>🚂 Chưa Xếp Lịch Trình</h3>
                    <div style={{ fontSize: '13px', opacity: 0.9 }}>
                        {chuyenTau.length === 0
                            ? '✅ Tất cả chuyến đã có lịch'
                            : `${chuyenTau.length} chuyến chờ sắp xếp`}
                    </div>
                </div>

                <div style={{ padding: '16px', borderBottom: '1px solid var(--gray-200)' }}>
                    <button
                        className="btn btn-primary"
                        onClick={handleAutoOptimize}
                        disabled={chuyenTau.length === 0}
                        style={{ width: '100%', height: '44px', fontWeight: 700 }}
                    >
                        🤖 Tối Ưu Tự Động
                    </button>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
                    {chuyenTau.length === 0 ? (
                        <div style={{
                            padding: '24px 16px',
                            textAlign: 'center',
                            color: 'var(--gray-500)'
                        }}>
                            <div style={{ fontSize: '32px', marginBottom: '12px' }}>✅</div>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--green-700)', marginBottom: '6px' }}>
                                Tất cả chuyến tàu đã có lịch trình
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--gray-400)' }}>
                                Không còn chuyến nào cần sắp xếp trong ngày {selectedDate}
                            </div>
                        </div>
                    ) : (
                        chuyenTau.map(train => {
                            const draft = draftSchedules.find(d => d.maChuyenTau === train.maChuyenTau);
                            const role  = train.vaiTroTaiDaNang;

                            // Nhãn loại tàu
                            const roleLabel = role === 'XUAT_PHAT'  ? { text: 'Xuất phát', color: 'var(--navy-600)' }
                                           : role === 'DIEM_CUOI'   ? { text: 'Điểm cuối', color: 'var(--green-700)' }
                                           : { text: 'Trung gian',  color: 'var(--green-600)' };

                            // Hiển thị giờ đúng theo loại tàu
                            let timeInfo;
                            if (role === 'XUAT_PHAT') {
                                timeInfo = `⬅️ Khởi hành: ${train.gioDiDuKien || 'N/A'}`;
                            } else if (role === 'DIEM_CUOI') {
                                timeInfo = `➡️ Đến: ${train.gioDenDuKien || 'N/A'}`;
                            } else {
                                timeInfo = `${train.gioDenDuKien || 'N/A'} → ${train.gioDiDuKien || 'N/A'}`;
                            }

                            return (
                                <div key={train.maChuyenTau} style={{
                                    padding: '10px 12px',
                                    marginBottom: '8px',
                                    background: draft?.maRay ? 'var(--green-50)' : 'var(--gray-50)',
                                    border: `2px solid ${draft?.maRay ? 'var(--green-300)' : 'var(--gray-200)'}`,
                                    borderRadius: 'var(--radius)',
                                    cursor: 'default'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy-800)' }}>
                                            {train.maChuyenTau}
                                        </div>
                                        <span style={{
                                            fontSize: '10px',
                                            fontWeight: 600,
                                            padding: '2px 7px',
                                            borderRadius: '10px',
                                            background: draft?.maRay ? 'var(--green-100)' : 'var(--gray-100)',
                                            color: draft?.maRay ? 'var(--green-700)' : roleLabel.color,
                                            border: `1px solid ${draft?.maRay ? 'var(--green-300)' : 'var(--gray-200)'}`
                                        }}>
                                            {draft?.maRay ? `✓ ${draft.maRay}` : roleLabel.text}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '11px', color: 'var(--gray-500)' }}>
                                        {timeInfo}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <div style={{ padding: '16px', borderTop: '2px solid var(--gray-200)' }}>
                    <button className="btn btn-primary btn-lg" onClick={handleApply} disabled={draftSchedules.length === 0} style={{ width: '100%', height: '48px', fontWeight: 700 }}>
                        ⚡ Áp Dụng Lịch Trình
                    </button>
                    <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--gray-600)', textAlign: 'center' }}>
                        {draftSchedules.length}/{chuyenTau.length} đã sắp xếp
                    </div>
                </div>
            </div>

            {/* RIGHT CONTENT */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                {/* TOP BAR */}
                <div style={{ padding: '16px 24px', background: 'white', borderBottom: '2px solid var(--gray-200)', display: 'flex', gap: '24px' }}>
                    <div style={{ padding: '8px 16px', background: 'var(--orange-50)', border: '1px solid var(--orange-300)', borderRadius: 'var(--radius)', fontSize: '13px', fontWeight: 700, color: 'var(--orange-700)' }}>
                        📝 Chế độ mô phỏng
                    </div>
                    <div>
                        <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--gray-600)', display: 'block', marginBottom: '4px' }}>NGÀY</label>
                        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="form-control" style={{ width: '160px', height: '36px' }} />
                    </div>
                    <div>
                        <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--gray-600)', display: 'block', marginBottom: '4px' }}>THỜI GIAN</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <input type="time" value={timeRange.start} onChange={(e) => setTimeRange({ ...timeRange, start: e.target.value })} className="form-control" style={{ width: '100px', height: '36px' }} />
                            <span>—</span>
                            <input type="time" value={timeRange.end} onChange={(e) => setTimeRange({ ...timeRange, end: e.target.value })} className="form-control" style={{ width: '100px', height: '36px' }} />
                        </div>
                    </div>
                </div>

                {/* GANTT CHART - Scrollable Container */}
                <div style={{
                    flex: 1,
                    overflow: 'hidden',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    minWidth: 0
                }}>
                    <SimulationGanttChart
                        schedules={draftSchedules}
                        tracks={duongRay}
                        timeRange={timeRange}
                        conflicts={conflicts}
                        onScheduleDrag={handleScheduleDrag}
                    />
                </div>

                {/* BOTTOM PANELS */}
                <div style={{ height: '280px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', padding: '16px', background: 'var(--gray-50)', borderTop: '2px solid var(--gray-200)' }}>
                    <SimulationImpactPanel impacts={impacts} />
                    <SimulationConflictPanel conflicts={conflicts} />
                    <SimulationChangesLog changes={changes} />
                </div>
            </div>
        </div>
    );
}
