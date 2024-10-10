package com.kh.finalproject.social.kakao.pay.cancel;

import lombok.Getter;

import javax.validation.constraints.NotNull;


/**
 * 카카오페이 Cancel DTO
 * 프론트에서 전달한 예매 정보
 */
@Getter
public class KakaoPayCancelRequestDTO {
    @NotNull(message = "tid는 필수 입력 값")
    private String tid;

    @NotNull(message = "cancel_amount는 필수 입력 값")
    private int cancelAmount;

    @NotNull(message = "cancel_tax_free_amount")
    private int cancelTaxFreeAmount;
}
