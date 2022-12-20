package com.kh.finalproject.entity;

import com.kh.finalproject.common.BaseTimeEntity;
import lombok.Getter;

import javax.persistence.*;

/**
 * 회원 예매 테이블과 연결된 엔티티
 * 생성/수정 시간 갱신 엔티티 클래스를 상속
 */
@Getter
@Entity
@Table(name = "member_reserve")
public class MemberReserve extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_reserve_index")
    private Long index;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_index", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reserve_id", nullable = false)
    private Reserve reserve;

    public MemberReserve toEntity(Member member, Reserve reserve) {
        this.member = member;
        member.getMemberReserveList().add(this);
        this.reserve = reserve;
        reserve.getMemberReserveList().add(this);

        return this;
    }
}
