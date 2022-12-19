package com.kh.finalproject.dto.reviewComment;

import lombok.Getter;

/**
 * 후기/댓글 수정 메서드
 */
@Getter
public class UpdateReviewCommentDTO {
    private Long index;
    private Long memberIndex;
    private String memberId;
    private String content;
    private Integer rate;
}
