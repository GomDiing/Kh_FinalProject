package com.kh.finalproject.dto.notice;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.kh.finalproject.entity.Notice;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.domain.Page;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * 공지사항 DTO
 */
@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class NoticeDTO {
    private Long index;
    private String title;
    private String content;
    private String createTime;

//   notice 목록 조회용
    public NoticeDTO toDTO (Notice notice){
        this.index = notice.getIndex();
        this.title = notice.getTitle();
        this.content = notice.getContent();
        this.createTime = notice.getCreate_time().format(DateTimeFormatter.ofPattern("yyyy.MM.dd"));
        return this;
    }
}
