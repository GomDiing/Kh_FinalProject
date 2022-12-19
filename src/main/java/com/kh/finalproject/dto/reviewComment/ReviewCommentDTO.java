package com.kh.finalproject.dto.reviewComment;

import com.kh.finalproject.entity.ReviewComment;
import lombok.Getter;

/**
 * 후기/댓글 DTO
 */
@Getter
public class ReviewCommentDTO {
    private Long index;
    private String memberId;
    private String title;
    private Integer like;
    private Integer rate;
    private String content;
    private Long group;
    private Integer layer;
    private Integer order;
    private String reviewCommentStatus;
    private Integer accuseCount;
    private String productTitle;

    /*관리자페이지 Dashboard에서 리뷰 조회용*/
    public ReviewCommentDTO toDTO(ReviewComment reviewComment){
        this.index = reviewComment.getIndex();
        this.memberId = reviewComment.getMember().getId();
        this.title = reviewComment.getTitle();
        this.like = reviewComment.getLike();
        this.rate = reviewComment.getRate();
        this.content = reviewComment.getContent();
        this.group = reviewComment.getGroup();
        this.layer = reviewComment.getLayer();
        this.order = reviewComment.getOrder();
        this.reviewCommentStatus = reviewComment.getStatus().getStatus();
        this.accuseCount = reviewComment.getAccuseCount();
        this.productTitle = reviewComment.getProduct().getTitle();

        return  this;
    }
}
