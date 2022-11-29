package com.kh.finalproject.entity;

import com.kh.finalproject.common.BaseTimeEntity;
import jdk.jfr.Timestamp;
import lombok.Getter;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Entity
@Table(name = "reserve")
public class Reserve extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reserve_id")
    private String id;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reserve_time_index")
    private ReserveTime reserveTime;

    @OneToMany(mappedBy = "reserve")
    private List<MemberReserve> memberReserveList = new ArrayList<>();
}
