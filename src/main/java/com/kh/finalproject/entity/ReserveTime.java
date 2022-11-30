package com.kh.finalproject.entity;

import lombok.Getter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Getter
@Entity
@Table(name = "reserve_time")
public class ReserveTime {
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

    @OneToMany(mappedBy = "reserveTime")
    private List<Reserve> reserveList = new ArrayList<>();

    @OneToMany(mappedBy = "reserveTime")
    private List<ReserveTimeCasting> reserveTimeCastingList = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_code", nullable = false)
    private Product product;
}
