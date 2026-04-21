/**
 * Schedule Optimizer - Thuật toán tự động sắp xếp lịch trình tối ưu
 *
 * Quy tắc theo từng loại tàu:
 * ─────────────────────────────────────────────────────────────────
 * TRUNG_GIAN (A→ĐN→B): Có giờ đến + giờ đi
 *   Cửa sổ chiếm ray = [giờ đến − 1 phút, giờ đi + 15 phút đệm]
 *
 * XUAT_PHAT (ĐN→B): Chỉ có giờ đi (giờ lên tàu = giờ đi − 30 phút)
 *   Cửa sổ chiếm ray = [giờ lên tàu, giờ đi + 15 phút đệm]
 *
 * DIEM_CUOI (A→ĐN): Chỉ có giờ đến (giờ rời ray = giờ đến + 15 phút)
 *   Cửa sổ chiếm ray = [giờ đến − 1 phút, giờ rời ray + 15 phút đệm]
 *
 * Quy tắc xuất phát toàn mạng:
 *   Các tàu XUAT_PHAT phải cách nhau ≥ 10 phút, BẤT KỂ ray nào
 * ─────────────────────────────────────────────────────────────────
 */

const BUFFER_MINUTES = 15;       // Buffer đệm sau khi tàu rời ray
const BOARDING_MINUTES = 30;     // Thời gian lên tàu trước khi xuất phát
const ARRIVAL_BUFFER = 1;        // 1 phút trước giờ đến để chuẩn bị ray
const MIN_DEPARTURE_GAP = 10;    // Khoảng cách tối thiểu giữa các tàu XUAT_PHAT (toàn mạng)

// ─────────────────────────────────────────────
// HELPER FUNCTIONS
// ─────────────────────────────────────────────

/**
 * Chuyển đổi "HH:mm" hoặc "HH:mm:ss" sang phút từ 00:00
 */
function timeToMinutes(timeStr) {
    if (!timeStr) return null;
    const parts = timeStr.split(':').map(Number);
    return parts[0] * 60 + parts[1];
}

/**
 * Chuyển đổi phút sang "HH:mm"
 */
function minutesToTime(mins) {
    if (mins == null) return null;
    // Xử lý qua ngày (> 1440 phút)
    const normalized = ((mins % 1440) + 1440) % 1440;
    const hours = Math.floor(normalized / 60);
    const minutes = normalized % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/**
 * Lấy thời gian đại diện để sắp xếp (giờ đến hoặc giờ lên tàu)
 * Tàu XUAT_PHAT: giờ lên tàu = giờ đi − 30 phút
 * Tàu DIEM_CUOI / TRUNG_GIAN: giờ đến
 */
function getEarliestTime(train) {
    if (train.vaiTroTaiDaNang === 'XUAT_PHAT') {
        // Không có giờ đến → tính từ giờ đi
        const depMins = timeToMinutes(train.gioDiDuKien);
        return depMins != null ? depMins - BOARDING_MINUTES : Infinity;
    }
    // DIEM_CUOI và TRUNG_GIAN đều có giờ đến
    const arrMins = timeToMinutes(train.gioDenDuKien);
    return arrMins != null ? arrMins : Infinity;
}

// ─────────────────────────────────────────────
// VALIDATE
// ─────────────────────────────────────────────

/**
 * Kiểm tra một chuyến tàu có dữ liệu thời gian hợp lệ không
 * theo đúng quy tắc từng loại
 */
function validateTrain(train) {
    const role = train.vaiTroTaiDaNang;

    if (role === 'XUAT_PHAT') {
        // Chỉ cần giờ đi
        if (!train.gioDiDuKien) {
            return { valid: false, reason: 'Tàu xuất phát thiếu giờ đi (gioDiDuKien)' };
        }
    } else if (role === 'DIEM_CUOI') {
        // Chỉ cần giờ đến
        if (!train.gioDenDuKien) {
            return { valid: false, reason: 'Tàu điểm cuối thiếu giờ đến (gioDenDuKien)' };
        }
    } else {
        // TRUNG_GIAN: cần cả hai
        if (!train.gioDenDuKien || !train.gioDiDuKien) {
            return {
                valid: false,
                reason: `Tàu trung gian thiếu ${!train.gioDenDuKien ? 'giờ đến' : 'giờ đi'}`
            };
        }
    }

    return { valid: true };
}

// ─────────────────────────────────────────────
// TRACK WINDOW (cửa sổ chiếm ray)
// ─────────────────────────────────────────────

/**
 * Tính cửa sổ chiếm ray [start, end] theo phút từ 00:00
 *
 * XUAT_PHAT:   start = giờ đi − BOARDING_MINUTES,  end = giờ đi + BUFFER_MINUTES
 * DIEM_CUOI:   start = giờ đến − ARRIVAL_BUFFER,   end = giờ đến + BUFFER_MINUTES * 2
 *   (tàu đến → dừng 15 phút → rời ray → +15 phút đệm)
 * TRUNG_GIAN:  start = giờ đến − ARRIVAL_BUFFER,   end = giờ đi + BUFFER_MINUTES
 */
function calculateTrackWindow(train) {
    const role = train.vaiTroTaiDaNang;

    if (role === 'XUAT_PHAT') {
        const depMins = timeToMinutes(train.gioDiDuKien);
        if (depMins == null) return null;
        return {
            start: depMins - BOARDING_MINUTES,
            end: depMins + BUFFER_MINUTES
        };
    }

    if (role === 'DIEM_CUOI') {
        const arrMins = timeToMinutes(train.gioDenDuKien);
        if (arrMins == null) return null;
        // Rời ray = giờ đến + 15 phút; cộng thêm BUFFER_MINUTES đệm sau khi rời
        const leaveTrackMins = arrMins + BUFFER_MINUTES;
        return {
            start: arrMins - ARRIVAL_BUFFER,
            end: leaveTrackMins + BUFFER_MINUTES
        };
    }

    // TRUNG_GIAN (mặc định)
    const arrMins = timeToMinutes(train.gioDenDuKien);
    const depMins = timeToMinutes(train.gioDiDuKien);
    if (arrMins == null || depMins == null) return null;
    return {
        start: arrMins - ARRIVAL_BUFFER,
        end: depMins + BUFFER_MINUTES
    };
}

// ─────────────────────────────────────────────
// CONFLICT CHECKS
// ─────────────────────────────────────────────

/**
 * Kiểm tra 2 cửa sổ thời gian có chồng lên nhau không
 */
function hasWindowConflict(w1, w2) {
    if (!w1 || !w2) return false;
    return !(w1.end <= w2.start || w2.end <= w1.start);
}

/**
 * Kiểm tra xung đột giờ xuất phát toàn mạng (chỉ áp dụng cho XUAT_PHAT)
 * Tàu XUAT_PHAT mới không được xuất phát trong vòng ±10 phút với BẤT KỲ XUAT_PHAT nào đã xếp lịch
 *
 * @param {object} train - chuyến tàu cần kiểm tra
 * @param {Array} assignedSchedules - danh sách đã được xếp
 * @returns {object|null} thông tin xung đột nếu có
 */
function findDepartureConflict(train, assignedSchedules) {
    if (train.vaiTroTaiDaNang !== 'XUAT_PHAT') return null;

    const trainDep = timeToMinutes(train.gioDiDuKien);
    if (trainDep == null) return null;

    for (const s of assignedSchedules) {
        if (s.vaiTroTaiDaNang !== 'XUAT_PHAT') continue;
        const sDep = timeToMinutes(s.gioDiDuKien);
        if (sDep == null) continue;

        const gap = Math.abs(trainDep - sDep);
        if (gap < MIN_DEPARTURE_GAP) {
            return { conflictWith: s.maChuyenTau, gap, existingDep: s.gioDiDuKien };
        }
    }

    return null;
}

/**
 * Dời giờ đi của XUAT_PHAT để tránh xung đột 10 phút
 * Chiến lược: tăng dần 10 phút mỗi lần cho đến khi tìm được slot trống
 */
function resolveDepartureConflict(train, assignedSchedules) {
    if (train.vaiTroTaiDaNang !== 'XUAT_PHAT') return train;

    let adjusted = { ...train };
    let attempts = 0;
    const MAX_ATTEMPTS = 60; // Tránh vòng lặp vô hạn (60 × 10 phút = 10 giờ tìm kiếm)

    while (findDepartureConflict(adjusted, assignedSchedules) && attempts < MAX_ATTEMPTS) {
        const depMins = timeToMinutes(adjusted.gioDiDuKien);
        const newDep = depMins + MIN_DEPARTURE_GAP;
        adjusted = {
            ...adjusted,
            gioDiDuKien: minutesToTime(newDep)
            // gioDenDuKien của XUAT_PHAT không tồn tại trong dữ liệu thực,
            // nó chỉ được tính toán khi render Gantt (giờ đi − 30 phút)
        };
        attempts++;
    }

    if (attempts >= MAX_ATTEMPTS) return null; // Không thể giải quyết
    return adjusted;
}

// ─────────────────────────────────────────────
// TRACK ASSIGNMENT
// ─────────────────────────────────────────────

/**
 * Tìm ray trống phù hợp cho một chuyến tàu
 */
function findAvailableTrack(train, assignedSchedules, tracks) {
    const trainWindow = calculateTrackWindow(train);
    if (!trainWindow) return null;

    for (const track of tracks) {
        const trackSchedules = assignedSchedules.filter(s => s.maRay === track.maRay);

        let hasConflict = false;
        for (const s of trackSchedules) {
            const sw = calculateTrackWindow(s);
            if (hasWindowConflict(trainWindow, sw)) {
                hasConflict = true;
                break;
            }
        }

        if (!hasConflict) {
            return track.maRay;
        }
    }

    return null;
}

// ─────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────

/**
 * Thuật toán chính: Tự động sắp xếp lịch trình tối ưu
 *
 * @param {Array} trains  - Danh sách chuyến tàu (ChuyenTau entities)
 * @param {Array} tracks  - Danh sách đường ray (DuongRay entities)
 * @returns {{ success, failed, warnings, stats }}
 */
export function optimizeSchedule(trains, tracks) {
    const result = {
        success: [],
        failed: [],
        warnings: [],
        stats: {
            total: trains.length,
            assigned: 0,
            failed: 0,
            adjusted: 0
        }
    };

    if (!trains || trains.length === 0) return result;
    if (!tracks || tracks.length === 0) {
        result.failed = trains.map(t => ({
            train: t.maChuyenTau,
            reason: 'Không có đường ray nào trong hệ thống'
        }));
        result.stats.failed = trains.length;
        return result;
    }

    // Sắp xếp: ưu tiên tàu đến sớm nhất (XUAT_PHAT tính từ giờ lên tàu)
    const sortedTrains = [...trains].sort((a, b) => {
        return getEarliestTime(a) - getEarliestTime(b);
    });

    const assignedSchedules = [];

    for (let train of sortedTrains) {
        // ── Bước 1: Validate dữ liệu đầu vào ──
        const validation = validateTrain(train);
        if (!validation.valid) {
            console.warn(`[Optimizer] Skip train ${train.maChuyenTau}:`, validation.reason);
            result.failed.push({
                train: train.maChuyenTau,
                reason: validation.reason,
                role: train.vaiTroTaiDaNang,
                time: `Đến: ${train.gioDenDuKien || 'N/A'} | Đi: ${train.gioDiDuKien || 'N/A'}`
            });
            result.stats.failed++;
            continue;
        }

        // ── Bước 2: Giải quyết xung đột giờ xuất phát (chỉ XUAT_PHAT) ──
        const originalDep = train.gioDiDuKien;
        if (train.vaiTroTaiDaNang === 'XUAT_PHAT') {
            const resolved = resolveDepartureConflict(train, assignedSchedules);

            if (!resolved) {
                // Không tìm được slot xuất phát hợp lệ
                result.failed.push({
                    train: train.maChuyenTau,
                    reason: 'Không thể xếp lịch: Không còn slot xuất phát nào khả dụng trong ngày',
                    role: train.vaiTroTaiDaNang,
                    time: `Đi dự kiến: ${originalDep}`
                });
                result.stats.failed++;
                continue;
            }

            if (resolved.gioDiDuKien !== originalDep) {
                result.stats.adjusted++;
                result.warnings.push({
                    train: train.maChuyenTau,
                    message: `Dời giờ xuất phát từ ${originalDep} → ${resolved.gioDiDuKien} (tránh xung đột ≤ 10 phút với tàu khác)`
                });
                console.info(`[Optimizer] Adjusted departure ${train.maChuyenTau}: ${originalDep} → ${resolved.gioDiDuKien}`);
            }

            train = resolved;
        }

        // ── Bước 3: Tìm ray trống ──
        const assignedTrack = findAvailableTrack(train, assignedSchedules, tracks);

        if (assignedTrack) {
            const schedule = {
                maLichTrinh: `LT-${train.maChuyenTau}-${Date.now()}`,
                maChuyenTau: train.maChuyenTau,
                maRay: assignedTrack,
                ngayChay: train.ngayChay,
                // Giữ đúng dữ liệu theo loại tàu:
                gioDenDuKien: train.vaiTroTaiDaNang !== 'XUAT_PHAT' ? train.gioDenDuKien : null,
                gioDiDuKien: train.vaiTroTaiDaNang !== 'DIEM_CUOI' ? train.gioDiDuKien : null,
                vaiTroTaiDaNang: train.vaiTroTaiDaNang,
                trangThai: 'CHO_XAC_NHAN',
                soPhutTre: 0
            };

            assignedSchedules.push(schedule);
            result.success.push(schedule);
            result.stats.assigned++;

            console.info(
                `[Optimizer] ✓ ${train.maChuyenTau} (${train.vaiTroTaiDaNang}) → Ray ${assignedTrack}`,
                `| Đến: ${schedule.gioDenDuKien || '—'} | Đi: ${schedule.gioDiDuKien || '—'}`
            );
        } else {
            result.failed.push({
                train: train.maChuyenTau,
                reason: 'Không tìm thấy ray trống trong khung giờ này',
                role: train.vaiTroTaiDaNang,
                time: `Đến: ${train.gioDenDuKien || '—'} | Đi: ${train.gioDiDuKien || '—'}`
            });
            result.stats.failed++;
            console.warn(`[Optimizer] ✗ ${train.maChuyenTau}: no available track`);
        }
    }

    console.info(
        `[Optimizer] Done: ${result.stats.assigned}/${result.stats.total} assigned,`,
        `${result.stats.adjusted} adjusted, ${result.stats.failed} failed`
    );

    return result;
}

// ─────────────────────────────────────────────
// SCORING & REPORTING
// ─────────────────────────────────────────────

/**
 * Tính toán điểm tối ưu cho một phương án sắp xếp
 */
export function calculateOptimizationScore(schedules, tracks) {
    let score = 100;

    // Penalty cho ray không được sử dụng
    const usedTracks = new Set(schedules.map(s => s.maRay));
    const unusedTracks = tracks.length - usedTracks.size;
    score -= unusedTracks * 5;

    // Penalty cho khoảng trống lớn giữa các chuyến trên cùng ray
    const trackUsage = {};
    tracks.forEach(t => trackUsage[t.maRay] = []);

    schedules.forEach(s => {
        const window = calculateTrackWindow(s);
        if (window && trackUsage[s.maRay]) {
            trackUsage[s.maRay].push(window);
        }
    });

    Object.values(trackUsage).forEach(windows => {
        windows.sort((a, b) => a.start - b.start);
        for (let i = 1; i < windows.length; i++) {
            const gap = windows[i].start - windows[i - 1].end;
            if (gap > 60) score -= 2; // Khoảng trống > 1 giờ
        }
    });

    return Math.max(0, score);
}

/**
 * Tạo báo cáo tối ưu hóa
 */
export function generateOptimizationReport(result, tracks) {
    try {
        if (!result || !result.success || !result.stats) {
            throw new Error('Invalid result structure');
        }
        if (!tracks || tracks.length === 0) {
            throw new Error('No tracks provided');
        }

        const score = calculateOptimizationScore(result.success, tracks);

        return {
            score,
            summary: {
                total: result.stats.total || 0,
                assigned: result.stats.assigned || 0,
                failed: result.stats.failed || 0,
                adjusted: result.stats.adjusted || 0,
                successRate: result.stats.total > 0
                    ? ((result.stats.assigned / result.stats.total) * 100).toFixed(1)
                    : '0.0'
            },
            trackUsage: calculateTrackUsage(result.success, tracks),
            warnings: result.warnings || [],
            failures: result.failed || []
        };
    } catch (error) {
        console.error('[Optimizer] Error generating report:', error);
        throw error;
    }
}

/**
 * Tính toán mức độ sử dụng ray
 */
function calculateTrackUsage(schedules, tracks) {
    const usage = {};

    tracks.forEach(track => {
        const trackSchedules = schedules.filter(s => s.maRay === track.maRay);
        const totalMinutes = trackSchedules.reduce((sum, s) => {
            const window = calculateTrackWindow(s);
            return window ? sum + (window.end - window.start) : sum;
        }, 0);

        usage[track.maRay] = {
            count: trackSchedules.length,
            totalMinutes,
            percentage: ((totalMinutes / (24 * 60)) * 100).toFixed(1)
        };
    });

    return usage;
}
