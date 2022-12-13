package com.kh.finalproject.entity;

import com.kh.finalproject.common.BaseTimeEntity;
import lombok.Getter;

import javax.persistence.*;

/**
 * 찜하기 테이블과 연결된 엔티티
 */
@Getter
@Entity
@Table(name = "wish_product")
public class WishProduct extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "wish_product_index")
    private Long index;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_index", nullable = false)
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_code", nullable = false)
    private Product product;
}
