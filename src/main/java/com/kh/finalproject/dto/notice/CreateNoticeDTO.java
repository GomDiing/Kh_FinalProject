package com.kh.finalproject.dto.notice;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * 공지사항 작성 DTO
 */
@Getter
@Setter
public class CreateNoticeDTO {
    private Long index;
    private String title;
    private String content;
//    리액트 작성할때 보여지는건 제목 컨텐츠니까 dto 2개만..?
}
