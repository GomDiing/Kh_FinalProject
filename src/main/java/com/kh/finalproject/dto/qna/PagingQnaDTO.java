package com.kh.finalproject.dto.qna;

import lombok.Getter;
import java.util.ArrayList;
import java.util.List;

@Getter
public class PagingQnaDTO {
    private Integer page; // 현재페이지
    private Integer totalPages; //총페이지
    private Long totalResults;
    private List<QnADTO> qnaDTOList = new ArrayList<>();

    public PagingQnaDTO toPageDTO(Integer page, Integer totalPages, Long totalResults, List<QnADTO> qnaDTOList) {
        this.page = page;
        this.totalPages = totalPages;
        this.totalResults = totalResults;
        this.qnaDTOList = qnaDTOList;

        return this;
    }
}
