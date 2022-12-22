package com.kh.finalproject.entity;

import com.kh.finalproject.common.BaseTimeEntity;
import lombok.Getter;

import javax.persistence.*;

/**
 * 카카오페이 테이블과 연결된 엔티티
 */
@Getter
@Entity
@Table(name = "kakao_pay")
public class KakaoPay extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "kakao_pay_index")
    private Long index;

    @Column(name = "kakao_tid", nullable = false)
    private String kakaoTID;

    @Column(name = "kakao_tax_free", nullable = false)
    private Integer kakaoTaxFreeAmount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_index", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reserve_id", nullable = false)
    private Reserve reserve;

    public KakaoPay toEntity(String kakaoTID, Member member, Reserve reserve, Integer kakaoTaxFreeAmount) {
        this.kakaoTID = kakaoTID;
        this.member = member;
        member.getKakaoPayList().add(this);
        this.reserve = reserve;
        reserve.getKakaoPayList().add(this);
        this.kakaoTaxFreeAmount = kakaoTaxFreeAmount;

        return this;
    }
}
