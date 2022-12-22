package com.kh.finalproject.dto.reviewComment;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.kh.finalproject.entity.Member;
import com.kh.finalproject.entity.ReviewComment;
import lombok.Getter;

import java.time.format.DateTimeFormatter;

/**
 * 후기/댓글 DTO
 */
@Getter
public class ReviewCommentDTO {
    private Long index;
    private Long memberIndex;
    private String memberId;
    private String title;
    private Integer like;
    private Float rate;
    private String content;
    private Long group;
    private Integer layer;
    private Integer order;
    private String reviewCommentStatus;
    private Integer accuseCount;
    private String productCode;
    private String createTime;
    @JsonProperty("thumb_poster_url")
    private String thumbPosterUrl;

    /*관리자페이지 Dashboard에서 리뷰 조회용*/
    public ReviewCommentDTO toDTO(ReviewComment reviewComment, Member member){
        this.index = reviewComment.getIndex();
        this.memberIndex = reviewComment.getMember().getIndex();
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
        this.productCode = reviewComment.getProduct().getCode();
        this.createTime = reviewComment.getCreateTime().format(DateTimeFormatter.ofPattern("yyyy.MM.dd"));
        this.thumbPosterUrl = reviewComment.getProduct().getThumbPosterUrl();

        return  this;
    }
}
