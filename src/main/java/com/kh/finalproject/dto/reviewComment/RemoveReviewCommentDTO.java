package com.kh.finalproject.dto.reviewComment;

import lombok.Getter;

import javax.validation.constraints.NotNull;

/**
 * 후기/댓글 삭제 DTO
 */
@Getter
public class RemoveReviewCommentDTO {
    @NotNull(message = "후기/댓글 글 인덱스는 필수값 입니다")
    private Long index;

    @NotNull(message = "후기/댓글 작성 회원 인덱스는 필수값 입니다")
    private Long memberIndex;
}
