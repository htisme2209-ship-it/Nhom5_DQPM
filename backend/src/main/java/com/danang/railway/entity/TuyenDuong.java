package com.danang.railway.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "TUYEN_DUONG")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class TuyenDuong {

    @Id
    @Column(name = "ma_tuyen", length = 20)
    private String maTuyen;

    @Column(name = "ten_tuyen", length = 200, nullable = false, unique = true)
    private String tenTuyen;

    @Column(name = "ma_ga_dau", length = 20, nullable = false)
    private String maGaDau;

    @Column(name = "ma_ga_cuoi", length = 20, nullable = false)
    private String maGaCuoi;

    @Column(name = "khoang_cach_km", precision = 8, scale = 2, nullable = false)
    private BigDecimal khoangCachKm;

    @Column(name = "trang_thai", length = 20, nullable = false)
    private String trangThai = "HOAT_DONG";

    @Column(name = "ngay_tao", nullable = false)
    private LocalDateTime ngayTao;

    @PrePersist
    protected void onCreate() {
        ngayTao = LocalDateTime.now();
    }
}
