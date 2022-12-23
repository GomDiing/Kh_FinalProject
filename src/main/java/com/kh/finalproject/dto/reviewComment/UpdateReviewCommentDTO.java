package com.kh.finalproject.dto.reviewComment;

import lombok.Getter;

import javax.validation.constraints.NotNull;

/**
 * 후기/댓글 수정 메서드
 */
@Getter
public class UpdateReviewCommentDTO {
    @NotNull(message = "후기/댓글 글 인덱스는 필수 입력값 입니다")
    private Long index;
    @NotNull(message = "후기/댓글 작성 회원 인덱스는 필수 입력값 입니다")
    private Long memberIndex;
    @NotNull(message = "후기/댓글 글 내용은 필수 입력값 입니다")
    private String content;
    private Float rate;
}
