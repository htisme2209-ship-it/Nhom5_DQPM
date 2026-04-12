package com.danang.railway.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "TAU")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Tau {

    @Id
    @Column(name = "ma_tau", length = 20)
    private String maTau;

    @Column(name = "ten_tau", length = 100, nullable = false, unique = true)
    private String tenTau;

    @Column(name = "loai_tau", length = 20, nullable = false)
    private String loaiTau;

    @Column(name = "so_toa", nullable = false)
    private Integer soToa;

    @Column(name = "suc_chua_hanh_khach", nullable = false)
    private Integer sucChuaHanhKhach;

    @Column(name = "trang_thai", length = 20, nullable = false)
    private String trangThai = "HOAT_DONG";

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
