package com.kh.finalproject.dto.reserve;

import lombok.Getter;

/**
 * 예매 결제 DTO
 */
@Getter
public class PaymentReserveDTO {
    //회원 인덱스
    private String memberId;
    //예매 인덱스
    private String reserveTimeSeatPriceId;
    //예매 수량
    private Integer quantity;
}
