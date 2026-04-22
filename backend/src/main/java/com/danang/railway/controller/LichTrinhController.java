package com.danang.railway.controller;

import com.danang.railway.dto.ApiResponse;
import com.danang.railway.entity.*;
import com.danang.railway.repository.*;
import com.danang.railway.service.LichTrinhService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class LichTrinhController {

    private final LichTrinhRepository lichTrinhRepo;
    private final LichTrinhService lichTrinhService;
    private final ChuyenTauRepository chuyenTauRepo;
    private final DuongRayRepository duongRayRepo;
    private final TauRepository tauRepo;
    private final NhatKyRepository nhatKyRepo;

    @GetMapping("/lich-trinh")
    public ResponseEntity<ApiResponse<List<LichTrinh>>> getAll(
            @RequestParam(required = false) String ngay,
            @RequestParam(required = false) String trangThai,
            @RequestParam(required = false) String maRay) {

        List<LichTrinh> result;
        if (ngay != null && !ngay.isEmpty()) {
            // Lọc theo ngayChay của ChuyenTau (JOIN query)
            // Áp dụng cho mọi loại tàu: XUAT_PHAT/DIEM_CUOI/TRUNG_GIAN
            if (maRay != null && !maRay.isEmpty()) {
                result = lichTrinhRepo.findByNgayChayChuyenTauAndMaRay(ngay, maRay);
            } else {
                result = lichTrinhRepo.findByNgayChayChuyenTau(ngay);
            }
        } else if (trangThai != null && !trangThai.isEmpty()) {
            result = lichTrinhRepo.findByTrangThai(trangThai);
        } else {
            result = lichTrinhRepo.findAll();
        }
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/lich-trinh/{id}")
    public ResponseEntity<ApiResponse<LichTrinh>> getById(@PathVariable String id) {
        return lichTrinhRepo.findById(id)
                .map(lt -> ResponseEntity.ok(ApiResponse.ok(lt)))
                .orElse(ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy lịch trình")));
    }

    @PostMapping("/lich-trinh")
    public ResponseEntity<ApiResponse<LichTrinh>> create(@RequestBody LichTrinh lichTrinh) {
        try {
            LichTrinh saved = lichTrinhService.taoLichTrinh(lichTrinh);
            return ResponseEntity.ok(ApiResponse.ok("Tạo lịch trình thành công", saved));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/lich-trinh/{id}")
    public ResponseEntity<ApiResponse<LichTrinh>> update(@PathVariable String id, @RequestBody LichTrinh lichTrinh) {
        try {
            LichTrinh saved = lichTrinhService.capNhatLichTrinh(id, lichTrinh);
            return ResponseEntity.ok(ApiResponse.ok("Cập nhật lịch trình thành công", saved));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/lich-trinh/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id) {
        if (!lichTrinhRepo.existsById(id)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy lịch trình"));
        }
        lichTrinhRepo.deleteById(id);
        return ResponseEntity.ok(ApiResponse.ok("Xóa lịch trình thành công", null));
    }

    // === CHUYẾN TÀU ===
    @GetMapping("/chuyen-tau")
    public ResponseEntity<ApiResponse<List<ChuyenTau>>> getAllChuyenTau(
            @RequestParam(required = false) String vaiTro,
            @RequestParam(required = false) String ngay) {
        List<ChuyenTau> result;
        
        if (ngay != null && !ngay.isEmpty()) {
            // Filter theo ngày chạy
            result = chuyenTauRepo.findByNgayChay(ngay);
            
            // Nếu có thêm filter vai trò
            if (vaiTro != null && !vaiTro.isEmpty()) {
                result = result.stream()
                    .filter(ct -> vaiTro.equals(ct.getVaiTroTaiDaNang()))
                    .toList();
            }
        } else if (vaiTro != null && !vaiTro.isEmpty()) {
            result = chuyenTauRepo.findByVaiTroTaiDaNang(vaiTro);
        } else {
            result = chuyenTauRepo.findAll();
        }
        
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/chuyen-tau/{id}")
    public ResponseEntity<ApiResponse<ChuyenTau>> getChuyenTauById(@PathVariable String id) {
        return chuyenTauRepo.findById(id)
                .map(ct -> ResponseEntity.ok(ApiResponse.ok(ct)))
                .orElse(ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy chuyến tàu")));
    }

    @PostMapping("/chuyen-tau")
    public ResponseEntity<ApiResponse<ChuyenTau>> createChuyenTau(@RequestBody ChuyenTau chuyenTau) {
        if (chuyenTau.getMaChuyenTau() == null || chuyenTau.getMaChuyenTau().isEmpty()) {
            chuyenTau.setMaChuyenTau("CT-" + System.currentTimeMillis());
        }
        ChuyenTau saved = chuyenTauRepo.save(chuyenTau);
        return ResponseEntity.ok(ApiResponse.ok("Tạo chuyến tàu thành công", saved));
    }

    @PutMapping("/chuyen-tau/{id}")
    public ResponseEntity<ApiResponse<ChuyenTau>> updateChuyenTau(@PathVariable String id, @RequestBody ChuyenTau chuyenTau) {
        if (!chuyenTauRepo.existsById(id)) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy chuyến tàu"));
        }
        chuyenTau.setMaChuyenTau(id);
        ChuyenTau saved = chuyenTauRepo.save(chuyenTau);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật chuyến tàu thành công", saved));
    }

    @DeleteMapping("/chuyen-tau/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteChuyenTau(@PathVariable String id) {
        chuyenTauRepo.deleteById(id);
        return ResponseEntity.ok(ApiResponse.ok("Xóa chuyến tàu thành công", null));
    }

    // === TÀU ===
    @GetMapping("/tau")
    public ResponseEntity<ApiResponse<List<Tau>>> getAllTau() {
        return ResponseEntity.ok(ApiResponse.ok(tauRepo.findAll()));
    }

    @PostMapping("/tau")
    public ResponseEntity<ApiResponse<Tau>> createTau(@RequestBody Tau tau) {
        return ResponseEntity.ok(ApiResponse.ok("Tạo tàu thành công", tauRepo.save(tau)));
    }

    @PutMapping("/tau/{id}")
    public ResponseEntity<ApiResponse<Tau>> updateTau(@PathVariable String id, @RequestBody Tau tau) {
        tau.setMaTau(id);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật tàu thành công", tauRepo.save(tau)));
    }

    @DeleteMapping("/tau/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTau(@PathVariable String id) {
        tauRepo.deleteById(id);
        return ResponseEntity.ok(ApiResponse.ok("Xóa tàu thành công", null));
    }

    // === ĐƯỜNG RAY ===
    @GetMapping("/duong-ray")
    public ResponseEntity<ApiResponse<List<DuongRay>>> getAllDuongRay() {
        return ResponseEntity.ok(ApiResponse.ok(duongRayRepo.findAll()));
    }

    @PostMapping("/duong-ray")
    public ResponseEntity<ApiResponse<DuongRay>> createDuongRay(@RequestBody DuongRay duongRay) {
        return ResponseEntity.ok(ApiResponse.ok("Tạo đường ray thành công", duongRayRepo.save(duongRay)));
    }

    @PutMapping("/duong-ray/{id}")
    public ResponseEntity<ApiResponse<DuongRay>> updateDuongRay(@PathVariable String id, @RequestBody DuongRay duongRay) {
        duongRay.setMaRay(id);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật đường ray thành công", duongRayRepo.save(duongRay)));
    }

    // === NHẬT KÝ ===
    @GetMapping("/nhat-ky")
    public ResponseEntity<ApiResponse<List<NhatKy>>> getAllNhatKy() {
        try {
            // Lấy trang đầu tiên, tối đa 500 bản ghi để tối ưu hiệu suất
            Pageable top500 = PageRequest.of(0, 500);
            
            // Dùng .getContent() để chuyển từ Page<NhatKy> sang List<NhatKy> cho React
            List<NhatKy> dsNhatKy = nhatKyRepo.findAllByOrderByThoiGianDesc(top500).getContent();
            
            return ResponseEntity.ok(ApiResponse.ok(dsNhatKy));
        } catch (Exception e) {
            e.printStackTrace(); 
            return ResponseEntity.internalServerError().body(ApiResponse.error("Lỗi khi lấy dữ liệu nhật ký: " + e.getMessage()));
        }
    }
}