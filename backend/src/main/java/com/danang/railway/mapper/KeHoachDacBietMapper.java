package com.danang.railway.mapper;

import com.danang.railway.dto.request.KeHoachDacBietRequest;
import com.danang.railway.dto.response.KeHoachDacBietResponse;
import com.danang.railway.entity.KeHoachDacBiet;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface KeHoachDacBietMapper {
    KeHoachDacBiet toKeHoachDacBiet(KeHoachDacBietRequest request);
    KeHoachDacBietResponse toKeHoachDacBietResponse(KeHoachDacBiet keHoachDacBiet);
}
