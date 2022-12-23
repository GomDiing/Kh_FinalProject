package com.kh.finalproject.dto.notice;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;

/**
 * 공지사항 수정 DTO
 */
@Getter
@Setter
public class EditNoticeDTO {
    @NotNull(message = "수정 공지사항 제목은 필수입력값 입니다")
    private String title;
    @NotNull(message = "수정 공지사항 내용은 필수입력값 입니다")
    private String content;
}
