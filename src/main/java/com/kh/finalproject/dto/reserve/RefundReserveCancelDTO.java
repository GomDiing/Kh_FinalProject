package com.kh.finalproject.dto.reserve;

import lombok.Getter;

/**
 * 예매 환불 DTO
 */
@Getter
public class RefundReserveCancelDTO {
    //환불 금액(총 환불 금액)
    private Integer amount;
    //환불 포인트 금액(할인 금액)
    private Integer discount;
    //총 환불 금액
    private Integer finalAmount;
    //결제 수단
    //카카오페이이면 KAKAOPAY
    private String method;
    //카카오페이 TID
    private String kakaoTID;
    //카카오페이 면세 금액
    private Integer kakaoTaxFreeAmount;

    public RefundReserveCancelDTO toDTO(Integer amount, Integer discount, Integer finalAmount, String method, String kakaoTID, Integer kakaoTaxFreeAmount) {
        this.amount = amount;
        this.discount = discount;
        this.finalAmount = finalAmount;
        this.method = method;
        this.kakaoTID = kakaoTID;
        this.kakaoTaxFreeAmount = kakaoTaxFreeAmount;

        return this;
    }

    public RefundReserveCancelDTO toDTO(Integer amount, Integer discount, Integer finalAmount, String method) {
        this.amount = amount;
        this.discount = discount;
        this.finalAmount = finalAmount;
        this.method = method;

        return this;
    }
}
