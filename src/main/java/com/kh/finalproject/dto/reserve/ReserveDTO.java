package com.kh.finalproject.dto.reserve;

import com.kh.finalproject.entity.Reserve;
import com.kh.finalproject.entity.enumurate.ReserveStatus;
import lombok.Getter;

import java.time.format.DateTimeFormatter;
import java.util.Objects;

/**
 * 예매 DTO
 */
@Getter
public class ReserveDTO {
    private Long index;

    private String ticket;
    private Integer count;

    private Long reserveTimeSeatPriceIndex;

    private String reserveSeat;

    private String method;

    private Integer amount;

    private Integer discount;

    private Integer finalAmount;

    private ReserveStatus status;

    private String refund;

    private String cancel;

    public ReserveDTO toDTO(Reserve reserve) {
        this.index = reserve.getIndex();
        this.ticket = reserve.getTicket();
        this.count = reserve.getCount();
        this.reserveTimeSeatPriceIndex = reserve.getReserveTimeSeatPriceIndex();
        this.reserveSeat = reserve.getReserveSeat();
        this.method = reserve.getMethod();
        this.amount = reserve.getAmount();
        this.discount = reserve.getDiscount();
        this.finalAmount = reserve.getFinalAmount();
        this.status = reserve.getStatus();
        if (!Objects.isNull(reserve.getRefund())) {
            this.refund = reserve.getRefund().format(DateTimeFormatter.ofPattern("yyyy.MM.dd"));
        }
        if (!Objects.isNull(reserve.getCancel())) {
            this.cancel = reserve.getCancel().format(DateTimeFormatter.ofPattern("yyyy.MM.dd"));
        }

        return this;
    }
}
