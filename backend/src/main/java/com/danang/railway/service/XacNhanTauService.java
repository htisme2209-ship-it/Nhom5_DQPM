package com.danang.railway.service;

import com.danang.railway.dto.XacNhanTauRequest;
import com.danang.railway.entity.LichTrinh;
import com.danang.railway.entity.SuCo;
import com.danang.railway.repository.LichTrinhRepository;
import com.danang.railway.repository.SuCoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Service xử lý xác nhận tàu của nhân viên nhà ga
 * UC-10: Xác nhận tàu
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class XacNhanTauService {

    private final LichTrinhRepository lichTrinhRepository;
    private final SuCoRepository suCoRepository;
    private static final int NGUONG_MAT_LIEN_LAC_PHUT = 10;
    private static final String MA_TAI_KHOAN_HE_THONG = "SYSTEM"; // Tài khoản hệ thống cho sự cố tự động

    /**
     * Lấy danh sách tàu chờ xác nhận trong ca trực
     */
    public List<LichTrinh> getDanhSachChoXacNhan() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfDay = now.toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);

        // Lấy các lịch trình trong ngày hôm nay, chưa xác nhận hoặc đã xác nhận nhưng chưa rời ga
        return lichTrinhRepository.findByNgayChayBetweenAndTrangThaiIn(
                startOfDay,
                endOfDay,
                List.of("CHO_XAC_NHAN", "DA_XAC_NHAN", "DUNG_TAI_GA")
        );
    }

    /**
     * Xác nhận tàu vào ga hoặc xuất phát
     */
    @Transactional
    public Map<String, Object> xacNhanTau(XacNhanTauRequest request) {
        log.info("Xác nhận tàu: {}", request.getMaLichTrinh());

        // Validate
        if (request.getDaKiemTraAnToan() == null || !request.getDaKiemTraAnToan()) {
            throw new RuntimeException("Chưa xác nhận kiểm tra an toàn kỹ thuật");
        }

        LichTrinh lichTrinh = lichTrinhRepository.findById(request.getMaLichTrinh())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch trình"));

        LocalDateTime now = LocalDateTime.now();
        int soPhutTre = 0;

        if ("VAO_GA".equals(request.getTrangThai())) {
            // Xác nhận tàu vào ga
            lichTrinh.setGioDenThucTe(now);
            lichTrinh.setTrangThai("DUNG_TAI_GA");

            // Tính số phút trễ
            if (lichTrinh.getGioDenDuKien() != null) {
                long phutChenh = ChronoUnit.MINUTES.between(lichTrinh.getGioDenDuKien(), now);
                soPhutTre = (int) Math.max(0, phutChenh);
                lichTrinh.setSoPhutTre(soPhutTre);
            }

            log.info("Tàu {} vào ga lúc {}, trễ {} phút", lichTrinh.getMaChuyenTau(), now, soPhutTre);

        } else if ("XUAT_PHAT".equals(request.getTrangThai())) {
            // Xác nhận tàu xuất phát
            lichTrinh.setGioDiThucTe(now);
            lichTrinh.setTrangThai("DA_ROI_GA");

            // Tính số phút trễ (nếu chưa có từ lúc vào ga)
            if (lichTrinh.getSoPhutTre() == null || lichTrinh.getSoPhutTre() == 0) {
                if (lichTrinh.getGioDiDuKien() != null) {
                    long phutChenh = ChronoUnit.MINUTES.between(lichTrinh.getGioDiDuKien(), now);
                    soPhutTre = (int) Math.max(0, phutChenh);
                    lichTrinh.setSoPhutTre(soPhutTre);
                }
            } else {
                soPhutTre = lichTrinh.getSoPhutTre();
            }

            log.info("Tàu {} xuất phát lúc {}, trễ {} phút", lichTrinh.getMaChuyenTau(), now, soPhutTre);
        }

        // Lưu ghi chú nếu có
        if (request.getGhiChu() != null && !request.getGhiChu().trim().isEmpty()) {
            lichTrinh.setGhiChu(request.getGhiChu());
        }

        lichTrinh.setNgayCapNhat(now);
        lichTrinhRepository.save(lichTrinh);

        // Trả về kết quả
        Map<String, Object> result = new HashMap<>();
        result.put("message", "Xác nhận thành công");
        result.put("lichTrinh", lichTrinh);
        result.put("soPhutTre", soPhutTre);

        if (soPhutTre > 0) {
            result.put("warning", String.format("Tàu trễ %d phút so với dự kiến", soPhutTre));
        }

        return result;
    }

    /**
     * Hủy xác nhận (trong trường hợp xác nhận nhầm)
     */
    @Transactional
    public void huyXacNhan(String maLichTrinh) {
        log.info("Hủy xác nhận tàu: {}", maLichTrinh);

        LichTrinh lichTrinh = lichTrinhRepository.findById(maLichTrinh)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch trình"));

        // Reset về trạng thái chờ xác nhận
        lichTrinh.setTrangThai("CHO_XAC_NHAN");
        lichTrinh.setGioDenThucTe(null);
        lichTrinh.setGioDiThucTe(null);
        lichTrinh.setSoPhutTre(0);
        lichTrinh.setNgayCapNhat(LocalDateTime.now());

        lichTrinhRepository.save(lichTrinh);
    }

    /**
     * Kiểm tra và tạo sự cố mất liên lạc cho các tàu quá hạn
     * Ngưỡng: 10 phút
     */
    @Transactional
    public Map<String, Object> kiemTraVaTaoSuCoMatLienLac() {
        log.info("Kiểm tra tàu quá hạn (mất liên lạc)");

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfDay = now.toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);

        // Lấy các lịch trình chờ xác nhận trong ngày
        List<LichTrinh> lichTrinhs = lichTrinhRepository.findByNgayChayBetweenAndTrangThaiIn(
                startOfDay,
                endOfDay,
                List.of("CHO_XAC_NHAN", "DA_XAC_NHAN")
        );

        int soLuongQuaHan = 0;
        int soLuongTaoSuCo = 0;

        for (LichTrinh lt : lichTrinhs) {
            // Kiểm tra giờ đến dự kiến
            if (lt.getGioDenDuKien() != null) {
                long phutChenh = ChronoUnit.MINUTES.between(lt.getGioDenDuKien(), now);

                if (phutChenh >= NGUONG_MAT_LIEN_LAC_PHUT) {
                    soLuongQuaHan++;

                    // Kiểm tra xem đã có sự cố mất liên lạc chưa
                    boolean daTonTaiSuCo = suCoRepository.existsByMaLichTrinhAndLoaiSuCo(
                            lt.getMaLichTrinh(),
                            "MAT_LIEN_LAC"
                    );

                    if (!daTonTaiSuCo) {
                        // Tạo sự cố mất liên lạc
                        SuCo suCo = new SuCo();
                        suCo.setMaSuCo("SC-MLL-" + System.currentTimeMillis());
                        suCo.setMaLichTrinh(lt.getMaLichTrinh());
                        suCo.setMaRay(lt.getMaRay());
                        suCo.setLoaiSuCo("MAT_LIEN_LAC");
                        suCo.setMoTa(String.format(
                                "Tàu %s đã quá %d phút so với giờ đến dự kiến (%s) mà chưa có xác nhận từ nhà ga",
                                lt.getMaChuyenTau(),
                                (int) phutChenh,
                                lt.getGioDenDuKien()
                        ));
                        suCo.setMucDo("KHAN_CAP");
                        suCo.setTrangThaiXuLy("CHUA_XU_LY");
                        suCo.setKichHoatPhongToa(false);
                        suCo.setNgayXayRa(now);
                        suCo.setNgayTao(now);
                        suCo.setMaNguoiGhiNhan(MA_TAI_KHOAN_HE_THONG); // Gán tài khoản hệ thống

                        suCoRepository.save(suCo);
                        soLuongTaoSuCo++;

                        log.warn("Tạo sự cố mất liên lạc cho tàu {}: quá {} phút",
                                lt.getMaChuyenTau(), (int) phutChenh);
                    }
                }
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("soLuongQuaHan", soLuongQuaHan);
        result.put("soLuongTaoSuCo", soLuongTaoSuCo);
        result.put("message", String.format(
                "Phát hiện %d tàu quá hạn, đã tạo %d sự cố mất liên lạc mới",
                soLuongQuaHan,
                soLuongTaoSuCo
        ));

        return result;
    }
}
