package com.kh.finalproject.entity;

import lombok.Getter;

import javax.persistence.*;

/**
 * 예매시간 캐스팅 테이블과 연결된 엔티티
 */
@Getter
@Entity
@Table(name = "reserve_time_casting")
public class ReserveTimeCasting {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reserve_time_casting_index")
    private Long index;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "casting_id")
    private Casting casting;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reserve_time_index", nullable = false)
    private ReserveTime reserveTime;
}
