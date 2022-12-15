package com.kh.finalproject.dto.reviewComment;

import lombok.Getter;

/**
 * 후기/댓글 생성 DTO
 */
@Getter
public class CreateReviewCommentDTO {
    private Long index;
    private String memberId;
    private Integer like;
    private Integer rate;
    private String content;
    private Integer accuseCount;
    private String productName;

}
