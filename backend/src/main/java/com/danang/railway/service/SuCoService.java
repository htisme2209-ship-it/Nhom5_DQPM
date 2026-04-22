package com.danang.railway.service;

import com.danang.railway.entity.*;
import com.danang.railway.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SuCoService {

    private final SuCoRepository suCoRepo;
    private final DuongRayRepository duongRayRepo;
    private final LichTrinhRepository lichTrinhRepo;
    private final NhatKyRepository nhatKyRepo;

    /**
     * UC-09: Ghi nhận sự cố - Phát động quy trình
     * Logic tự động:
     * 1. Cập nhật trạng thái đường ray dựa trên mức độ sự cố
     * 2. Quét và gắn thẻ các lịch trình bị ảnh hưởng
     */
    @Transactional
    public SuCo ghiNhanSuCo(SuCo suCo, String maTaiKhoan, String diaChiIp) {
        // 1. Lưu sự cố
        suCo.setNgayTao(LocalDateTime.now());
        suCo.setTrangThaiXuLy("CHUA_XU_LY");
        SuCo savedSuCo = suCoRepo.save(suCo);

        // 2. Xử lý phong tỏa đường ray nếu có
        if (suCo.getMaRay() != null) {
            DuongRay ray = duongRayRepo.findById(suCo.getMaRay())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy đường ray"));

            String trangThaiMoi = xacDinhTrangThaiPhongToa(suCo);
            String trangThaiCu = ray.getTrangThai();
            
            ray.setTrangThai(trangThaiMoi);
            
            // Cập nhật thời gian ước tính
            if ("PHONG_TOA_TAM".equals(trangThaiMoi)) {
                ray.setThoiGianXuLyUocTinh(tinhThoiGianXuLyUocTinh(suCo.getMucDo()));
            } else if ("PHONG_TOA_CUNG".equals(trangThaiMoi)) {
                ray.setThoiGianPhongToaUocTinh(null); // Không thể dự đoán
            }
            
            duongRayRepo.save(ray);

            // Ghi nhật ký phong tỏa ray
            ghiNhatKy(maTaiKhoan, "PHONG_TOA_RAY", "DUONG_RAY", suCo.getMaRay(),
                    "Trạng thái: " + trangThaiCu,
                    "Trạng thái: " + trangThaiMoi + " do sự cố " + savedSuCo.getMaSuCo(),
                    diaChiIp);

            // 3. Quét và gắn thẻ lịch trình bị ảnh hưởng
            ganTheLichTrinhBiAnhHuong(savedSuCo, ray, maTaiKhoan, diaChiIp);
        }

        // Ghi nhật ký ghi nhận sự cố
        ghiNhatKy(maTaiKhoan, "GHI_NHAN_SU_CO", "SU_CO", savedSuCo.getMaSuCo(),
                null, "Ghi nhận sự cố: " + suCo.getLoaiSuCo() + " - " + suCo.getMucDo(),
                diaChiIp);

        return savedSuCo;
    }

    /**
     * Xác định trạng thái phong tỏa dựa trên mức độ và cờ kích hoạt
     */
    private String xacDinhTrangThaiPhongToa(SuCo suCo) {
        // Nếu kích hoạt phong tỏa cứng thủ công
        if (Boolean.TRUE.equals(suCo.getKichHoatPhongToa())) {
            return "PHONG_TOA_CUNG";
        }

        // Dựa trên mức độ
        String mucDo = suCo.getMucDo();
        if ("CAO".equals(mucDo) || "KHAN_CAP".equals(mucDo)) {
            return "PHONG_TOA_CUNG";
        } else if ("THAP".equals(mucDo) || "TRUNG_BINH".equals(mucDo)) {
            return "PHONG_TOA_TAM";
        }

        return "PHONG_TOA_TAM"; // Mặc định
    }

    /**
     * Tính thời gian xử lý ước tính dựa trên mức độ
     */
    private Integer tinhThoiGianXuLyUocTinh(String mucDo) {
        switch (mucDo) {
            case "THAP":
                return 30; // 30 phút
            case "TRUNG_BINH":
                return 60; // 1 giờ
            case "CAO":
                return 120; // 2 giờ
            case "KHAN_CAP":
                return null; // Không xác định
            default:
                return 60;
        }
    }

    /**
     * Quét và gắn thẻ các lịch trình bị ảnh hưởng
     */
    private void ganTheLichTrinhBiAnhHuong(SuCo suCo, DuongRay ray, String maTaiKhoan, String diaChiIp) {
        // Tính khoảng thời gian ảnh hưởng
        LocalDateTime thoiDiemBatDau = suCo.getNgayXayRa();
        LocalDateTime thoiDiemKetThuc = tinhThoiDiemKetThucAnhHuong(suCo, ray);

        // Tìm tất cả lịch trình sử dụng ray này
        List<LichTrinh> tatCaLichTrinh = lichTrinhRepo.findByMaRay(ray.getMaRay());

        // Lọc các lịch trình trong khoảng thời gian ảnh hưởng
        for (LichTrinh lt : tatCaLichTrinh) {
            // Kiểm tra xem lịch trình có trong khoảng thời gian ảnh hưởng không
            if (lt.getGioDenDuKien() != null && lt.getGioDiDuKien() != null) {
                boolean trongKhoangThoiGian = 
                    !lt.getGioDiDuKien().isBefore(thoiDiemBatDau) && 
                    !lt.getGioDenDuKien().isAfter(thoiDiemKetThuc);
                
                if (trongKhoangThoiGian && lt.getMaSuCoAnhHuong() == null) {
                    // Chưa bị gắn thẻ sự cố khác
                    lt.setMaSuCoAnhHuong(suCo.getMaSuCo());
                    lt.setPhuongAnXuLy("CHO_RAY"); // Mặc định chờ ray
                    lichTrinhRepo.save(lt);

                    // Ghi nhật ký
                    ghiNhatKy(maTaiKhoan, "GAN_THE_SU_CO", "LICH_TRINH", lt.getMaLichTrinh(),
                            "Không có sự cố",
                            "Bị ảnh hưởng bởi sự cố " + suCo.getMaSuCo() + ", phương án: CHO_RAY",
                            diaChiIp);
                }
            }
        }
    }

    /**
     * Tính thời điểm kết thúc ảnh hưởng
     */
    private LocalDateTime tinhThoiDiemKetThucAnhHuong(SuCo suCo, DuongRay ray) {
        LocalDateTime batDau = suCo.getNgayXayRa();
        
        if ("PHONG_TOA_CUNG".equals(xacDinhTrangThaiPhongToa(suCo))) {
            // Phong tỏa cứng: ảnh hưởng đến cuối ngày + 1
            return batDau.plusDays(1).withHour(23).withMinute(59);
        } else if (ray.getThoiGianXuLyUocTinh() != null) {
            // Phong tỏa tạm: ảnh hưởng theo thời gian ước tính
            return batDau.plusMinutes(ray.getThoiGianXuLyUocTinh());
        }
        
        // Mặc định: 2 giờ
        return batDau.plusHours(2);
    }

    /**
     * UC-06: Xử lý phương án cho lịch trình bị ảnh hưởng
     */
    @Transactional
    public void xuLyPhuongAnLichTrinh(String maLichTrinh, String phuongAn, 
                                      String maRayMoi, String maTaiKhoan, String diaChiIp) {
        LichTrinh lichTrinh = lichTrinhRepo.findById(maLichTrinh)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch trình"));

        String phuongAnCu = lichTrinh.getPhuongAnXuLy();
        String maRayCu = lichTrinh.getMaRay();

        switch (phuongAn) {
            case "CHO_RAY":
                // Giữ nguyên, không làm gì
                lichTrinh.setPhuongAnXuLy("CHO_RAY");
                break;

            case "DOI_RAY":
                if (maRayMoi == null) {
                    throw new RuntimeException("Phải chỉ định đường ray mới");
                }
                
                // Kiểm tra xung đột
                kiemTraXungDotRay(lichTrinh, maRayMoi);
                
                lichTrinh.setMaRay(maRayMoi);
                lichTrinh.setPhuongAnXuLy("DOI_RAY");
                break;

            case "HUY_CHUYEN":
                lichTrinh.setTrangThai("HUY_CHUYEN");
                lichTrinh.setPhuongAnXuLy("HUY_CHUYEN");
                break;

            default:
                throw new RuntimeException("Phương án không hợp lệ");
        }

        lichTrinhRepo.save(lichTrinh);

        // Ghi nhật ký
        ghiNhatKy(maTaiKhoan, "XU_LY_SU_CO", "LICH_TRINH", maLichTrinh,
                "Phương án: " + phuongAnCu + ", Ray: " + maRayCu,
                "Phương án: " + phuongAn + ", Ray: " + (maRayMoi != null ? maRayMoi : maRayCu),
                diaChiIp);

        // Tự động kiểm tra giải phóng ray nếu đã xử lý hết
        if ("DOI_RAY".equals(phuongAn) || "HUY_CHUYEN".equals(phuongAn)) {
            kiemTraTuDongGiaiPhongRay(lichTrinh, maTaiKhoan, diaChiIp);
        }
    }

    /**
     * Kiểm tra xung đột khi đổi ray
     */
    private void kiemTraXungDotRay(LichTrinh lichTrinh, String maRayMoi) {
        // Lấy ngày chạy từ ChuyenTau
        ChuyenTau chuyenTau = lichTrinh.getChuyenTau();
        if (chuyenTau == null || chuyenTau.getNgayChay() == null) {
            throw new RuntimeException("Không thể xác định ngày chạy của lịch trình");
        }
        
        LocalDateTime ngayChay = LocalDateTime.parse(chuyenTau.getNgayChay());
        
        // Tìm các lịch trình khác cùng ray trong cùng ngày
        List<LichTrinh> lichTrinhCungRay = lichTrinhRepo.findByMaRay(maRayMoi);

        for (LichTrinh lt : lichTrinhCungRay) {
            if (!lt.getMaLichTrinh().equals(lichTrinh.getMaLichTrinh())) {
                // Kiểm tra cùng ngày
                ChuyenTau ctKhac = lt.getChuyenTau();
                if (ctKhac != null && ctKhac.getNgayChay() != null) {
                    LocalDateTime ngayChayKhac = LocalDateTime.parse(ctKhac.getNgayChay());
                    
                    // Chỉ kiểm tra nếu cùng ngày
                    if (ngayChay.toLocalDate().equals(ngayChayKhac.toLocalDate())) {
                        // Kiểm tra giao nhau cửa sổ thời gian
                        if (kiemTraGiaoNhauThoiGian(lichTrinh, lt)) {
                            throw new RuntimeException("Xung đột lịch trình với chuyến " + 
                                    lt.getMaChuyenTau() + " trên ray " + maRayMoi);
                        }
                    }
                }
            }
        }
    }

    /**
     * Kiểm tra giao nhau cửa sổ thời gian
     * Cửa sổ chiếm ray = giờ đến -> giờ đi + 15 phút buffer + số phút trễ
     */
    private boolean kiemTraGiaoNhauThoiGian(LichTrinh lt1, LichTrinh lt2) {
        LocalDateTime start1 = lt1.getGioDenDuKien();
        // Cửa sổ kết thúc = giờ đi + 15' buffer + số phút trễ
        int bufferMinutes1 = 15 + (lt1.getSoPhutTre() != null ? lt1.getSoPhutTre() : 0);
        LocalDateTime end1 = lt1.getGioDiDuKien().plusMinutes(bufferMinutes1);

        LocalDateTime start2 = lt2.getGioDenDuKien();
        int bufferMinutes2 = 15 + (lt2.getSoPhutTre() != null ? lt2.getSoPhutTre() : 0);
        LocalDateTime end2 = lt2.getGioDiDuKien().plusMinutes(bufferMinutes2);

        return !(end1.isBefore(start2) || end2.isBefore(start1));
    }

    /**
     * Giải phóng đường ray (chỉ BQL mới được phép với PHONG_TOA_CUNG)
     */
    @Transactional
    public void giaiPhongDuongRay(String maRay, String maSuCo, String maTaiKhoan, 
                                   String quyenTruyCap, String diaChiIp) {
        DuongRay ray = duongRayRepo.findById(maRay)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đường ray"));

        String trangThaiCu = ray.getTrangThai();

        // Kiểm tra quyền
        if ("PHONG_TOA_CUNG".equals(trangThaiCu) && !"BAN_QUAN_LY".equals(quyenTruyCap)) {
            throw new RuntimeException("Chỉ Ban Quản lý mới có quyền giải phóng phong tỏa cứng");
        }

        // Kiểm tra tất cả lịch trình bị ảnh hưởng đã được xử lý
        List<LichTrinh> lichTrinhChuaXuLy = lichTrinhRepo.findByMaSuCoAnhHuongAndPhuongAnXuLy(
                maSuCo, "CHO_RAY");

        if (!lichTrinhChuaXuLy.isEmpty()) {
            throw new RuntimeException("Còn " + lichTrinhChuaXuLy.size() + 
                    " lịch trình chưa được xử lý phương án");
        }

        // Giải phóng ray
        ray.setTrangThai("SAN_SANG");
        ray.setThoiGianXuLyUocTinh(null);
        ray.setThoiGianPhongToaUocTinh(null);
        duongRayRepo.save(ray);

        // Cập nhật trạng thái sự cố
        SuCo suCo = suCoRepo.findById(maSuCo)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sự cố"));
        suCo.setTrangThaiXuLy("DA_XU_LY");
        suCo.setNgayXuLy(LocalDateTime.now());
        suCoRepo.save(suCo);

        // Ghi nhật ký
        ghiNhatKy(maTaiKhoan, "GIAI_PHONG_RAY", "DUONG_RAY", maRay,
                "Trạng thái: " + trangThaiCu,
                "Trạng thái: SAN_SANG, Sự cố " + maSuCo + " đã xử lý xong",
                diaChiIp);
    }

    /**
     * Tự động kiểm tra và giải phóng đường ray PHONG_TOA_TAM
     * Được gọi sau mỗi lần xử lý lịch trình (HUY_CHUYEN / DOI_RAY)
     * Điều kiện: không còn lịch trình nào ở trạng thái CHO_RAY và ray là PHONG_TOA_TAM
     */
    private void kiemTraTuDongGiaiPhongRay(LichTrinh lichTrinh, String maTaiKhoan, String diaChiIp) {
        String maSuCo = lichTrinh.getMaSuCoAnhHuong();
        if (maSuCo == null) return;

        SuCo suCo = suCoRepo.findById(maSuCo).orElse(null);
        if (suCo == null) return;

        // Không tự động giải phóng nếu sự cố đã xử lý xong hoặc chưa bắt đầu
        if ("DA_XU_LY".equals(suCo.getTrangThaiXuLy())) return;

        // Kiểm tra còn lịch trình CHO_RAY không
        List<LichTrinh> conChuaXuLy = lichTrinhRepo.findByMaSuCoAnhHuongAndPhuongAnXuLy(maSuCo, "CHO_RAY");
        if (!conChuaXuLy.isEmpty()) return; // Còn lịch trình chưa xử lý — chưa giải phóng

        // Lấy đường ray của sự cố
        if (suCo.getMaRay() == null) return;
        DuongRay ray = duongRayRepo.findById(suCo.getMaRay()).orElse(null);
        if (ray == null) return;

        // Chỉ tự động giải phóng PHONG_TOA_TAM — PHONG_TOA_CUNG cần BQL thao tác thủ công
        if (!"PHONG_TOA_TAM".equals(ray.getTrangThai())) return;

        String trangThaiCu = ray.getTrangThai();

        // Giải phóng ray
        ray.setTrangThai("SAN_SANG");
        ray.setThoiGianXuLyUocTinh(null);
        ray.setThoiGianPhongToaUocTinh(null);
        duongRayRepo.save(ray);

        // Đánh dấu sự cố là DA_XU_LY
        suCo.setTrangThaiXuLy("DA_XU_LY");
        suCo.setNgayXuLy(LocalDateTime.now());
        suCoRepo.save(suCo);

        // Ghi nhật ký tự động
        ghiNhatKy(maTaiKhoan,
                "TU_DONG_GIAI_PHONG_RAY",
                "DUONG_RAY",
                suCo.getMaRay(),
                "Trạng thái: " + trangThaiCu,
                "Trạng thái: SAN_SANG — Tự động giải phóng sau khi xử lý hết lịch trình bị ảnh hưởng bởi sự cố " + maSuCo,
                diaChiIp);
    }

    /**
     * Ghi nhật ký hệ thống
     */
    private void ghiNhatKy(String maTaiKhoan, String hanhDong, String doiTuong, 
                          String maDoiTuong, String noiDungCu, String noiDungMoi, String diaChiIp) {
        NhatKy nhatKy = NhatKy.builder()
                .maNhatKy("NK-" + System.currentTimeMillis())
                .maTaiKhoan(maTaiKhoan)
                .hanhDong(hanhDong)
                .doiTuong(doiTuong)
                .maDoiTuong(maDoiTuong)
                .noiDungCu(noiDungCu)
                .noiDungMoi(noiDungMoi)
                .diaChiIp(diaChiIp)
                .thoiGian(LocalDateTime.now())
                .build();
        
        nhatKyRepo.save(nhatKy);
    }

    /**
     * Lấy danh sách lịch trình bị ảnh hưởng bởi sự cố
     */
    public List<LichTrinh> layLichTrinhBiAnhHuong(String maSuCo) {
        return lichTrinhRepo.findByMaSuCoAnhHuong(maSuCo);
    }

    /**
     * Kiểm tra điều kiện vận hành khẩn cấp
     */
    public boolean kiemTraVanHanhKhanCap(SuCo suCo) {
        // Nếu loại sự cố là MẤT LIÊN LẠC > 10 phút
        if ("MAT_LIEN_LAC".equals(suCo.getLoaiSuCo())) {
            long phutTre = java.time.Duration.between(
                    suCo.getNgayXayRa(), LocalDateTime.now()).toMinutes();
            return phutTre > 10;
        }
        return false;
    }

    /**
     * UC-06: Xử lý trễ chuyến
     * Cập nhật số phút trễ và tính toán lại lịch trình
     */
    @Transactional
    public void xuLyTreChuyen(String maLichTrinh, int soPhutTre, String lyDo, 
                              String maTaiKhoan, String diaChiIp) {
        LichTrinh lichTrinh = lichTrinhRepo.findById(maLichTrinh)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch trình"));
        
        int soPhutTreCu = lichTrinh.getSoPhutTre() != null ? lichTrinh.getSoPhutTre() : 0;
        
        // Cập nhật số phút trễ
        lichTrinh.setSoPhutTre(soPhutTre);
        
        // Tính toán lại giờ đến/đi dự kiến
        if (lichTrinh.getGioDenDuKien() != null && soPhutTre > soPhutTreCu) {
            int chenh = soPhutTre - soPhutTreCu;
            lichTrinh.setGioDenDuKien(lichTrinh.getGioDenDuKien().plusMinutes(chenh));
        }
        if (lichTrinh.getGioDiDuKien() != null && soPhutTre > soPhutTreCu) {
            int chenh = soPhutTre - soPhutTreCu;
            lichTrinh.setGioDiDuKien(lichTrinh.getGioDiDuKien().plusMinutes(chenh));
        }
        
        // Cập nhật trạng thái
        if (soPhutTre >= 20) {
            lichTrinh.setTrangThai("TRE_NGHIEM_TRONG");
        } else if (soPhutTre > 0) {
            lichTrinh.setTrangThai("TRE");
        }
        
        // Lưu ghi chú lý do
        if (lyDo != null && !lyDo.trim().isEmpty()) {
            String ghiChuCu = lichTrinh.getGhiChu() != null ? lichTrinh.getGhiChu() : "";
            lichTrinh.setGhiChu(ghiChuCu + "\n[Trễ " + soPhutTre + "p] " + lyDo);
        }
        
        lichTrinhRepo.save(lichTrinh);
        
        // Tính toán ảnh hưởng đến các chuyến kế tiếp
        if (soPhutTre > soPhutTreCu) {
            tinhToanAnhHuongChuyenKeTiep(lichTrinh, soPhutTre - soPhutTreCu);
        }
        
        // Ghi nhật ký
        ghiNhatKy(maTaiKhoan, "XU_LY_TRE_CHUYEN", "LICH_TRINH", maLichTrinh,
                "Số phút trễ: " + soPhutTreCu,
                "Số phút trễ: " + soPhutTre + ", Lý do: " + lyDo,
                diaChiIp);
    }

    /**
     * Tính toán ảnh hưởng domino đến các chuyến kế tiếp
     */
    private void tinhToanAnhHuongChuyenKeTiep(LichTrinh lichTrinhGoc, int soPhutTreBoSung) {
        // Tìm các chuyến tàu cùng đường ray sau thời điểm này
        if (lichTrinhGoc.getMaRay() == null || lichTrinhGoc.getGioDiDuKien() == null) {
            return;
        }
        
        List<LichTrinh> lichTrinhSau = lichTrinhRepo.findByMaRay(lichTrinhGoc.getMaRay());
        
        for (LichTrinh lt : lichTrinhSau) {
            if (lt.getGioDenDuKien() != null && 
                lt.getGioDenDuKien().isAfter(lichTrinhGoc.getGioDiDuKien())) {
                
                // Kiểm tra xem có bị ảnh hưởng không
                long khoangCachPhut = java.time.Duration.between(
                        lichTrinhGoc.getGioDiDuKien(), 
                        lt.getGioDenDuKien()
                ).toMinutes();
                
                // Nếu khoảng cách < 30 phút, có thể bị ảnh hưởng
                if (khoangCachPhut < 30) {
                    int soPhutTreHienTai = lt.getSoPhutTre() != null ? lt.getSoPhutTre() : 0;
                    int soPhutTreMoi = soPhutTreHienTai + (soPhutTreBoSung / 2); // Giảm dần
                    
                    lt.setSoPhutTre(soPhutTreMoi);
                    if (lt.getGioDenDuKien() != null) {
                        lt.setGioDenDuKien(lt.getGioDenDuKien().plusMinutes(soPhutTreBoSung / 2));
                    }
                    if (lt.getGioDiDuKien() != null) {
                        lt.setGioDiDuKien(lt.getGioDiDuKien().plusMinutes(soPhutTreBoSung / 2));
                    }
                    
                    lichTrinhRepo.save(lt);
                }
            }
        }
    }

    /**
     * Kiểm tra ngưỡng 20 phút - Yêu cầu thu hồi lệnh
     */
    public boolean kiemTraNguong20Phut(LichTrinh lichTrinh) {
        if (lichTrinh.getSoPhutTre() != null && lichTrinh.getSoPhutTre() >= 20) {
            // Kiểm tra xem tàu đã xuất phát chưa
            if (lichTrinh.getGioDiThucTe() == null) {
                return true; // Cần thu hồi lệnh
            }
        }
        return false;
    }

    /**
     * Thu hồi lệnh và giải phóng ray (Ngưỡng 20 phút)
     */
    @Transactional
    public void thuHoiLenhGiaiPhongRay(String maLichTrinh, String lyDo, 
                                       String maTaiKhoan, String diaChiIp) {
        LichTrinh lichTrinh = lichTrinhRepo.findById(maLichTrinh)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch trình"));
        
        String trangThaiCu = lichTrinh.getTrangThai();
        String maRayCu = lichTrinh.getMaRay();
        
        // Giải phóng ray
        if (lichTrinh.getMaRay() != null) {
            DuongRay ray = duongRayRepo.findById(lichTrinh.getMaRay())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy đường ray"));
            
            ray.setTrangThai("SAN_SANG");
            duongRayRepo.save(ray);
        }
        
        // Hủy lịch trình
        lichTrinh.setTrangThai("HUY_CHUYEN");
        lichTrinh.setPhuongAnXuLy("HUY_CHUYEN");
        
        // Lưu lý do
        String ghiChuCu = lichTrinh.getGhiChu() != null ? lichTrinh.getGhiChu() : "";
        lichTrinh.setGhiChu(ghiChuCu + "\n[Thu hồi lệnh] " + lyDo);
        
        lichTrinhRepo.save(lichTrinh);
        
        // Ghi nhật ký
        ghiNhatKy(maTaiKhoan, "THU_HOI_LENH", "LICH_TRINH", maLichTrinh,
                "Trạng thái: " + trangThaiCu + ", Ray: " + maRayCu,
                "Trạng thái: HUY_CHUYEN, Lý do: " + lyDo,
                diaChiIp);
    }

    /**
     * Lưu nháp sự cố (chưa kích hoạt phong tỏa)
     */
    @Transactional
    public SuCo luuNhapSuCo(SuCo suCo, String maTaiKhoan, String diaChiIp) {
        suCo.setNgayTao(LocalDateTime.now());
        suCo.setTrangThaiXuLy("NHAP");
        SuCo savedSuCo = suCoRepo.save(suCo);
        
        // Ghi nhật ký
        ghiNhatKy(maTaiKhoan, "LUU_NHAP_SU_CO", "SU_CO", savedSuCo.getMaSuCo(),
                null, "Lưu nháp sự cố: " + suCo.getLoaiSuCo(),
                diaChiIp);
        
        return savedSuCo;
    }

    /**
     * Kích hoạt sự cố từ nháp
     */
    @Transactional
    public SuCo kichHoatSuCoTuNhap(String maSuCo, String maTaiKhoan, String diaChiIp) {
        SuCo suCo = suCoRepo.findById(maSuCo)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sự cố"));
        
        if (!"NHAP".equals(suCo.getTrangThaiXuLy())) {
            throw new RuntimeException("Sự cố không ở trạng thái nháp");
        }
        
        // Kích hoạt như ghi nhận sự cố bình thường
        return ghiNhanSuCo(suCo, maTaiKhoan, diaChiIp);
    }

    /**
     * Báo cáo sự cố nhanh - Dành cho nhân viên nhà ga
     * Tạo sự cố nhanh với thông tin tối thiểu
     */
    @Transactional
    public SuCo baoCaoNhanh(String maLichTrinh, String loaiSuCo, String moTa, 
                            String maTaiKhoan, String diaChiIp) {
        // Lấy thông tin lịch trình
        LichTrinh lichTrinh = lichTrinhRepo.findById(maLichTrinh)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch trình"));
        
        // Tạo sự cố với thông tin từ lịch trình
        SuCo suCo = new SuCo();
        suCo.setMaSuCo("SC-QUICK-" + System.currentTimeMillis());
        suCo.setMaLichTrinh(maLichTrinh);
        suCo.setMaRay(lichTrinh.getMaRay());
        suCo.setMaNguoiGhiNhan(maTaiKhoan);
        suCo.setLoaiSuCo(loaiSuCo != null ? loaiSuCo : "TRE_TAU");
        
        // Tự động xác định mức độ dựa trên số phút trễ
        int soPhutTre = lichTrinh.getSoPhutTre() != null ? lichTrinh.getSoPhutTre() : 0;
        if (soPhutTre >= 20) {
            suCo.setMucDo("CAO");
        } else if (soPhutTre >= 10) {
            suCo.setMucDo("TRUNG_BINH");
        } else {
            suCo.setMucDo("THAP");
        }
        
        // Mô tả tự động nếu không có
        if (moTa == null || moTa.trim().isEmpty()) {
            moTa = String.format(
                "Báo cáo nhanh: Tàu %s trễ %d phút. Cần hỗ trợ từ điều hành.",
                lichTrinh.getMaChuyenTau(),
                soPhutTre
            );
        }
        suCo.setMoTa(moTa);
        
        suCo.setKichHoatPhongToa(false); // Không phong tỏa tự động
        suCo.setNgayXayRa(LocalDateTime.now());
        suCo.setNgayTao(LocalDateTime.now());
        suCo.setTrangThaiXuLy("CHUA_XU_LY");
        
        SuCo savedSuCo = suCoRepo.save(suCo);
        
        // Gắn thẻ sự cố cho lịch trình
        if (lichTrinh.getMaSuCoAnhHuong() == null) {
            lichTrinh.setMaSuCoAnhHuong(savedSuCo.getMaSuCo());
            lichTrinh.setPhuongAnXuLy("CHO_RAY");
            lichTrinhRepo.save(lichTrinh);
        }
        
        // Ghi nhật ký
        ghiNhatKy(maTaiKhoan, "BAO_CAO_NHANH", "SU_CO", savedSuCo.getMaSuCo(),
                null, "Báo cáo nhanh: " + loaiSuCo + " - " + lichTrinh.getMaChuyenTau(),
                diaChiIp);
        
        return savedSuCo;
    }

    /**
     * Tìm sự cố theo mã
     */
    public SuCo timSuCoTheoMa(String maSuCo) {
        return suCoRepo.findById(maSuCo)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sự cố: " + maSuCo));
    }

    /**
     * Lưu sự cố
     */
    public SuCo luuSuCo(SuCo suCo) {
        return suCoRepo.save(suCo);
    }
}
