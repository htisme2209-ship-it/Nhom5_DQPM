package com.danang.railway.controller;

import com.danang.railway.dto.ApiResponse;
import com.danang.railway.dto.request.KeHoachDacBietRequest;
import com.danang.railway.dto.response.KeHoachDacBietResponse;
import com.danang.railway.service.KeHoachDacBietService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/kehoach")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class KeHoachDacBietController {
    KeHoachDacBietService keHoachDacBietService;

    @PostMapping
    ApiResponse<KeHoachDacBietResponse> createKeHoachDacBiet(@RequestBody KeHoachDacBietRequest request){
        return ApiResponse.<KeHoachDacBietResponse>builder()
                .data(keHoachDacBietService.creatKeHoachDB(request))
                .build();
    }
    @GetMapping
    ApiResponse<List<KeHoachDacBietResponse>> listKeHoachDacBiet(){
        return ApiResponse.<List<KeHoachDacBietResponse>>builder()
                .data(keHoachDacBietService.getAllKeHoachDacBiet())
                .build();
    }
    @GetMapping("/{id}")
    ApiResponse<KeHoachDacBietResponse> getKeHoachDacBietById(@PathVariable String id){
        return ApiResponse.<KeHoachDacBietResponse>builder()
                .data(keHoachDacBietService.getKeHoachDacBietById(id))
                .build();
    }

}
