package com.kh.finalproject.service;

import com.kh.finalproject.dto.accuse.AccuseDTO;
import com.kh.finalproject.dto.accuse.CancelAccuseDTO;
import com.kh.finalproject.dto.accuse.CreateAccuseDTO;
import com.kh.finalproject.dto.accuse.ProcessAccuseDTO;
import com.kh.finalproject.entity.Accuse;
import com.kh.finalproject.entity.Member;
import com.kh.finalproject.entity.ReviewComment;

import java.util.List;

/**
 * 신고 서비스 인터페이스
 */
public interface AccuseService {
    /**
     * 신고 생성 메서드
     * 단, 회원은 한 후기에 단 한번만 신고 가능
     */
    void create(CreateAccuseDTO createAccuseDTO, Long index);

    /**
     * 신고 처리 메서드
     * 관리자가 신고된 내용을 처리, 신고 사유를 반드시 기입
     * (5번 이상 신고당하면 블랙리스트 목록으로 이동) => memberEntity에 accuseCount 추가 해서 memberController 쪽에서 처리했습니다.
     */
//    void process(ProcessAccuseDTO processAccuseDTO);

    /**
     * 전체 신고 조회 메서드
     */
    List<AccuseDTO> searchAll();

    /**
     * 신고 조회 메서드
     * 회원(피해자)이 자신이 신고 처리 내용을 조회하기 위해 사용
     */
    AccuseDTO searchByMemberVictim();

    /**
     * 신고 취소 메서드
     * 회원이 자신이 신고한 신고 내용을 취소할 경우
     * 단, 신고 상태가 대기 일 경우에만 가능
     */
    void cancel(CancelAccuseDTO cancelAccuseDTO);
}
