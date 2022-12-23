package com.kh.finalproject.dto.notice;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

/**
 * 공지사항 작성 DTO
 */
@Getter
@Setter
public class CreateNoticeDTO {
//    private Long index;
    @NotNull(message = "공지사항 제목은 필수 입력값 입니다")
    private String title;
    @NotNull(message = "공지사항 내용은 필수 입력값 입니다")
    private String content;
//    리액트 작성할때 보여지는건 제목 컨텐츠니까 dto 2개만..?
}
