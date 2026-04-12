package com.danang.railway.dto;

import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LoginResponse {
    private String token;
    private String maTaiKhoan;
    private String hoTen;
    private String email;
    private String quyenTruyCap;
    private String trangThai;
}
