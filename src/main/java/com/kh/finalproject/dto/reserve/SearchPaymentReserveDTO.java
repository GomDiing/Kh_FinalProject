package com.kh.finalproject.dto.reserve;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.kh.finalproject.entity.Reserve;
import lombok.Getter;

import java.time.format.DateTimeFormatter;

@Getter
public class SearchPaymentReserveDTO {
    //예매일 (연/월/일 단위)
    @JsonProperty("reserve_time")
    private String reserveTime;

    //예매번호
    @JsonProperty("reserve_ticket")
    private String reserveTicket;

    //공연명
    @JsonProperty("product_title")
    private String productTitle;

    //관람일
    @JsonProperty("view_time")
    private String viewTime;

    //매수
    private Integer count;

    //상품 총 가격(할인 포함)
    @JsonProperty("final_amount")
    private Integer finalAmount;
    //결제 수단
    private String method;
    //예매 상태
    @JsonProperty("reserve_status")
    private String reserveStatus;

    //결제 완료 시간 (시/분/초 단위)
    @JsonProperty("payment_complete_time")
    private String paymentCompleteTime;

    private String kakaoTID;

    public SearchPaymentReserveDTO toDTO(Reserve reserve, Integer count, Integer finalAmount) {
        this.reserveTime = reserve.getCreateTime().format(DateTimeFormatter.ofPattern("yyyy.MM.dd"));
        this.reserveTicket = reserve.getTicket();
        this.productTitle = reserve.getReserveTime().getProduct().getTitle();
        this.viewTime = reserve.getReserveTime().getTime().format(DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm"));
        this.count = count;
        this.finalAmount = finalAmount;
        this.method = reserve.getMethod();
        this.reserveStatus = reserve.getStatus().name();
        this.paymentCompleteTime = reserve.getCreateTime().format(DateTimeFormatter.ofPattern("HH:mm:ss"));
        this.kakaoTID = "null";

        return this;
    }

    public void updateTID(String kakaoTID) {
        this.kakaoTID = kakaoTID;
    }
}
