package com.kh.finalproject.dto.qna;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;

/**
 * 문의 생성 DTO
 */
@Getter
@Setter
public class CreateQnADTO {
    @NotNull(message = "문의 작성 회원 인덱스는 필수 입력값 입니다")
    private Long index;
    private String memberId;
    @NotNull(message = "문의 제목은 필수 입력값 입니다")
    private String title;
    @NotNull(message = "문의 카테고리는 필수 입력값 입니다")
    private String category;
    @NotNull(message = "문의 내용은 필수 입력값 입니다")
    private String content;

}
