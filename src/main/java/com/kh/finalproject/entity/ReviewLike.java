package com.kh.finalproject.entity;

import com.kh.finalproject.common.BaseTimeEntity;
import lombok.Getter;

import javax.persistence.*;

/**
 * 좋아요 후기 테이블과 연결된 엔티티
 * 생성/수정 시간 갱신 엔티티 클래스를 상속
 */
@Getter
@Entity
@Table(name = "review_like")
public class ReviewLike extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_like_index")
    private Long index;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_comment_index", nullable = false)
    private ReviewComment reviewComment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_index", nullable = false)
    private Member member;
}
