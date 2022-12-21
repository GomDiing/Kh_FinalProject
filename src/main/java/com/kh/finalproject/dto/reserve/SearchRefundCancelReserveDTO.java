package com.kh.finalproject.dto.reserve;

import com.kh.finalproject.entity.Reserve;
import lombok.Getter;

import java.time.format.DateTimeFormatter;

@Getter
public class SearchRefundCancelReserveDTO {
    //예매일 (연/월/일 단위)
    private String reserveTime;
    //예매번호
    private String reserveTicket;
    //공연명
    private String productTitle;
    //관람일
    private String viewTime;
    //매수
    private Integer count;
    //상품 총 가격(할인 포함)
//    private Integer finalAmount;
    //결제 수단
//    private String method;
    //예매 상태
//    private String reserveStatus;
    //결제 완료 시간 (시/분/초 단위)
    private String reserveStatus;

    public SearchRefundCancelReserveDTO toDTO(Reserve reserve, Integer count) {
        this.reserveTime = reserve.getCreateTime().format(DateTimeFormatter.ofPattern("yyyy.MM.dd"));
        this.reserveTicket = reserve.getTicket();
        this.productTitle = reserve.getReserveTime().getProduct().getTitle();
        this.viewTime = reserve.getReserveTime().getTime().format(DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm"));
        this.count = count;
        this.reserveStatus = reserve.getStatus().name();

        return this;
    }
}
