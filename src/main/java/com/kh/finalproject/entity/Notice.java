package com.kh.finalproject.entity;

import com.kh.finalproject.common.BaseTimeEntity;
import com.kh.finalproject.dto.notice.CreateNoticeDTO;
import com.kh.finalproject.dto.notice.EditNoticeDTO;
import com.kh.finalproject.dto.notice.NoticeDTO;
import com.kh.finalproject.entity.enumurate.NoticeStatus;
import lombok.Getter;

import javax.persistence.*;

/**
 * 공지사항 테이블과 연결된 엔티티
 * 생성/수정 시간 갱신 엔티티 클래스를 상속
 */
@Getter
@Entity
@Table(name = "notice")
public class Notice extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "notice_index")
    private Long index;

    @Column(name = "notice_title", nullable = false)
    private String title;

    @Column(name = "notice_content", nullable = false)
    private String content;

    @Column(name = "notice_status", nullable = false)
    @Enumerated(EnumType.STRING)
    private NoticeStatus status;

//    @Column(name = "notice_views", nullable = false)
//    private Integer views;

    public Notice toEntity(CreateNoticeDTO createNoticeDTO){
        this.title = createNoticeDTO.getTitle();
        this.content= createNoticeDTO.getContent();
        this.status = NoticeStatus.ACTIVE;
        return this;
    };
    public Notice toEntity(NoticeDTO noticeDTO){
        this.title = noticeDTO.getTitle();
        this.content = noticeDTO.getContent();
        return this;
    };

    public Notice toEntity(EditNoticeDTO editNoticeDTO){
        this.index = editNoticeDTO.getIndex(); // 자동생성 index 가져오지 말라는데 보여지려면 어떻게../.
        this.title = editNoticeDTO.getTitle();
        this.content = editNoticeDTO.getContent();
        this.status = NoticeStatus.ACTIVE;
        return this;
    }
}


