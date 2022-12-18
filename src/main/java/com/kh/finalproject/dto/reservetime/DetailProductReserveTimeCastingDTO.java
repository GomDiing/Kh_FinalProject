package com.kh.finalproject.dto.reservetime;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.kh.finalproject.dto.casting.CastingSimpleDTO;
import lombok.Getter;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

@Getter
public class DetailProductReserveTimeCastingDTO {

    @JsonProperty("month_day")
    private String monthDayName;

    @JsonProperty("hour_min")
    private String hourMin;

    @JsonProperty("casting_simple_list")
    private List<CastingSimpleDTO> castingSimpleDTOList = new LinkedList<>();

    /**
     * 시간별 상세 캐스팅 정보 조회 DTO
     * 상세 페이지에 사용
     */
    public DetailProductReserveTimeCastingDTO toDTO(String monthDayName, String hourMin, List<CastingSimpleDTO> castingSimpleDTOList) {
        this.monthDayName = monthDayName;
        this.hourMin = hourMin;
        this.castingSimpleDTOList = castingSimpleDTOList;

        return this;
    }
}
