package com.danang.railway.repository;

import com.danang.railway.entity.TaiKhoan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface TaiKhoanRepository extends JpaRepository<TaiKhoan, String> {
    Optional<TaiKhoan> findByEmail(String email);
    boolean existsByEmail(String email);
    List<TaiKhoan> findByQuyenTruyCap(String quyenTruyCap);
    List<TaiKhoan> findByTrangThai(String trangThai);
}
