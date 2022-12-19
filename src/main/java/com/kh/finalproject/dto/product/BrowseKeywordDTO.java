package com.kh.finalproject.dto.product;

import com.kh.finalproject.entity.Product;
import com.kh.finalproject.entity.enumurate.ProductCategory;
import lombok.Getter;

/**
 * 상품 검색 DTO
 */
@Getter
public class BrowseKeywordDTO {
    private ProductCategory productCategory;
    private String title;
    private String thumbPosterUrl;
    private String location;
    private String periodStart;
    private String periodEnd;
    private Integer age;
    private Boolean ageIsKorean;
    private Integer timeMin;
    private Integer timeBreak;

    public BrowseKeywordDTO toDTO (Product product) {
        this.productCategory = product.getCategory();
        this.title = product.getTitle();
        this.thumbPosterUrl = product.getThumbPosterUrl();
        this.location = product.getLocation();
        this.periodStart = product.getPeriodStart();

        if(product.getPeriodEnd() == null) {
            this.periodEnd = "당일 공연";
        } else {
            this.periodEnd = product.getPeriodEnd();
        }

        this.age = product.getAge();
        this.ageIsKorean = product.getAgeIsKorean();
        this.timeMin = product.getTimeMin();
        this.timeBreak = product.getTimeBreak();

        return this;
    }
}
