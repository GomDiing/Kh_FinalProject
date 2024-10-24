package com.kh.finalproject.controller;

import com.kh.finalproject.dto.member.*;
import com.kh.finalproject.exception.CustomErrorCode;
import com.kh.finalproject.exception.CustomException;
import com.kh.finalproject.response.DefaultResponse;
import com.kh.finalproject.response.DefaultResponseMessage;
import com.kh.finalproject.response.StatusCode;
import com.kh.finalproject.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Objects;


/**
 * 회원 관리 API 컨트롤러
 * 회원 가입/조회/수정/탈퇴, 로그인, 블랙리스트 관리, ID/비밀번호 찾기 기능 제공
 * 모든 요청 처리 전 만료된 탈퇴 신청 회원 자동으로 처리
 *
 * @author GomDiing
 */
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/member")
@Slf4j
public class MemberController {

    private final MemberService memberService;

    /**
     * 일반 회원 목록 페이징하여 조회
     * 만료된 탈퇴 신청 회원 자동으로 처리
     *
     * @param pageable 페이징 정보
     * @return 활성 회원 목록 및 페이징 정보와 성공 응답 메시지
     */
    @GetMapping("/memberlist")
    public ResponseEntity<DefaultResponse<PagingMemberDTO>> searchActiveMemberList(Pageable pageable) {

        // 탈퇴하기 전에 먼저 1주일이 지난 회원을 다 unregister 변경
        memberService.unregisterCheck();

        PagingMemberDTO searchMemberList = memberService.searchAllActiveMember(pageable);
        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_SEARCH_MEMBERS_ACTIVE, searchMemberList), HttpStatus.OK);
    }

    /**
     * 블랙리스트 회원 목록 페이징하여 조회
     *
     * @param pageable 페이징 정보
     * @return 블랙리스트 회원 목록 및 페이징 정보와 성공 응답 메시지
     */
    @GetMapping("/blacklist")
    public ResponseEntity<DefaultResponse<PagingMemberDTO>> blackList(Pageable pageable) {
        // 탈퇴하기 전에 먼저 1주일이 지난 회원을 다 unregister 변경
        memberService.unregisterCheck();

        PagingMemberDTO searchMemberList = memberService.searchAllBlackMember(pageable);
        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_SEARCH_MEMBERS_BLACKLIST, searchMemberList), HttpStatus.OK);
    }


    /**
     * 블랙리스트 회원 처리
     * 관리자 권한 페이지에서 체크박스로 처리
     *
     * @param memberCheckListDTO 블랙리스트 정보
     * @return 블랙리스트 성공 응답 메시지
     */
    @PostMapping("/delete/checkbox")
    public ResponseEntity<DefaultResponse<Object>> deleteCheckMember(@Validated @RequestBody MemberCheckListDTO memberCheckListDTO) {
        // 탈퇴하기 전에 먼저 1주일이 지난 회원을 다 unregister 변경
        memberService.unregisterCheck();

        List<CheckMemberDTO> checkMemberList = memberCheckListDTO.getMemberDTOCheckList();
        log.info("checkMemberList = {}", checkMemberList.toString());

        memberService.changeMemberStatusToUnregister(checkMemberList);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_BLACKLIST_TO_UNREGISTER), HttpStatus.OK);
    }


    /**
     * 회원가입 처리
     *
     * @param signupDTO 회원가입 정보
     * @return 회원가입 성공 응답 메시지
     */
    @PostMapping("/sign")
    public ResponseEntity<DefaultResponse<Object>> memberSign(@Validated @RequestBody SignupDTO signupDTO) {
        // 탈퇴하기 전에 먼저 1주일이 지난 회원을 다 unregister 변경
        memberService.unregisterCheck();

        memberService.signup(signupDTO);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_JOIN_MEMBER), HttpStatus.OK);
    }

    /**
     * 회원 정보 조회
     *
     * @param searchByIdDTO 조회할 회원 정보
     * @return 조회한 회원 정보 및 응답 메시지
     */
    @PostMapping("/search-by-id")
    public ResponseEntity<DefaultResponse<MemberDTO>> searchMemberById(@Validated @RequestBody SearchByIdDTO searchByIdDTO) {
        // 탈퇴하기 전에 먼저 1주일이 지난 회원을 다 unregister 변경
        memberService.unregisterCheck();

        MemberDTO memberList = memberService.searchById(searchByIdDTO);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_SEARCH_MEMBER_BY_ID, memberList), HttpStatus.OK);
    }

    /**
     * 회원 아이디 조회
     * 홈페이지에서 가입한 회원에게만 제공하는 서비스
     *
     * @param findIdMemberDTO 회원 아이디 조회하는데 필요한 정보
     * @return 조회한 회원 아이디와 응답 메시지
     */
    @PostMapping("/find-id")
    public ResponseEntity<DefaultResponse<Map<String, String>>> findMemberId(@Validated @RequestBody FindIdMemberDTO findIdMemberDTO) {
        // 탈퇴하기 전에 먼저 1주일이 지난 회원을 다 unregister 변경
        memberService.unregisterCheck();

        Map<String, String> memberId = memberService.findMemberId(findIdMemberDTO.getName(), findIdMemberDTO.getEmail());

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_SEARCH_MEMBER_ID_BY_EMAIL_AND_NAME, memberId), HttpStatus.OK);
    }


    /**
     * 회원 비밀번호 조회
     * 홈페이지에서 가입한 회원에게만 제공하는 서비스
     *
     * @param findPwdMemberDTO 회원 비밀번호 조회하는데 필요한 정보
     * @return 조회한 회원 비밀번호와 응답 메시지
     */
    @PostMapping("/find-password")
    public ResponseEntity<DefaultResponse<Map<String, String>>> findPassword(@Validated @RequestBody FindPwdMemberDTO findPwdMemberDTO) {
        // 탈퇴하기 전에 먼저 1주일이 지난 회원을 다 unregister 변경
        memberService.unregisterCheck();

        Map<String, String> password = memberService.findPassword(findPwdMemberDTO);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_SEARCH_MEMBER_PWD_BY_ID_EMAIL_NAME, password), HttpStatus.OK);
    }


    /**
     * 회원 정보 수정
     *
     * @param editMemberInfoDTO 수정할 회원 정보
     * @return 회원 정보 수정 성공 응답 메시지
     */
    @PostMapping("/info-update")
    public ResponseEntity<DefaultResponse<Object>> updateMember(@Validated @RequestBody EditMemberInfoDTO editMemberInfoDTO) {
        // 탈퇴하기 전에 먼저 1주일이 지난 회원을 다 unregister 변경
        memberService.unregisterCheck();

        memberService.editMemberInfoByHome(editMemberInfoDTO);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_UPDATE_MEMBER), HttpStatus.OK);
    }

    /**
     * 회원 탈퇴
     * 홈페이지에서 가입한 회원에게만 제공하는 서비스
     *
     * @param deleteMemberDTO 탈퇴 회원 정보
     * @return 회원 탈퇴 성공 응답 메시지
     */
    @PostMapping("/delete")
    public ResponseEntity<DefaultResponse<Object>> deleteChangeMember(@Validated @RequestBody DeleteMemberDTO deleteMemberDTO) {
        // 탈퇴하기 전에 먼저 1주일이 지난 회원을 다 unregister 변경
        memberService.unregisterCheck();

        memberService.deleteChangeMember(deleteMemberDTO);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_DELETE), HttpStatus.OK);
    }

    /**
     * 신고 횟수 5회 이상인 회원 블랙리스트로 자동 전환
     * 대상 없으면 예외 발생
     *
     * @return 블랙리스트로 전환된 회원 목록과 성공 응답 메시지
     * @throws CustomException 신고 누적 5회 이상 회원이 존재하지 않을 경우
     */
    @PostMapping("/accuse/process")
    public ResponseEntity<DefaultResponse<List<MemberDTO>>> changeBlacklistByCount() {
        // 탈퇴하기 전에 먼저 1주일이 지난 회원을 다 unregister 변경
        memberService.unregisterCheck();

        List<MemberDTO> members = memberService.updateStatusByCount();
        if (Objects.isNull(members)) {
            throw new CustomException(CustomErrorCode.ERROR_MEMBER_ACCUSED_OVER_FIVE);
        }
        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_CHANGE_TO_BLACKLIST, members), HttpStatus.OK);
    }

    /**
     * 로그인
     *
     * @param signinRequestDTO 로그인 회원 정보
     * @return 로그인 성공 응답 메시지 및 로그인 회원 정보
     */
    @PostMapping("/signin")
    public ResponseEntity<DefaultResponse<SigninResponseDTO>> signin(@Validated @RequestBody SigninRequestDTO signinRequestDTO) {
        // 탈퇴하기 전에 먼저 1주일이 지난 회원을 다 unregister 변경
        memberService.unregisterCheck();

        SigninResponseDTO signinResponseDTO = memberService.signIn(signinRequestDTO);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_LOGIN, signinResponseDTO), HttpStatus.OK);
    }

    /**
     * 회원 탈퇴를 신청하고 상태를 변경합니다.
     * 1주일 후 자동으로 완전 탈퇴 처리됩니다.
     *
     * @param deleteCancelDTO 탈퇴 처리할 회원 정보
     * @return 탈퇴 신청 완료 응답 메시지
     */
    @PostMapping("/delete/cancel")
    public ResponseEntity<DefaultResponse<Object>> deleteCancel(@Validated @RequestBody DeleteCancelDTO deleteCancelDTO) {
        // 탈퇴하기 전에 먼저 1주일이 지난 회원을 다 unregister 변경
        memberService.unregisterCheck();

        // 신고 횟수 5회 이상인 회원 블랙리스트 회원으로 변환
        memberService.deleteCancelMember(deleteCancelDTO);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_DELETE_CANCEL), HttpStatus.OK);
    }
}