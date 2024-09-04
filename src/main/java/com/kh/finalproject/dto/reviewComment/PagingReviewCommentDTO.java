package com.kh.finalproject.dto.reviewComment;

import com.kh.finalproject.dto.member.MemberDTO;
import com.kh.finalproject.dto.member.PagingMemberDTO;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
public class PagingReviewCommentDTO {
    private Integer page; // 현재페이지
    private Integer totalPages; //총페이지
    private Long totalResults;
    private List<ReviewCommentDTO> reviewCommentDTOList = new ArrayList<>();

    public PagingReviewCommentDTO toPageDTO(Integer page, Integer totalPages, Long totalResults, List<ReviewCommentDTO> reviewCommentDTOList) {
        this.page = page;
        this.totalPages = totalPages;
        this.totalResults = totalResults;
        this.reviewCommentDTOList =reviewCommentDTOList;

        return this;
    }
}
