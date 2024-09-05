package com.kh.finalproject.dto.wishProduct;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.kh.finalproject.entity.Product;
import lombok.Getter;

/**
 * 찜하기 DTO
 */
@Getter
public class WishProductDTO {
    @JsonProperty("product_title")
    private String productTitle;
    @JsonProperty("thumb_poster_url")
    private String thumbPosterUrl;

    @JsonProperty("product_code")
    private String productCode;

    public WishProductDTO toDTO(Product product) {
        this.productTitle = product.getTitle();
        this.thumbPosterUrl = product.getThumbPosterUrl();
        this.productCode = product.getCode();

        return this;
    }
}
