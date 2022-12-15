package com.kh.finalproject.service;

import com.kh.finalproject.dto.notice.PagingNoticeDTO;
import com.kh.finalproject.dto.qna.*;
import com.kh.finalproject.entity.Member;
import com.kh.finalproject.entity.QnA;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * 1대1 문의 서비스 인터페이스
 */
public interface QnAService {
    /**
     * 문의 생성 메서드
     * 문의 상태를 '질문 대기'로 생성
     */
    void create(CreateQnADTO createQnADTO);

    /**
     * 문의 수정 메서드
     * 단, 해당 문의 상태가 '질문 대기'와 '추가 문의'일 경우에만 가능
     */
    void update(UpdateQnADTO updateQnADTO);

    /**
     * 문의 취소 메서드
     * 실제로 삭제되지않고 해당 문의 상태 변경
     */
    void cancel(CancelQnADTO cancelQnADTO);

    /**
     * 회원 인덱스로 문의 조회 메서드
     */
    PagingQnaDTO searchByMember(Long index,Pageable pageable);

    /**
     * 문의 전체 조회 메서드
     */
    PagingQnaDTO searchAll(Pageable pageable);

    /**
     * 문의 응답 메서드
     * 적절한 응답 처리 후 문의 상태를 '응답 완료'로 변경
     */
    void response(ResponseQnADTO responseQnADTO);

    /**
     * 추가 문의 메서드
     * 단, 해당 질문 상태가 '문의 취소' 일 경우엔 불가능
     * 적절한 추가 문의 후 상태를 '추가 문의'로 변경
     */
    void createExtra(CreateExtraQnADTO createExtraQnADTO);
}
