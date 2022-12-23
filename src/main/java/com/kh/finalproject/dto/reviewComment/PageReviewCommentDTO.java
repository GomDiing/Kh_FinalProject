package com.kh.finalproject.dto.reviewComment;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
public class PageReviewCommentDTO {
    private Integer page; // 현재페이지
    private Integer totalPages; //총페이지
    private Long totalResults;

    @JsonProperty("review_comment_list")
    private List<ParentReviewDTO> parentReviewDTOList = new ArrayList<>();

    public PageReviewCommentDTO toPageDTO(Integer page, Integer totalPages, Long totalResults, List<ParentReviewDTO> parentReviewDTOList) {
        this.page = page;
        this.totalPages = totalPages;
        this.totalResults = totalResults;
        this.parentReviewDTOList = parentReviewDTOList;

        return this;
    }
}
