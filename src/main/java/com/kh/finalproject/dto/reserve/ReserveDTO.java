package com.kh.finalproject.dto.reserve;

import com.kh.finalproject.entity.KakaoPay;
import com.kh.finalproject.entity.MemberReserve;
import com.kh.finalproject.entity.Reserve;
import com.kh.finalproject.entity.ReserveTime;
import com.kh.finalproject.entity.enumurate.ReserveStatus;
import jdk.jfr.Timestamp;
import lombok.Getter;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

/**
 * 예매 DTO
 */
@Getter
public class ReserveDTO {
    private String id;

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
        this.id = reserve.getId();
        this.reserveTimeSeatPriceIndex = reserve.getReserveTimeSeatPriceIndex();
        this.reserveSeat = reserve.getReserveSeat();
        this.method = reserve.getMethod();
        this.amount = reserve.getAmount();
        this.discount = reserve.getDiscount();
        this.finalAmount = reserve.getFinalAmount();
        this.status = reserve.getStatus();
        this.refund = reserve.getRefund().format(DateTimeFormatter.ofPattern("yyyy.MM.dd"));
        this.cancel = reserve.getCancel().format(DateTimeFormatter.ofPattern("yyyy.MM.dd"));

        return this;
    }
}
