package com.danang.railway.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "GA_TUYEN")
@IdClass(GaTuyenId.class)
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class GaTuyen {

    @Id
    @Column(name = "ma_ga", length = 20)
    private String maGa;

    @Id
    @Column(name = "ma_tuyen", length = 20)
    private String maTuyen;

    @Column(name = "thu_tu_tren_tuyen", nullable = false)
    private Integer thuTuTrenTuyen;

    @Column(name = "khoang_cach_tu_dau_km", precision = 8, scale = 2, nullable = false)
    private BigDecimal khoangCachTuDauKm;

    @Column(name = "thoi_gian_dung_phut", nullable = false)
    private Integer thoiGianDungPhut = 0;

    @Column(name = "ngay_tao", nullable = false)
    private LocalDateTime ngayTao;

    @PrePersist
    protected void onCreate() {
        ngayTao = LocalDateTime.now();
    }
}
