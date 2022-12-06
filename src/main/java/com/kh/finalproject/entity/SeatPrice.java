package com.kh.finalproject.entity;

import lombok.Getter;

import javax.persistence.*;

/**
 * 좌석/가격 테이블과 연결된 엔티티
 */
@Getter
@Entity
@Table(name = "seat_price")
public class SeatPrice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "seat_price_index")
    private Long index;

    @Column(name = "seat", nullable = false)
    private String seat;

    @Column(name = "price", nullable = false)
    private Integer price;

    @Column(name = "remain_quantity", nullable = false)
    private Integer remainQuantity;

    @Column(name = "total_quantity", nullable = false)
    private Integer totalQuantity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_code", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reserve_time_index", nullable = false)
    private ReserveTime reserveTime;
}
