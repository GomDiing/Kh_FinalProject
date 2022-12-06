package com.kh.finalproject.service;

import com.kh.finalproject.dto.notice.CreateNoticeDTO;
import com.kh.finalproject.dto.notice.EditNoticeDTO;
import com.kh.finalproject.dto.notice.NoticeDTO;
import com.kh.finalproject.dto.notice.RemoveNoticeDTO;

import java.util.List;

/**
 * 공지사항 서비스 인터페이스
 */
public interface NoticeService {
    /**
     * 공지사항 작성 메서드
     */
    Boolean createNotice(CreateNoticeDTO createNoticeDTO);

    /**
     * 공지사항 수정 메서드
     */
    Boolean editNotice(EditNoticeDTO editNoticeDTO);

    /**
     * 공지사항 삭제 메서드
     * 실제로 삭제되지 않고 상태 변환
     */
    void removeNotice(Long index);


    /**
     * 공지사항 전체 조회 메서드
     */
    List<NoticeDTO> selectAll();

    /**
     * 공지사항 조회 메서드
     */
//    NoticeDTO selectByIndex(Long index);

    List<NoticeDTO> selectByIndex(Long index);
}

