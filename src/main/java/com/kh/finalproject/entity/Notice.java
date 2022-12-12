package com.kh.finalproject.entity;

import com.kh.finalproject.common.BaseTimeEntity;
import com.kh.finalproject.dto.notice.CreateNoticeDTO;
import com.kh.finalproject.dto.notice.EditNoticeDTO;
import com.kh.finalproject.entity.enumurate.NoticeStatus;
import lombok.Getter;
import javax.persistence.*;
import java.time.LocalDateTime;

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


//    공지사항 작성하기
    public Notice toEntity(CreateNoticeDTO createNoticeDTO){
        this.title = createNoticeDTO.getTitle();
        this.content= createNoticeDTO.getContent();
        this.status = NoticeStatus.ACTIVE;
        return this;
    };

// 공지사항 수정하기
    public Notice toEntity(EditNoticeDTO createNoticeDTO, Long index){
        this.index = index;
        this.title = createNoticeDTO.getTitle();
        this.content= createNoticeDTO.getContent();
        this.status = NoticeStatus.ACTIVE;
        return this;
    };
}


