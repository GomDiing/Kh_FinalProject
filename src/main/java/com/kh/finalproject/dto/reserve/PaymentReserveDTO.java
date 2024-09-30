package com.kh.finalproject.dto.reserve;

import lombok.Getter;

import javax.validation.constraints.NotNull;

/**
 * 예매 결제 DTO
 */
@Getter
public class PaymentReserveDTO {
    //회원 인덱스
    @NotNull(message = "예매 회원 인덱스는 필수 입력값 입니다")
    private Long memberIndex;

    //예매 인덱스
    @NotNull(message = "예매 상품 좌석 인덱스는 필수 입력값 입니다")
    private Long reserveTimeSeatPriceId;

    //예매 수량
    @NotNull(message = "예매 수량은 필수 입력값 입니다")
    private Integer quantity;

    //결제 금액(개당 결제금액)
    @NotNull(message = "예매 결제 금액은 필수 입력값 입니다")
    private Integer amount;

    //포인트 금액(할인 금액)
    @NotNull(message = "예매 포인트는 필수 입력값 입니다")
    private Integer point;

    //총 결제금액(개수 * 결제금액 - 총 할인금액)
    private Integer finalAmount;

    //결제 수단
    //카카오페이이면 KAKAOPAY
    @NotNull(message = "예매 방법은 필수 입력값 입니다")
    private String method;

    //카카오페이 TID
    private String kakaoTID;

    //카카오페이 taxFreeAmount
    private Integer kakaoTaxFreeAmount;

    @Override
    public String toString() {
        return "PaymentReserveDTO{" +
                "memberIndex=" + memberIndex +
                ", reserveTimeSeatPriceId=" + reserveTimeSeatPriceId +
                ", quantity=" + quantity +
                ", amount=" + amount +
                ", point=" + point +
                ", finalAmount=" + finalAmount +
                ", method='" + method + '\'' +
                ", kakaoTID='" + kakaoTID + '\'' +
                ", kakaoTaxFreeAmount=" + kakaoTaxFreeAmount +
                '}';
    }
}
