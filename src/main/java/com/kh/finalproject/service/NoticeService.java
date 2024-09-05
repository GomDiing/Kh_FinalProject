package com.kh.finalproject.service;

import com.kh.finalproject.dto.notice.*;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * 공지사항 서비스 인터페이스
 */
public interface NoticeService {
    /**
     * 공지사항 작성 메서드
     */
    void createNotice(CreateNoticeDTO createNoticeDTO);

    /**
     * 공지사항 수정 메서드
     */
    void editNotice(EditNoticeDTO editNoticeDTO, Long index);

    /**
     * 공지사항 삭제 메서드
     * 실제로 삭제되지 않고 상태 변환
     */
    void removeNotice(Long index);

    /**
     * 공지사항 전체 조회 메서드
     */
    PagingNoticeDTO selectAll(Pageable pageable);

    /**
     * 공지사항 상세페이지 조회 메서드
     */
    NoticeDTO selectByIndex(Long index);

//    체크박스 삭제
    void deleteCheckNotice(List<CheckDTO> noticeList);

}

