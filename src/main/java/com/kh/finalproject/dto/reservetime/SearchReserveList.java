package com.kh.finalproject.dto.reservetime;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
public class SearchReserveList {
    @JsonProperty("reserve_day_in_month")
    List<Integer> reserveTimeDayListInMonth;
    Integer year;
    Integer month;
    Integer day;
    String date;

    @JsonProperty("reserve_list")
    List<DetailProductReserveTimeDTO> detailProductReserveTimeDTOList = new ArrayList<>();

    public SearchReserveList toDTO(DetailProductReserveTimeDTO detailProductReserveTimeDTO) {
        this.year = Integer.parseInt(detailProductReserveTimeDTO.getDate().split("/")[0]);
        this.month = Integer.parseInt(detailProductReserveTimeDTO.getDate().split("/")[1]);
        this.day = Integer.parseInt(detailProductReserveTimeDTO.getDate().split("/")[2]);
        this.date = detailProductReserveTimeDTO.getDate();

        return this;
    }

    public SearchReserveList updateReserveTime(List<DetailProductReserveTimeSetDTO> detailProductReserveTimeSetDTO,
                                  List<Integer> reserveTimeDayListInMonth) {
        this.year = detailProductReserveTimeSetDTO.get(0).getYear();
        this.month = detailProductReserveTimeSetDTO.get(0).getMonth();
        this.day = detailProductReserveTimeSetDTO.get(0).getDay();
        this.date = detailProductReserveTimeSetDTO.get(0).getDate();
        this.detailProductReserveTimeDTOList = detailProductReserveTimeSetDTO.get(0).getDetailProductReserveTimeDTOList();
        this.reserveTimeDayListInMonth = reserveTimeDayListInMonth;

        return this;
    }
}
