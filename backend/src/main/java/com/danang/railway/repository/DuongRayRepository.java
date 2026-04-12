package com.danang.railway.repository;

import com.danang.railway.entity.DuongRay;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DuongRayRepository extends JpaRepository<DuongRay, String> {
    List<DuongRay> findByMaGa(String maGa);
    List<DuongRay> findByTrangThai(String trangThai);
}
