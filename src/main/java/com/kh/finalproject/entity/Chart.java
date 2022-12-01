package com.kh.finalproject.entity;

import com.kh.finalproject.common.BaseTimeEntity;
import lombok.Getter;

import javax.persistence.*;

/**
 * 관리자 차트 테이블과 연결된 엔티티
 * 생성/수정 시간 갱신 엔티티 클래스를 상속
 */
@Getter
@Entity
@Table(name = "chart")
public class Chart extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chart_index")
    private Long index;

    @Column(name = "cumu_amount", nullable = false)
    private Long cumuAmount;

    @Column(name = "cumu_discount", nullable = false)
    private Long cumuDiscount;

    @Column(name = "cumu_final_amount", nullable = false)
    private Long finalAmount;

    @Column(name = "total_member", nullable = false)
    private Long totalMember;

    @Column(name = "total_reserve", nullable = false)
    private Long totalReserve;
}
