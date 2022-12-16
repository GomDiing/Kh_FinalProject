package com.kh.finalproject.dto.qna;

import lombok.Getter;
import lombok.Setter;

/**
 * 문의 응답 DTO
 */
@Getter
@Setter
public class ResponseQnADTO {
    private Long index;
    private String title;
    private String content;
    private String reply; // (필수) 관리자가 답장을 보내는거니까!
    // index, title, content 필수는 아니지만 위에 값을 적어서 어떤 문의 사항에 답장해야 하는지 찾아야 하기 때문에 필요함
}
