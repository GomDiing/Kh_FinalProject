package com.kh.finalproject.dto.reviewComment;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;

/**
 * 후기/댓글 생성 DTO
 */
@Getter
@Setter
public class CreateReviewCommentDTO {
    @NotNull(message = "후기/댓글 작성자 인덱스는 필수 입력값 입니다")
    private Long memberIndex;

    private String title;

    private Float rate;

    @NotNull(message = "후기/댓글 내용은 필수 입력값 입니다")
    private String content;

    private Long group;

    private Integer layer;

    @NotNull(message = "후기 작성 상품 코드는 필수 입력값 입니다")
    @JsonProperty("code")
    private String productCode;
}
