package com.danang.railway.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "CHI_DAO")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ChiDao {

    @Id
    @Column(name = "ma_chi_dao", length = 20)
    private String maChiDao;

    @Column(name = "ma_nguoi_gui", length = 20, nullable = false)
    private String maNguoiGui;

    @Column(name = "ma_nguoi_nhan", length = 20, nullable = false)
    private String maNguoiNhan;

    @Column(name = "tieu_de", length = 300, nullable = false)
    private String tieuDe;

    @Column(name = "noi_dung", length = 2000, nullable = false)
    private String noiDung;

    @Column(name = "muc_do_uu_tien", length = 20, nullable = false)
    private String mucDoUuTien = "BINH_THUONG";

    @Column(name = "trang_thai", length = 20, nullable = false)
    private String trangThai = "DA_GUI";

    @Column(name = "ngay_gui", nullable = false)
    private LocalDateTime ngayGui;

    @Column(name = "ngay_doc")
    private LocalDateTime ngayDoc;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_nguoi_gui", insertable = false, updatable = false)
    @JsonIgnore
    private TaiKhoan nguoiGui;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ma_nguoi_nhan", insertable = false, updatable = false)
    @JsonIgnore
    private TaiKhoan nguoiNhan;

    @PrePersist
    protected void onCreate() {
        ngayGui = LocalDateTime.now();
    }
}
