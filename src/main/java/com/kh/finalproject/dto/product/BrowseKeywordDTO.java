package com.kh.finalproject.dto.product;

import com.kh.finalproject.entity.Product;
import com.kh.finalproject.entity.enumurate.ProductCategory;
import lombok.Getter;

/**
 * 상품 검색 DTO
 */
@Getter
public class BrowseKeywordDTO {

    private String code;
    private ProductCategory category;
    private String title;
    private String poster_url;
    private String location;
    private String period_start;
    private String period_end;
    private Integer age;
    private Boolean age_is_korean;
    private Integer time_min;
    private Integer time_break;

    public BrowseKeywordDTO toDTO (Product product) {
        this.code = product.getCode();
        this.category = product.getCategory();
        this.title = product.getTitle();
        this.poster_url = product.getThumbPosterUrl();
        this.location = product.getLocation();
        this.period_start = product.getPeriodStart();

        if(product.getPeriodEnd() == null) {
            this.period_end = "당일 공연";
        } else {
            this.period_end = product.getPeriodEnd();
        }

        this.age = product.getAge();
        this.age_is_korean = product.getAgeIsKorean();
        this.time_min = product.getTimeMin();
        this.time_break = product.getTimeBreak();

        return this;
    }
}
