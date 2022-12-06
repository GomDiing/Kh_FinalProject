package com.kh.finalproject.dto.notice;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * 공지사항 DTO
 */
@Getter
@Setter
public class NoticeDTO {
//    private Long index; 자동생성 되는거 안쓰는거 추천
    private Long index;
    private String title;
    private String content;
//    private Integer views; // 조회수
//    private LocalDateTime create_time;
}
