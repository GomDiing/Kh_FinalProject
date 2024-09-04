package com.kh.finalproject.dto.wishProduct;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

import javax.validation.constraints.NotNull;

/**
 * 찜하기 제거 DTO
 */
@Getter
public class DeleteWishProductDTO {
    @NotNull(message = "찜하기 삭제한 회원 인덱스는 필수 입력값 입니다")
    @JsonProperty("member_index")
    private Long memberIndex;

    @NotNull(message = "찜 삭제된 상품 코드는 필수 입력값 입니다")
    @JsonProperty("product_code")
    private String productCode;
}
