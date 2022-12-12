package com.kh.finalproject.service;

import com.kh.finalproject.dto.member.*;

import java.util.List;
import java.util.Map;

/**
 * 회원 서비스 인터페이스
 * 홈페이지 가입 회원 로직만 기재
 * 소셜 로그인 가입 회원 관련 서비스는 추후 기재
 */
public interface MemberService {

    /**
     * 회원 가입 메서드
     */
    void signup(SignupDTO signupDto);

    /**
     * 이메일로 회원 조회
     */
    SignupDTO searchByEmail(String email);

    /**
     * 회원 이름과 이메일로 아이디 찾기
     */
    Map<String, String> findMemberId(String name, String email);

    /**
     * 회원 아이디 이름 이메일로 비밀번호 찾기
     */
    Map<String, String> findPassword(String id, String name, String email);
    /**
     * 회원 탈퇴 메서드(관리자 강제탈퇴)
     * 실제로 삭제되지 않고 상태 변환 후 탈퇴 시간 기록
     */
    Boolean unregister(UnregisterDTO unregisterDTO);

    /**
     * 중복 이메일 검증 메서드
     * 단, 완전 탈퇴 상태 회원의 이메일은 중복 검증에서 제외
     */
    void validateDuplicateByEmail(String email);

    /**
     * 회원 ID와 비밀번호로 회원 조회 메서드
     */
    MemberDTO searchByIdPassword(SearchByIdPasswordDTO searchByIdPasswordDTO);

    /**
     * 회원 ID로 회원 정보 조회 메서드
     */
    MemberDTO searchByIndex(Long index);

    /**
     * 비밀번호 변경 메서드
     */
    void updatePassword(UpdatePasswordDTO updatePasswordDTO);

    /**
     * 전체 회원 조회 메서드
     */
    List<MemberDTO> searchAllMember();

//    블랙리스트 전체조회
    List<MemberDTO> searchAllBlackMember();

    /**
     * [관리자 차트] 테이블 총 회원수 갱신 메서드
     * 회원이 가입 / 삭제 될 경우 [관리자 차트] 테이블의 컬럼 값 갱신
     */
    void updateTotalMemberInChart(Integer count);

    /**
     * [후기/상태] 테이블 상태 갱신 메서드
     * 회원 상태가 변경될 경우 해당 회원이 등록한 후기/상태 테이블 상태 변환
     */
    void updateStatusInReviewComment(Long index);

    /**
     * 회원 정보 수정 메서드
     */
    Boolean editMemberInfo(EditMemberInfoDTO editMemberInfoDTO);

//    체크박스로 회원 탈퇴
    Boolean deleteCheckMember(List<CheckMemberDTO> memberIndexList);
}