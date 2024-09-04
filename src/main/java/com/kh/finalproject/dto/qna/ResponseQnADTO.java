package com.kh.finalproject.dto.qna;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;

/**
 * 문의 응답 DTO
 */
@Getter
@Setter
public class ResponseQnADTO {
    @NotNull(message = "문의 글 인덱스는 필수 입력값 입니다")
    private Long index;
    private String title;
    private String content;
    @NotNull(message = "문의 글 답장은 필수 입력값 입니다")
    private String reply; // (필수) 관리자가 답장을 보내는거니까!
    // index, title, content 필수는 아니지만 위에 값을 적어서 어떤 문의 사항에 답장해야 하는지 찾아야 하기 때문에 필요함
}
