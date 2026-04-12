package com.danang.railway.repository;

import com.danang.railway.entity.NhatKy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface NhatKyRepository extends JpaRepository<NhatKy, String> {
    List<NhatKy> findByMaTaiKhoan(String maTaiKhoan);
    Page<NhatKy> findAllByOrderByThoiGianDesc(Pageable pageable);
    List<NhatKy> findByDoiTuong(String doiTuong);
}
