package com.danang.railway.repository;

import com.danang.railway.entity.ChuyenTau;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ChuyenTauRepository extends JpaRepository<ChuyenTau, String> {
    List<ChuyenTau> findByVaiTroTaiDaNang(String vaiTro);
    List<ChuyenTau> findByMaTau(String maTau);
    List<ChuyenTau> findByTrangThai(String trangThai);
    
    // Tìm chuyến tàu theo ngày chạy
    @Query("SELECT c FROM ChuyenTau c WHERE c.ngayChay = :ngayChay")
    List<ChuyenTau> findByNgayChay(@Param("ngayChay") String ngayChay);
}
