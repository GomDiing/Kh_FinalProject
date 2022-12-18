package com.kh.finalproject.entity;

import com.kh.finalproject.common.BaseTimeEntity;
import com.kh.finalproject.dto.reviewComment.CreateReviewCommentDTO;
import com.kh.finalproject.dto.reviewComment.RemoveReviewCommentDTO;
import com.kh.finalproject.dto.reviewComment.UpdateReviewCommentDTO;
import com.kh.finalproject.entity.enumurate.ReviewCommentStatus;
import lombok.Getter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * 후기/댓글 테이블과 연결된 엔티티
 * 생성/수정 시간 갱신 엔티티 클래스를 상속
 */
@Getter
@Entity
@Table(name = "review_comment")
public class ReviewComment extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_comment_index")
    private Long index;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id")
    private Member member;

    @Column(name = "review_title")
    private String title;

    @Column(name = "review_like")
    private Integer like;

    @Column(name = "review_rate")
    private Integer rate;

    @Column(name = "review_comment_content", nullable = false)
    private String content;

    @Column(name = "review_comment_group", nullable = false)
    private Long group;

    @Column(name = "review_comment_layer", nullable = false)
    private Integer layer;

    @Column(name = "review_comment_order", nullable = false)
    private Integer order;

    @Column(name = "review_comment_status", nullable = false)
    @Enumerated(EnumType.STRING)
    private ReviewCommentStatus status;

    @Column(name = "review_comment_accuse_count")
    private Integer accuseCount;

    @OneToMany(mappedBy = "reviewComment")
    private List<ReviewLike> reviewLikeList = new ArrayList<>();

    @OneToMany(mappedBy = "reviewComment")
    private List<Accuse> accuseList = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_code", nullable = false)
    private Product product;

    /*연관 메서드*/
    public void createAccuse(Accuse accuse){
        accuseList.add(accuse);
    }

    public void addAccuseCount() {
        this.accuseCount++;
    }

    /*공연 후기 작성(댓글 형식)*/
    public ReviewComment createReviewComment(Member member,Product product, String content, Integer rate){
        this.content = content;
        this.rate = rate;
        this.status = ReviewCommentStatus.ACTIVE;
        this.group = 0L;
        this.layer = 0;
        this.order = 0;

        this.product = product;
        product.getCode();

        this.member = member;
        member.getReviewCommentList().add(this);
        return this;
    }
    public ReviewComment changeLayer(Integer layer, Integer order){
        this.layer =layer +1;
        this.order = order +1;
    }

    /*대댓글 작성(진행중)*/
    public ReviewComment createAddReviewComment(Member member, Product product, String content, Integer rate){
        this.content = content;
        this.rate = rate;
        this.group = 0L;
        this.layer = layer++;

        this.member = member;
        member.getReviewCommentList().add(this);
        return this;

    }

    /*공연 후기 수정(진행중)*/
    public ReviewComment UpdateReviewComment(UpdateReviewCommentDTO updateReviewCommentDTO){
        this.index = updateReviewCommentDTO.getIndex();
        this.rate = updateReviewCommentDTO.getRate();
        this.content = updateReviewCommentDTO.getContent();
        return this;
    }

    /*공연 후기 삭제 => 상태값 변경*/
    public ReviewComment changeReviewCommentStatus(RemoveReviewCommentDTO removeReviewCommentDTO){
        this.status = ReviewCommentStatus.DELETE;
        return this;
    }

}
