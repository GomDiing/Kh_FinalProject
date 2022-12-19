package com.kh.finalproject.dto.reserveTimeSeatPrice;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.kh.finalproject.entity.ReserveTimeSeatPrice;
import lombok.Getter;

import javax.persistence.Column;

/**
 * 예매시간 좌석/가격 DTO
 */
@Getter
public class ReserveTimeSeatPriceDTO {
    private Long index;
    private String seat;

    @JsonProperty("total_quantity")
    private Integer totalQuantity;

    @JsonProperty("remain_quantity")
    private Integer remainQuantity;

    @JsonProperty("is_reserve")
    private Boolean isReserve;

    public ReserveTimeSeatPriceDTO toDTO(ReserveTimeSeatPrice reserveTimeSeatPrice) {
        this.index = reserveTimeSeatPrice.getIndex();
        this.seat = reserveTimeSeatPrice.getSeatPrice().getSeat();
        this.totalQuantity = reserveTimeSeatPrice.getTotalQuantity();
        this.remainQuantity = reserveTimeSeatPrice.getRemainQuantity();
        if (!(reserveTimeSeatPrice.getTotalQuantity() == 0)) {
            this.isReserve = reserveTimeSeatPrice.getRemainQuantity() > 0;
        }
        else this.isReserve = true;

        return this;
    }
}
