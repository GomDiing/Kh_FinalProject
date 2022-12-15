package com.kh.finalproject.controller;

import com.kh.finalproject.dto.member.CheckMemberDTO;
import com.kh.finalproject.dto.member.MemberCheckListDTO;
import com.kh.finalproject.dto.member.*;
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
        PagingMemberDTO searchMemberList = memberService.searchAllActiveMember(pageable);
        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_SEARCH_MEMBERS_ACTIVE, searchMemberList), HttpStatus.OK);
    }

    /**
     * 전체 블랙리스트 회원 조회
     */
    @GetMapping("/memberblacklist")
    public ResponseEntity<Object> blackList(Pageable pageable){
        PagingMemberDTO searchMemberList = memberService.searchAllBlackMember(pageable);
        log.info("searchMemberList = {}", searchMemberList.getMemberDTOList().get(0).getName());
        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_SEARCH_MEMBERS_BLACKLIST, searchMemberList), HttpStatus.OK);
    }

    /**
     * 블랙리스트 회원 탈퇴
     */
    @PostMapping("/notice/delete/member/check")
    public ResponseEntity<DefaultResponse<Object>> deleteCheckMember(@RequestBody MemberCheckListDTO memberCheckListDTO){
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

        memberService.signup(signupDTO);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_JOIN_MEMBER, true), HttpStatus.OK);
    }

    /**
     * member select by memberId success
     */
    @PostMapping("/search-by-id")
    public ResponseEntity<DefaultResponse<Object>> searchMemberById(@Validated @RequestBody SearchByIdDTO searchByIdDTO) {

        SignupDTO memberList =  memberService.searchById(searchByIdDTO.getId());

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_SEARCH_MEMBER_BY_ID, memberList), HttpStatus.OK);
    }

    /**
     * find memberId by name and email success
     */
    @PostMapping("/find-id")
    public ResponseEntity<DefaultResponse<Object>> findMemberId(@Validated @RequestBody FindIdMemberDTO findIdMemberDTO) {

        Map<String, String> memberId = memberService.findMemberId(findIdMemberDTO.getName(), findIdMemberDTO.getEmail());

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_SEARCH_MEMBER_ID_BY_EMAIL_AND_NAME, memberId), HttpStatus.OK);
    }

    /**
     * find password by id and name and email success
     */
    @PostMapping("/find-password")
    public ResponseEntity<DefaultResponse<Object>> findPassword(@Validated @RequestBody FindPwdMemberDTO findPwdMemberDTO) {

        Map<String, String> password = memberService.findPassword(findPwdMemberDTO.getId(), findPwdMemberDTO.getName(), findPwdMemberDTO.getEmail());

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_SEARCH_MEMBER_PWD_BY_ID_EMAIL_NAME, password), HttpStatus.OK);
    }

    /**
     * 회원 정보 수정 메서드
     */
    @PostMapping("/info-update")
    public ResponseEntity<DefaultResponse<Object>> updateMember(@Validated @RequestBody EditMemberInfoDTO editMemberInfoDTO) {

        memberService.editMemberInfo(editMemberInfoDTO);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_UPDATE_MEMBER), HttpStatus.OK);
    }
}