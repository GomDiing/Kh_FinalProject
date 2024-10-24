package com.kh.finalproject.dto.reservetime;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Getter
public class DetailProductReserveTimeSetDTO {
    Integer year;
    Integer month;
    Integer day;
    String date;

    @JsonProperty("reserve_list")
    List<DetailProductReserveTimeDTO> detailProductReserveTimeDTOList = new ArrayList<>();

    public DetailProductReserveTimeSetDTO toDTO(DetailProductReserveTimeDTO detailProductReserveTimeDTO) {
        this.year = Integer.parseInt(detailProductReserveTimeDTO.getDate().split("/")[0]);
        this.month = Integer.parseInt(detailProductReserveTimeDTO.getDate().split("/")[1]);
        this.day = Integer.parseInt(detailProductReserveTimeDTO.getDate().split("/")[2]);
        this.date = detailProductReserveTimeDTO.getDate();

        return this;
    }

    public DetailProductReserveTimeSetDTO toDTO(List<DetailProductReserveTimeDTO> detailProductReserveTimeDTOList) {
//        log.info("detailProductReserveTimeDTOList.get(0).getDate()={}", detailProductReserveTimeDTOList.get(0).getDate());
        this.year = Integer.parseInt(detailProductReserveTimeDTOList.get(0).getDate().split("/")[0]);
        this.month = Integer.parseInt(detailProductReserveTimeDTOList.get(0).getDate().split("/")[1]);
        this.day = Integer.parseInt(detailProductReserveTimeDTOList.get(0).getDate().split("/")[2]);
        this.date = detailProductReserveTimeDTOList.get(0).getDate();
        this.detailProductReserveTimeDTOList = detailProductReserveTimeDTOList;

        return this;
    }


}
