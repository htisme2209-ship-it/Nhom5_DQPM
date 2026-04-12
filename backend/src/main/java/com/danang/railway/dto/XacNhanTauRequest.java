package com.danang.railway.dto;

import lombok.Data;

/**
 * DTO cho request xác nhận tàu
 */
@Data
public class XacNhanTauRequest {
    private String maLichTrinh;
    private String trangThai; // "VAO_GA" hoặc "XUAT_PHAT"
    private Boolean daKiemTraAnToan; // Checkbox xác nhận an toàn
    private String ghiChu; // Ghi chú vận hành (optional)
}
