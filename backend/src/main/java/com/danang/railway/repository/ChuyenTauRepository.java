package com.danang.railway.repository;

import com.danang.railway.entity.ChuyenTau;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChuyenTauRepository extends JpaRepository<ChuyenTau, String> {
    List<ChuyenTau> findByVaiTroTaiDaNang(String vaiTro);
    List<ChuyenTau> findByMaTau(String maTau);
    List<ChuyenTau> findByTrangThai(String trangThai);
}
