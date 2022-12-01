package com.kh.finalproject.entity;

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
    @Column(name = "ranking_order")
    private Long order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_code", nullable = false)
    private Product product;
}
