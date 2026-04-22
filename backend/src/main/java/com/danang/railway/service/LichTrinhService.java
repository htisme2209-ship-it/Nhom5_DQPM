package com.danang.railway.service;

import com.danang.railway.entity.LichTrinh;
import com.danang.railway.repository.LichTrinhRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * Service xử lý logic nghiệp vụ lịch trình tàu
 * Bao gồm các validation rules quan trọng
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class LichTrinhService {

    private final LichTrinhRepository lichTrinhRepository;
    
    // Các hằng số validation
    private static final int THOI_GIAN_TAO_TRUOC_TOI_THIEU_GIO = 24; // 24 giờ
    private static final int KHOANG_CACH_GIUA_CAC_TAU_PHUT = 10; // 10 phút

    /**
     * Tạo lịch trình mới với đầy đủ validation
     */
    @Transactional
    public LichTrinh taoLichTrinh(LichTrinh lichTrinh) {
        log.info("Tạo lịch trình mới: {}", lichTrinh.getMaChuyenTau());
        
        LocalDateTime now = LocalDateTime.now();
        
        // Validation 1: Không được tạo lịch trình trong quá khứ
        kiemTraKhongChoPhepQuaKhu(lichTrinh, now);
        
        // Validation 2: Phải tạo trước ít nhất 24 giờ
        kiemTraTaoTruoc24Gio(lichTrinh, now);
        
        // Validation 3: Đảm bảo khoảng cách 10 phút giữa các tàu
        kiemTraKhoangCachGiuaCacTau(lichTrinh);
        
        // Tạo mã lịch trình nếu chưa có
        if (lichTrinh.getMaLichTrinh() == null || lichTrinh.getMaLichTrinh().isEmpty()) {
            lichTrinh.setMaLichTrinh("LT-" + System.currentTimeMillis());
        }
        
        // Set trạng thái mặc định — lịch trình đã chọn ray khi tạo nên mặc định là DA_XAC_NHAN
        if (lichTrinh.getTrangThai() == null) {
            lichTrinh.setTrangThai("DA_XAC_NHAN");
        }
        
        // Set thời gian tạo
        lichTrinh.setNgayTao(now);
        lichTrinh.setNgayCapNhat(now);
        
        LichTrinh saved = lichTrinhRepository.save(lichTrinh);
        log.info("Đã tạo lịch trình thành công: {}", saved.getMaLichTrinh());
        
        return saved;
    }

    /**
     * Cập nhật lịch trình với validation
     */
    @Transactional
    public LichTrinh capNhatLichTrinh(String maLichTrinh, LichTrinh lichTrinhMoi) {
        log.info("Cập nhật lịch trình: {}", maLichTrinh);
        
        LichTrinh lichTrinhCu = lichTrinhRepository.findById(maLichTrinh)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch trình: " + maLichTrinh));
        
        LocalDateTime now = LocalDateTime.now();
        
        // Kiểm tra thay đổi thời gian (null-safe: một số loại tàu không có đủ cả 2 trường)
        boolean thayDoiThoiGian =
            !java.util.Objects.equals(lichTrinhCu.getGioDenDuKien(), lichTrinhMoi.getGioDenDuKien()) ||
            !java.util.Objects.equals(lichTrinhCu.getGioDiDuKien(),  lichTrinhMoi.getGioDiDuKien());
        
        if (thayDoiThoiGian) {
            kiemTraKhongChoPhepQuaKhu(lichTrinhMoi, now);
            kiemTraTaoTruoc24Gio(lichTrinhMoi, now);
            kiemTraKhoangCachGiuaCacTau(lichTrinhMoi, maLichTrinh);
        }
        
        // Cập nhật các trường
        lichTrinhMoi.setMaLichTrinh(maLichTrinh);
        lichTrinhMoi.setNgayTao(lichTrinhCu.getNgayTao());
        lichTrinhMoi.setNgayCapNhat(now);
        
        LichTrinh saved = lichTrinhRepository.save(lichTrinhMoi);
        log.info("Đã cập nhật lịch trình thành công: {}", saved.getMaLichTrinh());
        
        return saved;
    }

    /**
     * VALIDATION 1: Không cho phép tạo lịch trình trong quá khứ
     */
    private void kiemTraKhongChoPhepQuaKhu(LichTrinh lichTrinh, LocalDateTime now) {
        if (lichTrinh.getGioDenDuKien() != null && lichTrinh.getGioDenDuKien().isBefore(now)) {
            throw new RuntimeException(String.format(
                    "Không thể tạo lịch trình trong quá khứ. Giờ đến dự kiến (%s) phải sau thời điểm hiện tại (%s)",
                    lichTrinh.getGioDenDuKien(),
                    now
            ));
        }
        
        if (lichTrinh.getGioDiDuKien() != null && lichTrinh.getGioDiDuKien().isBefore(now)) {
            throw new RuntimeException(String.format(
                    "Không thể tạo lịch trình trong quá khứ. Giờ đi dự kiến (%s) phải sau thời điểm hiện tại (%s)",
                    lichTrinh.getGioDiDuKien(),
                    now
            ));
        }
    }

    /**
     * VALIDATION 2: Phải tạo trước ít nhất 24 giờ
     */
    private void kiemTraTaoTruoc24Gio(LichTrinh lichTrinh, LocalDateTime now) {
        LocalDateTime gioChaySomNhat = lichTrinh.getGioDenDuKien();
        if (lichTrinh.getGioDiDuKien() != null && 
            (gioChaySomNhat == null || lichTrinh.getGioDiDuKien().isBefore(gioChaySomNhat))) {
            gioChaySomNhat = lichTrinh.getGioDiDuKien();
        }
        
        if (gioChaySomNhat == null) {
            throw new RuntimeException("Phải có ít nhất một trong hai: giờ đến dự kiến hoặc giờ đi dự kiến");
        }
        
        long gioConLai = ChronoUnit.HOURS.between(now, gioChaySomNhat);
        
        if (gioConLai < THOI_GIAN_TAO_TRUOC_TOI_THIEU_GIO) {
            throw new RuntimeException(String.format(
                    "Lịch trình thông thường phải được tạo trước ít nhất %d giờ. " +
                    "Hiện tại chỉ còn %d giờ đến giờ chạy (%s). " +
                    "Vui lòng chuyển sang luồng xử lý sự cố nếu cần tạo lịch trình gấp.",
                    THOI_GIAN_TAO_TRUOC_TOI_THIEU_GIO,
                    gioConLai,
                    gioChaySomNhat
            ));
        }
    }

    /**
     * VALIDATION 3: Đảm bảo khoảng cách 10 phút giữa các tàu xuất phát
     * (Áp dụng cho tất cả các tàu, dù khác ray hay cùng ray)
     */
    private void kiemTraKhoangCachGiuaCacTau(LichTrinh lichTrinhMoi) {
        kiemTraKhoangCachGiuaCacTau(lichTrinhMoi, null);
    }
    
    private void kiemTraKhoangCachGiuaCacTau(LichTrinh lichTrinhMoi, String maLichTrinhBoQua) {
        if (lichTrinhMoi.getGioDiDuKien() == null) {
            return; // Không cần kiểm tra nếu không có giờ đi
        }
        
        LocalDateTime gioXuatPhatMoi = lichTrinhMoi.getGioDiDuKien();
        
        // Lấy tất cả lịch trình trong khoảng +/- 10 phút
        LocalDateTime tuGio = gioXuatPhatMoi.minusMinutes(KHOANG_CACH_GIUA_CAC_TAU_PHUT);
        LocalDateTime denGio = gioXuatPhatMoi.plusMinutes(KHOANG_CACH_GIUA_CAC_TAU_PHUT);
        
        List<LichTrinh> cacLichTrinhGanKe = lichTrinhRepository.findByGioDiDuKienBetween(tuGio, denGio);
        
        // Lọc bỏ chính lịch trình đang cập nhật (nếu có)
        if (maLichTrinhBoQua != null) {
            cacLichTrinhGanKe = cacLichTrinhGanKe.stream()
                    .filter(lt -> !lt.getMaLichTrinh().equals(maLichTrinhBoQua))
                    .toList();
        }
        
        // Kiểm tra từng lịch trình
        for (LichTrinh ltGanKe : cacLichTrinhGanKe) {
            if (ltGanKe.getGioDiDuKien() == null) {
                continue;
            }
            
            long phutChenh = Math.abs(ChronoUnit.MINUTES.between(gioXuatPhatMoi, ltGanKe.getGioDiDuKien()));
            
            if (phutChenh < KHOANG_CACH_GIUA_CAC_TAU_PHUT) {
                throw new RuntimeException(String.format(
                        "Khoảng cách giữa các tàu xuất phát phải ít nhất %d phút. " +
                        "Tàu %s đã có lịch xuất phát lúc %s (cách %d phút). " +
                        "Vui lòng chọn thời gian khác.",
                        KHOANG_CACH_GIUA_CAC_TAU_PHUT,
                        ltGanKe.getMaChuyenTau(),
                        ltGanKe.getGioDiDuKien(),
                        phutChenh
                ));
            }
        }
    }
}
