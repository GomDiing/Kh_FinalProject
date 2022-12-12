package com.kh.finalproject.dto.qna;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.kh.finalproject.entity.Member;
import com.kh.finalproject.entity.QnA;
import com.kh.finalproject.entity.enumurate.QnAStatus;
import lombok.Getter;
import lombok.Setter;

/**
 * 문의 DTO
 */
@Getter
@Setter
public class QnADTO {
    @JsonProperty("member_id")
    private String memberId;
    private String title;
    private String category;
    private String content;
    private QnAStatus status;
    private Long index;
    private String description;

//    public void updateMember(Member member) {
//        this.member = member;
//    }

    public QnADTO toDTO (QnA qna){
        this.index = qna.getIndex();
        this.memberId = qna.getMember().getId();
        this.title = qna.getTitle();
        this.category=qna.getCategory();
        this.content=qna.getContent();
        this.status = qna.getStatus();
        this.description = qna.getStatus().getDescription();

        return this;
    }
}
