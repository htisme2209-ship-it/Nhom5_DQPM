package com.danang.railway.controller;

import com.danang.railway.dto.XacNhanTauRequest;
import com.danang.railway.service.XacNhanTauService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Controller xử lý xác nhận tàu của nhân viên nhà ga
 * UC-10: Xác nhận tàu
 */
@RestController
@RequestMapping("/api/xac-nhan-tau")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class XacNhanTauController {

    private final XacNhanTauService xacNhanTauService;

    /**
     * Lấy danh sách tàu chờ xác nhận
     */
    @GetMapping("/cho-xac-nhan")
    public ResponseEntity<?> getDanhSachChoXacNhan() {
        return ResponseEntity.ok(xacNhanTauService.getDanhSachChoXacNhan());
    }

    /**
     * Xác nhận tàu vào ga hoặc xuất phát
     */
    @PostMapping("/xac-nhan")
    public ResponseEntity<?> xacNhanTau(@RequestBody XacNhanTauRequest request) {
        return ResponseEntity.ok(xacNhanTauService.xacNhanTau(request));
    }

    /**
     * Hủy xác nhận (trong trường hợp xác nhận nhầm)
     */
    @PostMapping("/huy-xac-nhan/{maLichTrinh}")
    public ResponseEntity<?> huyXacNhan(@PathVariable String maLichTrinh) {
        xacNhanTauService.huyXacNhan(maLichTrinh);
        return ResponseEntity.ok(Map.of("message", "Đã hủy xác nhận thành công"));
    }

    /**
     * Kiểm tra tàu quá hạn (mất liên lạc)
     */
    @GetMapping("/kiem-tra-qua-han")
    public ResponseEntity<?> kiemTraQuaHan() {
        return ResponseEntity.ok(xacNhanTauService.kiemTraVaTaoSuCoMatLienLac());
    }
}
