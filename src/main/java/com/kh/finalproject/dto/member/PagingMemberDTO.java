package com.kh.finalproject.dto.member;

import com.kh.finalproject.dto.notice.NoticeDTO;
import com.kh.finalproject.dto.notice.PagingNoticeDTO;
import com.kh.finalproject.entity.Member;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
public class PagingMemberDTO {
    private Integer page; // 현재페이지
    private Integer totalPages; //총페이지
    private Long totalResults;
    private List<MemberDTO> memberDTOList = new ArrayList<>();

    public PagingMemberDTO toPageDTO(Integer page, Integer totalPages, Long totalResults, List<MemberDTO> memberDTOList) {
        this.page = page;
        this.totalPages = totalPages;
        this.totalResults = totalResults;
        this.memberDTOList = memberDTOList;

        return this;
    }
}