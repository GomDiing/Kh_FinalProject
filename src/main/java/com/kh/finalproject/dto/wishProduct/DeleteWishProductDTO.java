package com.kh.finalproject.dto.wishProduct;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

/**
 * 찜하기 제거 DTO
 */
@Getter
public class DeleteWishProductDTO {
    @JsonProperty("member_index")
    private Long memberIndex;
    @JsonProperty("product_code")
    private String productCode;
}
