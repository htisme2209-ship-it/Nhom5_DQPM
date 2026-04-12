package com.danang.railway.repository;

import com.danang.railway.entity.KeHoachDacBiet;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface KeHoachDacBietRepository extends JpaRepository<KeHoachDacBiet, String> {
    List<KeHoachDacBiet> findByTrangThai(String trangThai);
    List<KeHoachDacBiet> findByMaNguoiGui(String maNguoiGui);
    List<KeHoachDacBiet> findByTrangThaiOrderByNgayGuiDesc(String trangThai);
}
