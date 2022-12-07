package com.kh.finalproject.entity;

import jdk.jfr.Timestamp;
import lombok.Getter;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 예매시간 테이블과 연결된 엔티티
 */
@Getter
@Entity
@Table(name = "reserve_time")
public class ReserveTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reserve_time_index")
    private Long index;

    @Column(name = "reserve_time")
    @Timestamp
    private LocalDateTime time;

    @Column(name = "reserve_time_date")
    private String date;

    @Column(name = "reserve_time_turn")
    private Integer turn;

    @Column(name = "reserve_time_hour")
    private Integer hour;

    @Column(name = "reserve_time_min")
    private Integer minute;

    @OneToMany(mappedBy = "reserveTime")
    private List<Reserve> reserveList = new ArrayList<>();

    @OneToMany(mappedBy = "reserveTime")
    private List<ReserveTimeCasting> reserveTimeCastingList = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_code", nullable = false)
    private Product product;

    @OneToMany(mappedBy = "reserveTime")
    private List<ReserveTimeSeatPrice> reserveTimeList = new ArrayList<>();
}
