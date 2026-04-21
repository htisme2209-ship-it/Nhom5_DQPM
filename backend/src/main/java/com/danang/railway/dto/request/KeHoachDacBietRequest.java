package com.danang.railway.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class KeHoachDacBietRequest {
//    @NotBlank
//    private String maNguoiGui;

    private String maLichTrinh;

    @NotBlank
    private String tieuDe;

    @NotBlank
    private String noiDung;

    private String mucDoUuTien;
}
