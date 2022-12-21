package com.kh.finalproject.dto.reviewLike;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

/**
 * 좋아요 추가 DTO
 */
@Getter
public class AddReviewLikeDTO {
    @JsonProperty("member_index")
    private Long memberIndex;
    @JsonProperty("review_comment_index")
    private Long reviewCommentIndex;
}
