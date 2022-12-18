package com.kh.finalproject.dto.seatPrice;

import com.kh.finalproject.entity.SeatPrice;
import lombok.Getter;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

/**
 * 좌석/가격 DTO
 */
@Getter
public class SeatPriceDTO {
    private Long index;

    private String seat;

    private Integer price;

    public SeatPriceDTO toDTO(SeatPrice seatPrice) {
        this.index = seatPrice.getIndex();
        this.seat = seatPrice.getSeat();
        this.price = seatPrice.getPrice();

        return this;
    }
}
