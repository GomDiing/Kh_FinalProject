package com.kh.finalproject.entity;

import lombok.Getter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * 예매시간 테이블과 연결된 엔티티
 */
@Getter
@Entity
@Table(name = "reserve_time")
public class ReserveTimeSeatPrice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reserve_time_index")
    private Long index;

    @Column(name = "reserve_time_date")
    private String date;

    @Column(name = "reserve_time_turn")
    private Integer turn;

    @Column(name = "reserve_time_hour")
    private Integer hour;

    @Column(name = "reserve_time_min")
    private Integer minute;

    @Column(name = "remain_quantity", nullable = false)
    private Integer remainQuantity;

    @Column(name = "total_quantity", nullable = false)
    private Integer totalQuantity;

    @OneToMany(mappedBy = "reserveTimeSeatPrice")
    private List<Reserve> reserveList = new ArrayList<>();

    @OneToMany(mappedBy = "reserveTimeSeatPrice")
    private List<ReserveTimeCasting> reserveTimeCastingList = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_code", nullable = false)
    private Product product;

    @OneToMany(mappedBy = "reserveTimeSeatPrice")
    private List<SeatPrice> seatPriceList = new ArrayList<>();
}
