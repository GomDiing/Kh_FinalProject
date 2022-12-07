package com.kh.finalproject.entity;

import lombok.Getter;

import javax.persistence.*;

/**
 * 예매시간 좌석/가격 테이블과 연결된 엔티티
 */
@Getter
@Entity
@Table(name = "reserve_time_seat_price")
public class ReserveTimeSeatPrice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reserve_time_seat_index")
    private Long index;

    @Column(name = "remain_quantity", nullable = false)
    private Integer remainQuantity;

    @Column(name = "total_quantity", nullable = false)
    private Integer totalQuantity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reserve_time_index", nullable = false)
    private ReserveTime reserveTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seat_price_index", nullable = false)
    private SeatPrice seatPrice;
}
