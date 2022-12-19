package com.kh.finalproject.entity;

import com.kh.finalproject.common.BaseTimeEntity;
import com.kh.finalproject.entity.enumurate.ReserveStatus;
import jdk.jfr.Timestamp;
import lombok.Getter;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 예매 테이블과 연결된 엔티티
 * 생성/수정 시간 갱신 엔티티 클래스를 상속
 */
@Getter
@Entity
@Table(name = "reserve")
public class Reserve extends BaseTimeEntity {
    @Id
    @Column(name = "reserve_id")
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reserve_time_index", nullable = false)
    private ReserveTime reserveTime;

    @Column(name = "reserve_seat", nullable = false)
    private String seat;

    @Column(name = "reserve_payment_method", nullable = false)
    private String method;

    @Column(name = "reserve_payment_amount", nullable = false)
    private Integer amount;

    @Column(name = "reserve_payment_discount", nullable = false)
    private Integer discount;

    @Column(name = "reserve_payment_final_amount", nullable = false)
    private Integer finalAmount;

    @Column(name = "reserve_status", nullable = false)
    @Enumerated(EnumType.STRING)
    private ReserveStatus status;

    @Column(name = "refund_time")
    @Timestamp
    private LocalDateTime refund;

    @Column(name = "cancel_time")
    @Timestamp
    private LocalDateTime cancel;

    @OneToMany(mappedBy = "reserve")
    private List<MemberReserve> memberReserveList = new ArrayList<>();

    @OneToMany(mappedBy = "member")
    private List<KakaoPay> kakaoPayList = new ArrayList<>();
}
