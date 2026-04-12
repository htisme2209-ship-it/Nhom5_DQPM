package com.danang.railway.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.time.LocalDate;

@Entity
@Table(name = "TAI_KHOAN")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class TaiKhoan {

    @Id
    @Column(name = "ma_tai_khoan", length = 20)
    private String maTaiKhoan;

    @Column(name = "quyen_truy_cap", length = 30, nullable = false)
    private String quyenTruyCap;

    @Column(name = "ho_ten", length = 150, nullable = false)
    private String hoTen;

    @Column(name = "email", length = 100, nullable = false, unique = true)
    private String email;

    @Column(name = "so_dien_thoai", length = 15, unique = true)
    private String soDienThoai;

    @Column(name = "mat_khau", length = 255, nullable = false)
    private String matKhau;

    @Column(name = "gioi_tinh", length = 10, nullable = false)
    private String gioiTinh;

    @Column(name = "ngay_sinh")
    private LocalDate ngaySinh;

    @Column(name = "trang_thai", length = 20, nullable = false)
    private String trangThai = "CHO_XAC_NHAN";

    @Column(name = "ngay_tao", nullable = false)
    private LocalDateTime ngayTao;

    @Column(name = "ngay_cap_nhat")
    private LocalDateTime ngayCapNhat;

    @PrePersist
    protected void onCreate() {
        ngayTao = LocalDateTime.now();
        ngayCapNhat = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        ngayCapNhat = LocalDateTime.now();
    }
}
