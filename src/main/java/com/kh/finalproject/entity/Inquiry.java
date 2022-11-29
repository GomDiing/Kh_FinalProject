package com.kh.finalproject.entity;

import com.kh.finalproject.common.BaseTimeEntity;
import lombok.Getter;

import javax.persistence.*;

@Getter
@Entity
@Table(name = "inquiry")
public class Inquiry extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "inquiry_index")
    private Long index;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_index", nullable = false)
    private Member member;

    @Column(name = "inquiry_title", nullable = false)
    private String title;

    @Column(name = "inquiry_category", nullable = false)
    private String category;

    @Column(name = "inquiry_content", nullable = false)
    private String content;

    @Column(name = "inquiry_status", nullable = false)
    @Enumerated(EnumType.STRING)
    private InquiryStatus status;

    @Column(name = "inquiry_group", nullable = false)
    private Long group;

    @Column(name = "inquiry_layer", nullable = false)
    private Integer layer;

    @Column(name = "inquiry_order", nullable = false)
    private Integer order;
}
