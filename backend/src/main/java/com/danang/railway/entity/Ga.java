package com.danang.railway.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "GA")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Ga {

    @Id
    @Column(name = "ma_ga", length = 20)
    private String maGa;

    @Column(name = "ten_ga", length = 150, nullable = false, unique = true)
    private String tenGa;

    @Column(name = "dia_chi", length = 300, nullable = false)
    private String diaChi;

    @Column(name = "thu_tu_tren_tuyen")
    private Integer thuTuTrenTuyen;

    @Column(name = "trang_thai", length = 20, nullable = false)
    private String trangThai = "HOAT_DONG";

    @Column(name = "ngay_tao", nullable = false)
    private LocalDateTime ngayTao;

    @PrePersist
    protected void onCreate() {
        ngayTao = LocalDateTime.now();
    }
}
