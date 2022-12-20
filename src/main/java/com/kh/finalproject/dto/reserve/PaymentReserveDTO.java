package com.kh.finalproject.dto.reserve;

import lombok.Getter;

/**
 * 예매 결제 DTO
 */
@Getter
public class PaymentReserveDTO {
    //회원 인덱스
    private Long memberIndex;
    //예매 인덱스
    private Long reserveTimeSeatPriceId;
    //예매 수량
    private Integer quantity;
    //결제 금액(총 결제 금액)
    private Integer amount;
    //포인트 금액(할인 금액)
    private Integer point;
    //결제 수단
    //카카오페이이면 KAKAOPAY
    private String method;
    //카카오페이 TID
    private String kakaoTID;
}
