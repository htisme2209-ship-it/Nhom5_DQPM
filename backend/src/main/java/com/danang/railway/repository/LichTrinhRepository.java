package com.danang.railway.repository;

import com.danang.railway.entity.LichTrinh;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface LichTrinhRepository extends JpaRepository<LichTrinh, String> {
    List<LichTrinh> findByMaChuyenTau(String maChuyenTau);
    List<LichTrinh> findByMaRay(String maRay);
    List<LichTrinh> findByTrangThai(String trangThai);

    // Query dựa trên giờ đến/đi thay vì ngày chạy
    @Query("SELECT l FROM LichTrinh l WHERE l.gioDenDuKien >= :start AND l.gioDenDuKien <= :end")
    List<LichTrinh> findByGioDenDuKienBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COUNT(l) FROM LichTrinh l WHERE l.soPhutTre > 0 AND l.gioDenDuKien >= :start AND l.gioDenDuKien <= :end")
    long countTreChuyen(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COUNT(l) FROM LichTrinh l WHERE l.gioDenDuKien >= :start AND l.gioDenDuKien <= :end")
    long countTotalChuyen(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    // Queries cho UC-09 và UC-06
    List<LichTrinh> findByMaSuCoAnhHuong(String maSuCo);
    
    List<LichTrinh> findByMaSuCoAnhHuongAndPhuongAnXuLy(String maSuCo, String phuongAnXuLy);
    
    // Queries cho UC-10: Xác nhận tàu
    @Query("SELECT l FROM LichTrinh l WHERE l.gioDenDuKien >= :start AND l.gioDenDuKien <= :end AND l.trangThai IN :trangThais ORDER BY l.gioDenDuKien ASC")
    List<LichTrinh> findByNgayChayBetweenAndTrangThaiIn(
        @Param("start") LocalDateTime start, 
        @Param("end") LocalDateTime end, 
        @Param("trangThais") List<String> trangThais
    );
}
