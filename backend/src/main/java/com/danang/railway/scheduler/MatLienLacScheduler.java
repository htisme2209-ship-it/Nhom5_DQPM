package com.danang.railway.scheduler;

import com.danang.railway.service.XacNhanTauService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Scheduled job tự động kiểm tra và tạo sự cố mất liên lạc
 * Chạy mỗi 2 phút
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class MatLienLacScheduler {

    private final XacNhanTauService xacNhanTauService;

    /**
     * Kiểm tra tàu quá hạn 10 phút chưa xác nhận
     * Chạy mỗi 45 giây (45000 ms)
     */
    @Scheduled(fixedRate = 45000, initialDelay = 10000)
    public void kiemTraMatLienLac() {
        try {
            log.info("=== Bắt đầu kiểm tra mất liên lạc ===");
            var result = xacNhanTauService.kiemTraVaTaoSuCoMatLienLac();
            
            int soLuongQuaHan = (int) result.get("soLuongQuaHan");
            int soLuongTaoSuCo = (int) result.get("soLuongTaoSuCo");
            
            if (soLuongTaoSuCo > 0) {
                log.warn("⚠️ Đã tạo {} sự cố mất liên lạc mới", soLuongTaoSuCo);
            } else if (soLuongQuaHan > 0) {
                log.info("Phát hiện {} tàu quá hạn nhưng đã có sự cố", soLuongQuaHan);
            } else {
                log.info("✓ Không có tàu quá hạn");
            }
            
            log.info("=== Kết thúc kiểm tra mất liên lạc ===");
        } catch (Exception e) {
            log.error("Lỗi khi kiểm tra mất liên lạc: {}", e.getMessage(), e);
        }
    }
}
