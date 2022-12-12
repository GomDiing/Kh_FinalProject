package com.kh.finalproject.dto.product;

import com.kh.finalproject.entity.*;
import com.kh.finalproject.entity.enumurate.ProductCategory;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

/**
 * 상품 DTO
 */
@Getter
@Setter
public class ProductDTO {
    private Long code;
    private ProductCategory productCategory;
    private String title;
    private String thumbPosterUrl;
    private String detailPosterUrl;
    private String castingPosterUrl;
    private String location;
    private String detailLocation;
    private String periodStart;
    private String periodEnd;
    private Integer age;
    private Boolean ageIsKorean;
    private Integer timeMin;
    private Integer timeBreak;
    private Boolean isInfoTimeCasting;
    private Float rateAverage;

    /*
    * entity=>toDTO 공지사항 조회용*/
    public ProductDTO toDTO (Product product) {
        this.code = product.getCode();
        this.productCategory = product.getCategory();
        this.title = product.getTitle();
        this.thumbPosterUrl = product.getThumbPosterUrl();
        this.detailPosterUrl = product.getDetailPosterUrl();
        this.castingPosterUrl = product.getCastingPosterUrl();
        this.location = product.getLocation();
        this.detailLocation = product.getDetailLocation();
        this.periodStart = product.getPeriodStart();
        this.periodEnd = product.getPeriodEnd();
        this.age = product.getAge();
        this.ageIsKorean = product.getAgeIsKorean();
        this.timeMin = product.getTimeMin();
        this.timeBreak = product.getTimeBreak();
        this.isInfoTimeCasting = product.getIsInfoTimeCasting();
        this.rateAverage = product.getRateAverage();
        return this;
    }
}
