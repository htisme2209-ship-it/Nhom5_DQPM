package com.danang.railway.repository;

import com.danang.railway.entity.GaTuyen;
import com.danang.railway.entity.GaTuyenId;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GaTuyenRepository extends JpaRepository<GaTuyen, GaTuyenId> {
    List<GaTuyen> findByMaTuyenOrderByThuTuTrenTuyenAsc(String maTuyen);
    List<GaTuyen> findByMaGa(String maGa);
}
