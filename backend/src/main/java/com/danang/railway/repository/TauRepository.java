package com.danang.railway.repository;

import com.danang.railway.entity.Tau;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TauRepository extends JpaRepository<Tau, String> {
    List<Tau> findByTrangThai(String trangThai);
    List<Tau> findByLoaiTau(String loaiTau);
}
