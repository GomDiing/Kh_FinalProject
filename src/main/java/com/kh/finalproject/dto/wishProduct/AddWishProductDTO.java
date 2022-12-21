package com.kh.finalproject.dto.wishProduct;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

/**
 * 찜하기 추가 DTO
 */
@Getter
public class AddWishProductDTO {
    @JsonProperty("member_index")
    private Long memberIndex;
    @JsonProperty("product_code")
    private String productCode;
}
