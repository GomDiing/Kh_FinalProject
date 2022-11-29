package com.kh.finalproject.entity;

import lombok.Getter;

import javax.persistence.*;

@Getter
@Entity
@Table(name = "reserve_time_casting")
public class ReserveTimeCasting {
    @Id
    @Column(name = "reserve_time_casting_index")
    private Long index;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "casting_id")
    private Casting casting;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reserve_time_index", nullable = false)
    private ReserveTime reserveTime;
}
