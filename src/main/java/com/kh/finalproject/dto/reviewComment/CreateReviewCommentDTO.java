package com.kh.finalproject.dto.reviewComment;

import com.fasterxml.jackson.annotation.JsonProperty;
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
    @JsonProperty("code")
    private String productCode;
}
