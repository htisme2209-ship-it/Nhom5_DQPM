package com.danang.railway.service;

import com.danang.railway.dto.request.KeHoachDacBietRequest;
import com.danang.railway.dto.response.KeHoachDacBietResponse;
import com.danang.railway.entity.KeHoachDacBiet;
import com.danang.railway.mapper.KeHoachDacBietMapper;
import com.danang.railway.repository.KeHoachDacBietRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.log4j.Log4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Service
@FieldDefaults(level = AccessLevel.PRIVATE,makeFinal=true)

public class KeHoachDacBietService {
    KeHoachDacBietRepository keHoachDacBietRepository;
    KeHoachDacBietMapper keHoachDacBietMapper;


    public KeHoachDacBietResponse creatKeHoachDB(KeHoachDacBietRequest request){
        String idNguoiGui = SecurityContextHolder.getContext().getAuthentication().getName();
        System.err.println(idNguoiGui);

        KeHoachDacBiet keHoachDacBiet = keHoachDacBietMapper.toKeHoachDacBiet(request);
        keHoachDacBiet.setMaKeHoach("KH_" + UUID.randomUUID().toString().substring(0, 8));
        keHoachDacBiet.setMaNguoiGui(idNguoiGui);
        keHoachDacBiet.setNgayGui(LocalDate.now().atStartOfDay());
        keHoachDacBiet.setTrangThai("Chờ duyệt");
        keHoachDacBiet.setYKienDuyet("");

        keHoachDacBietRepository.save(keHoachDacBiet);

        return keHoachDacBietMapper.toKeHoachDacBietResponse(keHoachDacBiet);

    }
    public List<KeHoachDacBietResponse> getAllKeHoachDacBiet(){
       return keHoachDacBietRepository.findAll()
               .stream()
               .map(keHoachDacBietMapper::toKeHoachDacBietResponse)
               .toList();
    }
    public KeHoachDacBietResponse getKeHoachDacBietById(String id){
        return keHoachDacBietMapper.toKeHoachDacBietResponse(keHoachDacBietRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy kế hoạch đặc biệt")));
    }
}
