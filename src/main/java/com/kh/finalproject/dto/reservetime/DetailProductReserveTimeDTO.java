package com.kh.finalproject.dto.reservetime;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.kh.finalproject.dto.reserveTimeSeatPrice.ReserveTimeSeatPriceDTO;
import com.kh.finalproject.entity.ReserveTime;
import com.kh.finalproject.entity.enumurate.ProductCategory;
import lombok.Getter;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

@Getter
public class DetailProductReserveTimeDTO {
    private Long index;
    @JsonIgnore
    private LocalDateTime time;
    @JsonIgnore
    private String date;
    private Integer turn;
    private Integer hour;
    private Integer minute;
    @JsonIgnore
    private ProductCategory category;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonProperty("compact_casting")
    private List<String> castingList = new LinkedList<>();

    @JsonProperty("reserve_seat_time")
    private List<ReserveTimeSeatPriceDTO> reserveTimeSeatPriceListDTOList = new ArrayList<>();

    /**
     * 상세 페이지 조회시 사용
     * ReserveTime Entity -> DTO
     */
    public DetailProductReserveTimeDTO toDTO(ReserveTime reserveTime) {
        this.index = reserveTime.getIndex();
//        this.time = reserveTime.getTime().format(DateTimeFormatter.ofPattern("yyyy.MM.dd"));
        this.time = reserveTime.getTime();
        this.date = reserveTime.getDate();
        this.turn = reserveTime.getTurn();
        this.hour = reserveTime.getHour();
        this.minute = reserveTime.getMinute();
        this.category = reserveTime.getCategory();

        return this;
    }

    public void updateReserveTimeSeatPrice(List<ReserveTimeSeatPriceDTO> reserveTimeSeatPriceListDTOList) {
        this.reserveTimeSeatPriceListDTOList = reserveTimeSeatPriceListDTOList;
    }
    public void addCastingList(String castingActor) {
        this.castingList.add(castingActor);
    }

    @Override
    public String toString() {
        return "DetailProductReserveTimeDTO{" +
                "index=" + index +
                ", time=" + time +
                ", date='" + date + '\'' +
                ", turn=" + turn +
                ", hour=" + hour +
                ", minute=" + minute +
                ", category=" + category +
                ", castingList=" + castingList +
                ", reserveTimeSeatPriceListDTOList=" + reserveTimeSeatPriceListDTOList +
                '}';
    }
}
