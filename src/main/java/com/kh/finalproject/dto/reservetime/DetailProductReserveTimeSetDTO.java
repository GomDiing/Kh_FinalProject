package com.kh.finalproject.dto.reservetime;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
public class DetailProductReserveTimeSetDTO {
    String year;
    String month;
    String day;
    String date;

    @JsonProperty("reserve_list")
    List<DetailProductReserveTimeDTO> detailProductReserveTimeDTOList = new ArrayList<>();

    public DetailProductReserveTimeSetDTO toDTO(DetailProductReserveTimeDTO detailProductReserveTimeDTO) {
        this.year = detailProductReserveTimeDTO.getDate().split("/")[0];
        this.month = detailProductReserveTimeDTO.getDate().split("/")[1];
        this.day = detailProductReserveTimeDTO.getDate().split("/")[2];
        this.date = detailProductReserveTimeDTO.getDate();

        return this;
    }
}
