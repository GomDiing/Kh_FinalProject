package com.kh.finalproject.entity;

import com.kh.finalproject.common.BaseTimeEntity;
import com.kh.finalproject.dto.member.UnregisterDTO;
import com.kh.finalproject.dto.qna.ResponseQnADTO;
import com.kh.finalproject.entity.enumurate.QnAStatus;
import lombok.Getter;

import javax.persistence.*;
import java.time.LocalDateTime;

/**
 * 1대1 문의 테이블과 연결된 엔티티
 * 생성/수정 시간 갱신 엔티티 클래스를 상속
 */
@Getter
@Entity
@Table(name = "qna")
public class QnA extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "qna_index")
    private Long index;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_index", nullable = false)
    private Member member;

    @Column(name = "qna_title", nullable = false)
    private String title;

    @Column(name = "qna_category", nullable = false)
    private String category;

    @Column(name = "qna_content", nullable = false)
    private String content;

    @Column(name = "qna_status", nullable = false)
    @Enumerated(EnumType.STRING)
    private QnAStatus status;

    @Column(name = "qna_group", nullable = false)
    private Long group;

    @Column(name = "qna_layer", nullable = false)
    private Integer layer;

    @Column(name = "qna_order", nullable = false)
    private Integer order;

    @Column(name = "qna_reply")
    private String reply;

    @Column(name = "qna_reply_time")
    private LocalDateTime replyTime;

    public QnA toEntity(ResponseQnADTO responseQnADTO){
        this.reply =responseQnADTO.getReply();
        this.replyTime = LocalDateTime.now();

        return this;
    }
}
