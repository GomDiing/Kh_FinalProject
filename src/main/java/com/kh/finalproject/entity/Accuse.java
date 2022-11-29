package com.kh.finalproject.entity;

import com.kh.finalproject.common.BaseTimeEntity;
import lombok.Getter;

import javax.persistence.*;

@Getter
@Entity
@Table(name = "accuse")
public class Accuse extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "accuse_index")
    private Long index;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_index_suspect")
    private Member memberSuspect;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_index_victim")
    private Member memberVictim;
}
