package com.kh.finalproject.entity;

import com.kh.finalproject.entity.enumurate.ProductCategory;
import com.kh.finalproject.entity.enumurate.RankStatus;
import lombok.Getter;

import javax.persistence.*;

/**
 * 곧 종료 예정 순위 상품 테이블과 연결된 엔티티
 */
@Getter
@Entity
@Table(name = "ranking_close_soon")
public class RankingCloseSoon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ranking_index")
    private Long index;

//    @ManyToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "product_code", nullable = false)
//    private Product product;

    @Column(name = "product_code", nullable = false)
    private String code;

    @Column(name = "ranking_category", nullable = false)
    @Enumerated(EnumType.STRING)
    private ProductCategory productCategory;

    @Column(name = "ranking_order", nullable = false)
    private Integer order;

    @Column(name = "ranking_status", nullable = false)
    @Enumerated(EnumType.STRING)
    private RankStatus rankStatus;
}
