package com.kh.finalproject.dto.product;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.kh.finalproject.entity.Product;
import com.kh.finalproject.entity.enumurate.ProductCategory;
import com.kh.finalproject.vo.CalendarReserveInfoVO;
import lombok.Getter;

import java.util.Objects;

@Getter
public class DetailProductCompactDTO {
    private String code;
    private String url;
    private ProductCategory category;
    private String title;

    @JsonProperty("thumb_poster_url")
    private String thumbPosterUrl;

    @JsonProperty("detail_poster_url")
    private String detailPosterUrl;

    @JsonProperty("casting_poster_url")
    private String castingPosterUrl;
    private String location;

    @JsonProperty("detail_location")
    private String detailLocation;

    @JsonProperty("period_start")
    private String periodStart;
    @JsonProperty("period_end")
    private String periodEnd;
    private Integer age;
    @JsonProperty("perf_time_break")
    private Integer timeBreak;
    @JsonProperty("perf_time_minutes")
    private Integer timeMin;
    @JsonProperty("rate_average")
    private Float rateAverage;

    public DetailProductCompactDTO toDTO(Product product) {
        this.code = product.getCode();
        this.url = product.getUrl();
        this.category = product.getCategory();
        this.title = product.getTitle();
        this.thumbPosterUrl = product.getThumbPosterUrl();
        this.detailPosterUrl = product.getDetailPosterUrl();
        if (Objects.isNull(product.getCastingPosterUrl())) this.castingPosterUrl = "null";
        else this.castingPosterUrl = product.getCastingPosterUrl();
        this.location = product.getLocation();
        this.detailLocation = product.getDetailLocation();
        this.periodStart = product.getPeriodStart();
        this.periodEnd = product.getPeriodEnd();
        this.age = product.getAge();
        this.timeBreak = product.getTimeBreak();
        if (product.getTimeMin() == -1) this.timeMin = 0;
        else this.timeMin = product.getTimeMin();
        this.rateAverage = product.getRateAverage();

        return this;
    }
}
