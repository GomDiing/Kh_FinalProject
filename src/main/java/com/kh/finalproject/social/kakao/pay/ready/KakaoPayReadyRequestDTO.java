package com.kh.finalproject.social.kakao.pay.ready;

import lombok.Getter;

import javax.validation.constraints.NotNull;

/**
 * 카카오Pay Ready DTO
 * 프론트에서 전달한 예매 정보
 */
@Getter
public class KakaoPayReadyRequestDTO {
    @NotNull(message = "상품 이름은 필수 입력 값")
    private String itemName;

    @NotNull(message = "상품 수량은 필수 입력 값")
    private Integer quantity;

    @NotNull(message = "총 가격은 필수 입력 값")
    private Integer totalAmount;

    @NotNull(message = "상품 비과세는 필수 입력 값")
    private Integer taxFreeAmount;

    public KakaoPayReadyRequestDTO toDto(String itemName, Integer quantity, Integer totalAmount, Integer taxFreeAmount) {
        this.itemName = itemName;
        this.quantity = quantity;
        this.totalAmount = totalAmount;
        this.taxFreeAmount = taxFreeAmount;

        return this;
    }
}
