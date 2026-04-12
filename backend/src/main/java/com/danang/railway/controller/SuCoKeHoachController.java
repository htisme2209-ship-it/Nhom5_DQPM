package com.danang.railway.controller;

import com.danang.railway.dto.ApiResponse;
import com.danang.railway.entity.*;
import com.danang.railway.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SuCoKeHoachController {

    private final SuCoRepository suCoRepo;
    private final KeHoachDacBietRepository keHoachRepo;
    private final ChiDaoRepository chiDaoRepo;

    // === SỰ CỐ ===
    @GetMapping("/su-co")
    public ResponseEntity<ApiResponse<List<SuCo>>> getAllSuCo() {
        return ResponseEntity.ok(ApiResponse.ok(suCoRepo.findAll()));
    }

    @PostMapping("/su-co")
    public ResponseEntity<ApiResponse<SuCo>> createSuCo(@RequestBody SuCo suCo) {
        if (suCo.getMaSuCo() == null || suCo.getMaSuCo().isEmpty()) {
            suCo.setMaSuCo("SC-" + System.currentTimeMillis());
        }
        if (suCo.getNgayXayRa() == null) suCo.setNgayXayRa(LocalDateTime.now());
        return ResponseEntity.ok(ApiResponse.ok("Ghi nhận sự cố thành công", suCoRepo.save(suCo)));
    }

    @PutMapping("/su-co/{id}")
    public ResponseEntity<ApiResponse<SuCo>> updateSuCo(@PathVariable String id, @RequestBody SuCo suCo) {
        suCo.setMaSuCo(id);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật sự cố thành công", suCoRepo.save(suCo)));
    }

    // === KẾ HOẠCH ĐẶC BIỆT ===
    @GetMapping("/ke-hoach")
    public ResponseEntity<ApiResponse<List<KeHoachDacBiet>>> getAllKeHoach(
            @RequestParam(required = false) String trangThai) {
        List<KeHoachDacBiet> result;
        if (trangThai != null && !trangThai.isEmpty()) {
            result = keHoachRepo.findByTrangThaiOrderByNgayGuiDesc(trangThai);
        } else {
            result = keHoachRepo.findAll();
        }
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @PostMapping("/ke-hoach")
    public ResponseEntity<ApiResponse<KeHoachDacBiet>> createKeHoach(@RequestBody KeHoachDacBiet keHoach) {
        if (keHoach.getMaKeHoach() == null || keHoach.getMaKeHoach().isEmpty()) {
            keHoach.setMaKeHoach("KH-" + System.currentTimeMillis());
        }
        return ResponseEntity.ok(ApiResponse.ok("Gửi kế hoạch thành công", keHoachRepo.save(keHoach)));
    }

    @PutMapping("/ke-hoach/{id}/phe-duyet")
    public ResponseEntity<ApiResponse<KeHoachDacBiet>> pheDuyetKeHoach(
            @PathVariable String id, @RequestBody Map<String, String> body) {
        KeHoachDacBiet keHoach = keHoachRepo.findById(id).orElse(null);
        if (keHoach == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy kế hoạch"));
        }
        keHoach.setTrangThai(body.getOrDefault("trangThai", "DA_PHE_DUYET"));
        keHoach.setYKienDuyet(body.getOrDefault("yKienDuyet", ""));
        keHoach.setMaNguoiDuyet(body.getOrDefault("maNguoiDuyet", ""));
        keHoach.setNgayDuyet(LocalDateTime.now());
        return ResponseEntity.ok(ApiResponse.ok("Phê duyệt thành công", keHoachRepo.save(keHoach)));
    }

    // === CHỈ ĐẠO ===
    @GetMapping("/chi-dao")
    public ResponseEntity<ApiResponse<List<ChiDao>>> getAllChiDao() {
        return ResponseEntity.ok(ApiResponse.ok(chiDaoRepo.findAll()));
    }

    @PostMapping("/chi-dao")
    public ResponseEntity<ApiResponse<ChiDao>> createChiDao(@RequestBody ChiDao chiDao) {
        if (chiDao.getMaChiDao() == null || chiDao.getMaChiDao().isEmpty()) {
            chiDao.setMaChiDao("CD-" + System.currentTimeMillis());
        }
        return ResponseEntity.ok(ApiResponse.ok("Gửi chỉ đạo thành công", chiDaoRepo.save(chiDao)));
    }

    @PutMapping("/chi-dao/{id}/da-doc")
    public ResponseEntity<ApiResponse<ChiDao>> markAsRead(@PathVariable String id) {
        ChiDao chiDao = chiDaoRepo.findById(id).orElse(null);
        if (chiDao == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy chỉ đạo"));
        }
        chiDao.setTrangThai("DA_DOC");
        chiDao.setNgayDoc(LocalDateTime.now());
        return ResponseEntity.ok(ApiResponse.ok("Đã đánh dấu đã đọc", chiDaoRepo.save(chiDao)));
    }

    // === BÁO CÁO THỐNG KÊ ===
    @GetMapping("/bao-cao/thong-ke")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getThongKe(
            @RequestParam(required = false) String tuNgay,
            @RequestParam(required = false) String denNgay) {

        LocalDateTime start = tuNgay != null ?
                LocalDateTime.parse(tuNgay + "T00:00:00") :
                LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        LocalDateTime end = denNgay != null ?
                LocalDateTime.parse(denNgay + "T23:59:59") :
                LocalDateTime.now();

        Map<String, Object> stats = new HashMap<>();
        stats.put("tuNgay", start);
        stats.put("denNgay", end);
        stats.put("tongSuCo", suCoRepo.findAll().size());
        stats.put("tongKeHoach", keHoachRepo.findAll().size());
        stats.put("keHoachChoDuyet", keHoachRepo.findByTrangThai("CHO_PHE_DUYET").size());

        return ResponseEntity.ok(ApiResponse.ok(stats));
    }
}
