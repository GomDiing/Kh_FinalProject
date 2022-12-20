package com.kh.finalproject.dto.reviewComment;

import lombok.Getter;

/**
 * 후기/댓글 삭제 DTO
 */
@Getter
public class RemoveReviewCommentDTO {
    private Long index;
    private Long memberIndex;
    private String content;
    private Integer like;
    private Integer rate;
    private String reviewCommentStatus;
    private Integer layer;
    private Long group;
    private Integer order;
}
