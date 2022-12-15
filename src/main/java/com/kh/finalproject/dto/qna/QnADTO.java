package com.kh.finalproject.dto.qna;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.kh.finalproject.entity.Member;
import com.kh.finalproject.entity.QnA;
import com.kh.finalproject.entity.enumurate.QnAStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.format.DateTimeFormatter;

/**
 * 문의 DTO
 */
@Getter
@Setter
public class QnADTO {
    private Long index;
    private String id;
    private String title;
    private String category;
    private String content;
    private String qnaStatus;
    private String reply;
    private String replyTime;
    private String createTime;

    /*문의사항 조회*/
    public QnADTO toDTO (QnA qna){
        this.index = qna.getIndex();
        this.id = qna.getMember().getId();
        this.title = qna.getTitle();
        this.category=qna.getCategory();
        this.content=qna.getContent();
        this.qnaStatus=qna.getStatus().getStatus();
        this.reply = qna.getReply();
        this.replyTime = qna.getReplyTime().format(DateTimeFormatter.ofPattern("yyyy.MM.dd"));
        this.createTime = qna.getCreate_time().format(DateTimeFormatter.ofPattern("yyyy.MM.dd"));

        return this;
    }
}
