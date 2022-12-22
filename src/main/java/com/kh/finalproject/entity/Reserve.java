package com.kh.finalproject.entity;

import com.kh.finalproject.common.BaseTimeEntity;
import com.kh.finalproject.dto.reserve.PaymentReserveDTO;
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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reserve_index")
    private Long index;

    @Column(name = "reserve_ticket", nullable = false)
    private String ticket;

    @Column(name = "reserve_count", nullable = false)
    private Integer count;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reserve_time_index", nullable = false)
    private ReserveTime reserveTime;

    @Column(name = "reserve_time_seat_price_index", nullable = false)
    private Long reserveTimeSeatPriceIndex;

    @Column(name = "reserve_seat", nullable = false)
    private String reserveSeat;

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
    @JoinColumn(name = "member_index", nullable = false)
    private Member member;

    @OneToMany(mappedBy = "reserve")
    private List<KakaoPay> kakaoPayList = new ArrayList<>();

    public Reserve toEntity(String ticket, Integer count, ReserveTime reserveTime, String reserveSeat, Long reserveTimeSeatPriceIndex, PaymentReserveDTO paymentReserveDTO, Member member) {
        this.ticket = ticket;
        //예매 정보 연관관계
        this.reserveTime = reserveTime;
        reserveTime.getReserveList().add(this);
        this.member = member;
        member.getReserveList().add(this);
        this.reserveSeat = reserveSeat;
        this.count = count;
        this.reserveTimeSeatPriceIndex = reserveTimeSeatPriceIndex;
        this.method = paymentReserveDTO.getMethod();
        this.amount = paymentReserveDTO.getAmount();
        this.discount = paymentReserveDTO.getPoint();
        this.finalAmount = paymentReserveDTO.getAmount() - paymentReserveDTO.getPoint();
        this.status = ReserveStatus.PAYMENT;

        return this;
    }

    public void updateStatus(ReserveStatus status) {
        this.status = status;
    }

    public void updateRefundTime(ReserveStatus status, LocalDateTime now) {
        if (status == ReserveStatus.REFUND) this.refund = now;
        if (status == ReserveStatus.CANCEL) this.cancel = now;
    }
}
