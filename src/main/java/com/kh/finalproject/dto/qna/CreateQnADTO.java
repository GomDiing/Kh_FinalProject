package com.kh.finalproject.dto.qna;

import lombok.Getter;
import lombok.Setter;

/**
 * 문의 생성 DTO
 */
@Getter
@Setter
public class CreateQnADTO {
    private Long index;
    private String memberId;
    private String title;
    private String category;
    private String content;
    private String qnaStatus;

}
