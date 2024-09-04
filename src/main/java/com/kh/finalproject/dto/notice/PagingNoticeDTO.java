package com.kh.finalproject.dto.notice;

import com.kh.finalproject.entity.Notice;
import lombok.Getter;
import org.springframework.data.domain.Page;

import java.util.ArrayList;
import java.util.List;

@Getter
public class PagingNoticeDTO {
    private Integer page; // 현재페이지
    private Integer totalPages; //총페이지
    private Long totalResults;
    private List<NoticeDTO> noticeDTOList = new ArrayList<>();

    public PagingNoticeDTO toPageDTO(Integer page, Integer totalPages, Long totalResults, List<NoticeDTO> noticeDTOList) {
        this.page = page;
        this.totalPages = totalPages;
        this.totalResults = totalResults;
        this.noticeDTOList = noticeDTOList;

        return this;
    }
}
