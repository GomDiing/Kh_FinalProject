package com.kh.finalproject.dto.reviewComment;

import lombok.Getter;
import lombok.Setter;

/**
 * 후기/댓글 생성 DTO
 */
@Getter
@Setter
public class CreateReviewCommentDTO {
    private Long index;
    private Long memberIndex;
    private String memberId;
    private String title;
    private Integer rate;
    private String content;
    private Long group;
    private Integer layer;
    private Integer order;
    private String reviewCommentStatus;
    private Integer accuseCount;
    private String code;
    private String createTime;
}
