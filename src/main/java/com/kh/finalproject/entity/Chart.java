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
    @Column(name = "chart_id")
    private String id;

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

    /**
     * 관리자 차트 생성
     */
    public Chart toEntity(String charId, Long cumuAmount, Long cumuDiscount, Long finalAmount, Long totalMember ,Long totalReserve) {
        this.id = charId;
        this.cumuAmount = cumuAmount;
        this.cumuDiscount = cumuDiscount;
        this.finalAmount = finalAmount;
        this.totalMember = totalMember;
        this.totalReserve = totalReserve;

        return this;
    }

    /**
     * 관리자 차트 갱신
     * 거래할때마다 갱신되도록
     */
    public void updateChart(Long cumuAmount, Long cumuDiscount, Long totalReserve) {
        this.cumuAmount += cumuAmount;
        this.cumuDiscount += cumuDiscount;
        this.finalAmount += (cumuAmount - cumuDiscount);
        this.totalReserve += totalReserve;
    }

    public void updateMember(Long totalMember) {
        this.totalMember += totalMember;
    }
}
