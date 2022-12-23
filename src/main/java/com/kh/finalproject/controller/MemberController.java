package com.kh.finalproject.controller;

import com.kh.finalproject.dto.member.CheckMemberDTO;
import com.kh.finalproject.dto.member.MemberCheckListDTO;
import com.kh.finalproject.dto.member.*;
import com.kh.finalproject.entity.enumurate.MemberProviderType;
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

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/member")
@Slf4j
@CrossOrigin(origins = "http://localhost:3000")
public class MemberController {
    private final MemberService memberService;

    /**
     * 전체 일반 회원 조회
     */
    @GetMapping("/memberlist")
    public ResponseEntity<Object> searchActiveMemberList(Pageable pageable){
        // 탈퇴하기 전에 먼저 1주일이 지난 회원을 다 unregister 변경
        memberService.unregisterCheck();
        PagingMemberDTO searchMemberList = memberService.searchAllActiveMember(pageable);
        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_SEARCH_MEMBERS_ACTIVE, searchMemberList), HttpStatus.OK);
    }

    /**
     * 전체 블랙리스트 회원 조회
     */
    @GetMapping("/blacklist")
    public ResponseEntity<Object> blackList(Pageable pageable){
        // 탈퇴하기 전에 먼저 1주일이 지난 회원을 다 unregister 변경
        memberService.unregisterCheck();
        PagingMemberDTO searchMemberList = memberService.searchAllBlackMember(pageable);
        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_SEARCH_MEMBERS_BLACKLIST, searchMemberList), HttpStatus.OK);
    }

    /**
     * 블랙리스트 회원 탈퇴(체크박스)
     */
    @PostMapping("/delete/checkbox")
    public ResponseEntity<DefaultResponse<Object>> deleteCheckMember(@RequestBody MemberCheckListDTO memberCheckListDTO){
        // 탈퇴하기 전에 먼저 1주일이 지난 회원을 다 unregister 변경
        memberService.unregisterCheck();
        List<CheckMemberDTO> checkMemberList = memberCheckListDTO.getMemberDTOCheckList();
        log.info("checkMemberList = {}", checkMemberList.toString());

        memberService.changeMemberStatusToUnregister(checkMemberList);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_BLACKLIST_TO_UNREGISTER), HttpStatus.OK);
    }

    /**
     * member sign success
     */
    @PostMapping("/sign")
    public ResponseEntity<DefaultResponse<Object>> memberSign(@Validated @RequestBody SignupDTO signupDTO) {
        // 탈퇴하기 전에 먼저 1주일이 지난 회원을 다 unregister 변경
        memberService.unregisterCheck();
        /*신고 횟수 5회 이상인 회원 블랙리스트 회원으로 변환*/
        memberService.updateStatusByCount();
        memberService.signup(signupDTO);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_JOIN_MEMBER), HttpStatus.OK);
    }

    /**
     * member select by memberId success
     */
    @PostMapping("/search-by-id")
    public ResponseEntity<DefaultResponse<Object>> searchMemberById(@Validated @RequestBody SearchByIdDTO searchByIdDTO) {
        // 탈퇴하기 전에 먼저 1주일이 지난 회원을 다 unregister 변경
        memberService.unregisterCheck();
        memberService.updateStatusByCount();
        MemberDTO memberList =  memberService.searchById(searchByIdDTO);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_SEARCH_MEMBER_BY_ID, memberList), HttpStatus.OK);
    }

    /**
     * find memberId by name and email success
     */
    @PostMapping("/find-id")
    public ResponseEntity<DefaultResponse<Object>> findMemberId(@Validated @RequestBody FindIdMemberDTO findIdMemberDTO) {
        // 탈퇴하기 전에 먼저 1주일이 지난 회원을 다 unregister 변경
        memberService.unregisterCheck();
        Map<String, String> memberId = memberService.findMemberId(findIdMemberDTO.getName(), findIdMemberDTO.getEmail());

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_SEARCH_MEMBER_ID_BY_EMAIL_AND_NAME, memberId), HttpStatus.OK);
    }

    /**
     * find password by id and name and email success
     */

    @PostMapping("/find-password")
    public ResponseEntity<DefaultResponse<Object>> findPassword(@Validated @RequestBody FindPwdMemberDTO findPwdMemberDTO) {
        // 탈퇴하기 전에 먼저 1주일이 지난 회원을 다 unregister 변경
        memberService.unregisterCheck();
        Map<String, String> password = memberService.findPassword(findPwdMemberDTO);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_SEARCH_MEMBER_PWD_BY_ID_EMAIL_NAME, password), HttpStatus.OK);
    }

    /**
     * 회원 정보 수정 메서드
     */
    @PostMapping("/info-update")
    public ResponseEntity<DefaultResponse<Object>> updateMember(@Validated @RequestBody EditMemberInfoDTO editMemberInfoDTO) {
        // 탈퇴하기 전에 먼저 1주일이 지난 회원을 다 unregister 변경
        memberService.unregisterCheck();
        memberService.editMemberInfoByHome(editMemberInfoDTO);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_UPDATE_MEMBER), HttpStatus.OK);
    }

    /**
     * member delete status change
     */
    @PostMapping("/delete")
    public ResponseEntity<DefaultResponse<Object>> deleteChangeMember(@Validated @RequestBody DeleteMemberDTO deleteMemberDTO) {
        // 탈퇴하기 전에 먼저 1주일이 지난 회원을 다 unregister 변경
        memberService.unregisterCheck();
        memberService.deleteChangeMember(deleteMemberDTO);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_DELETE), HttpStatus.OK);
    }

    /*리뷰 신고 횟수 쌓이면 블랙리스트로 변환 되는거 */
    @PostMapping("/accuse/process")
    public ResponseEntity<DefaultResponse<Object>> changeBlacklistByCount() {
        // 탈퇴하기 전에 먼저 1주일이 지난 회원을 다 unregister 변경
        memberService.unregisterCheck();
        List<MemberDTO> members = memberService.updateStatusByCount();
        if (Objects.isNull(members)) {
            throw new CustomException(CustomErrorCode.ERROR_MEMBER_ACCUSED_OVER_FIVE);
        }
        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK,DefaultResponseMessage.SUCCESS_CHANGE_TO_BLACKLIST, members), HttpStatus.OK);
    }

    /**
     * 로그인 컨트롤러
     */
    @PostMapping("/signin")
    public ResponseEntity<Object> signin(@RequestBody SigninRequestDTO signinRequestDTO) {
        // 탈퇴하기 전에 먼저 1주일이 지난 회원을 다 unregister 변경
        memberService.unregisterCheck();
        SigninResponseDTO signinResponseDTO = memberService.signIn(signinRequestDTO);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_LOGIN, signinResponseDTO), HttpStatus.OK);
    }

    /**
     * 탈퇴 신청 취소 컨트롤러
     * 단, 탈퇴 신청한지 일주일 이상이 지나면 탈퇴 취소가 되지 않는다
     */
    @PostMapping("/delete/cancel")
    public ResponseEntity<DefaultResponse<Object>> deleteCancel(@Validated @RequestBody DeleteCancelDTO deleteCancelDTO) {
        // 탈퇴하기 전에 먼저 1주일이 지난 회원을 다 unregister 변경
        memberService.unregisterCheck();
        memberService.deleteCancelMember(deleteCancelDTO);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_DELETE_CANCEL), HttpStatus.OK);
    }
}