package com.kh.finalproject.dto.notice;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.Lob;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

/**
 * 공지사항 작성 DTO
 */
@Getter
@Setter
public class CreateNoticeDTO {
    @NotNull(message = "공지사항 제목은 필수 입력값 입니다")
    private String title;
    @NotNull(message = "공지사항 내용은 필수 입력값 입니다")
    private String content;
}
