package com.kh.finalproject.dto.reviewLike;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

import javax.validation.constraints.NotNull;

/**
 * 좋아요 추가 DTO
 */
@Getter
public class AddReviewLikeDTO {
    @NotNull(message = "좋아요 누른 회원 인덱스는 필수값 입니다")
    @JsonProperty("member_index")
    private Long memberIndex;

    @NotNull(message = "좋아요 받은 후기 인덱스는 필수값 입니다")
    @JsonProperty("review_comment_index")
    private Long reviewCommentIndex;
}
