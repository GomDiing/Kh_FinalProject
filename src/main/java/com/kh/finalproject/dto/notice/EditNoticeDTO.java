package com.kh.finalproject.dto.notice;

import lombok.Getter;
import lombok.Setter;

/**
 * 공지사항 수정 DTO
 */
@Getter
@Setter
public class EditNoticeDTO {
    private Long index;
    private String title;
    private String content;
}
