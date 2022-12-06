package com.kh.finalproject.entity;

import com.kh.finalproject.common.BaseTimeEntity;
import com.kh.finalproject.entity.enumurate.AccuseStatus;
import lombok.Getter;
import javax.persistence.*;

/**
 * 신고 테이블과 연결된 엔티티
 * 생성/수정 시간 갱신 엔티티 클래스를 상속
 */
@Getter
@Entity
@Table(name = "accuse")
public class Accuse extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "accuse_index")
    private Long index;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_index_suspect", nullable = false)
    private Member memberSuspect;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_index_victim", nullable = false)
    private Member memberVictim;

    @Column(name = "accuse_reason", nullable = false)
    private String reason;

    @Column(name = "accuse_process", nullable = false)
    private String process;

    @Column(name = "accuse_status", nullable = false)
    @Enumerated(EnumType.STRING)
    private AccuseStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_component_index")
    private ReviewComment reviewComment;
}
