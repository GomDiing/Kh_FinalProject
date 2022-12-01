package com.kh.finalproject.service;

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
    void editNotice(EditNoticeDTO editNoticeDTO);

    /**
     * 공지사항 삭제 메서드
     * 실제로 삭제되지 않고 상태 변환
     */
    void removeNotice(RemoveNoticeDTO removeNoticeDTO);
}
