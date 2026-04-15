package com.danang.railway.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class KeHoachDacBietResponse {
    private String maKeHoach;

    private String maLichTrinh;

    private String tieuDe;
    private String noiDung;

    private String mucDoUuTien;
    private String trangThai;

    private String yKienDuyet;

    private LocalDateTime ngayGui;
    private LocalDateTime ngayDuyet;
}
