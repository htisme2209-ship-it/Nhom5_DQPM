package com.danang.railway.repository;

import com.danang.railway.entity.ChiDao;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChiDaoRepository extends JpaRepository<ChiDao, String> {
    List<ChiDao> findByMaNguoiNhanOrderByNgayGuiDesc(String maNguoiNhan);
    List<ChiDao> findByMaNguoiGuiOrderByNgayGuiDesc(String maNguoiGui);
    List<ChiDao> findByTrangThai(String trangThai);
}
