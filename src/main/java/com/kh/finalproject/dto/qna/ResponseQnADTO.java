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
    private String reply;
    private String content;

}
