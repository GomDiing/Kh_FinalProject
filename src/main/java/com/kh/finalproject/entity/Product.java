package com.kh.finalproject.entity;

import com.kh.finalproject.entity.enumurate.ProductCategory;
import lombok.Getter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * 상품 테이블과 연결된 엔티티
 */
@Getter
@Entity
@Table(name = "product")
public class Product {
    @Id
    @Column(name = "product_code")
    private Long code;

    @Enumerated(EnumType.STRING)
    @Column(name = "product_category", nullable = false)
    private ProductCategory category;

    @Column(name = "product_title", nullable = false)
    private String title;

    @Column(name = "product_thumb_poster_url", nullable = false)
    private String thumbPosterUrl;

    @Column(name = "product_detail_poster_url", nullable = false)
    private String detailPosterUrl;

    @Column(name = "product_casting_poster_url")
    private String castingPosterUrl;

    @Column(name = "product_location", nullable = false)
    private String location;

    @Column(name = "product_detail_location")
    private String detailLocation;

    @Column(name = "product_period_start", nullable = false)
    private String periodStart;

    @Column(name = "product_period_end")
    private String periodEnd;

    @Column(name = "product_age", nullable = false)
    private Integer age;

    @Column(name = "product_age_isKorean", nullable = false)
    private Boolean ageIsKorean;

    @Column(name = "product_time_min", nullable = false)
    private Integer timeMin;

    @Column(name = "product_time_break")
    private Integer timeBreak;

    @Column(name = "product_isInfoTimeCasting", nullable = false)
    private Boolean isInfoTimeCasting;

    @Column(name = "product_rate_average", nullable = false)
    private Float rateAverage;

    @OneToMany(mappedBy = "product")
    private List<Casting> castingList = new ArrayList<>();

    @OneToMany(mappedBy = "product")
    private List<SeatPrice> seatPrice;

    @OneToMany(mappedBy = "product")
    private List<ReserveTime> reserveTimeList = new ArrayList<>();

    @OneToOne(mappedBy = "product")
    private Statistics statistics;

    @OneToMany(mappedBy = "product")
    private List<RankingWeek> rankingWeekList = new ArrayList<>();

    @OneToMany(mappedBy = "product")
    private List<RankingMonth> rankingMonthList = new ArrayList<>();

    @OneToMany(mappedBy = "product")
    private List<RankingCloseSoon> rankingCloseSoonList = new ArrayList<>();

    @OneToMany(mappedBy = "product")
    private List<WishProduct> wishProductList = new ArrayList<>();

    @OneToMany(mappedBy = "product")
    private List<ReviewComment> reviewCommentList = new ArrayList<>();
}