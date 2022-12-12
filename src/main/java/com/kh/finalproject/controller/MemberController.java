package com.kh.finalproject.controller;

import com.kh.finalproject.dto.member.*;
import com.kh.finalproject.exception.CustomException;
import com.kh.finalproject.response.DefaultResponse;
import com.kh.finalproject.response.DefaultResponseMessage;
import com.kh.finalproject.response.StatusCode;
import com.kh.finalproject.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@CrossOrigin(origins = "http://localhost:3000")
@Slf4j
public class MemberController {
    private final MemberService memberService;

//    일반회원조회(블랙리스트회원 제외)
    @GetMapping("/memberlist")
    public ResponseEntity memberList(){
        List<MemberDTO> memberList = memberService.searchAllMember();
        return new ResponseEntity(memberList, HttpStatus.OK);
    }
//    블랙리스트조회
    @GetMapping("/blacklist")
    public ResponseEntity blackList(){
        List<MemberDTO> memberList = memberService.searchAllBlackMember();
        return new ResponseEntity(memberList, HttpStatus.OK);
    }

//    회원탈퇴시키기(블랙리스트)
    @PostMapping("/notice/delete/member/check")
    public ResponseEntity deleteCheckMember(@RequestBody MemberCheckListDTO memberListAAA){
        List<CheckMemberDTO> checkMemberList = memberListAAA.getMemberDTOCheckList();
        log.info("checkMemberList = {}", checkMemberList.toString());
        boolean isTrue = memberService.deleteCheckMember(checkMemberList);
        if (isTrue) {
            return new ResponseEntity<>(true,HttpStatus.OK);
        } else{
            return new ResponseEntity<>(false,HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * member sign
     */
    @PostMapping("member/sign")
    public ResponseEntity<DefaultResponse<Object>> memberSign(@Validated @RequestBody SignupDTO signupDTO) {

        memberService.signup(signupDTO);

        return new ResponseEntity(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_JOIN_MEMBER), HttpStatus.OK);
    }

    /**
     * member select by email
     */
    @PostMapping("member/search-by-email")
    public ResponseEntity<DefaultResponse<SignupDTO>> searchMemberByEmail(@RequestBody SignupDTO signupDTO) {

        SignupDTO memberList =  memberService.searchByEmail(signupDTO.getEmail());

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_MYPAGE, memberList), HttpStatus.OK);
    }

    /**
     * find memberId by name and email
     */
    @PostMapping("/member/find-id")
    public ResponseEntity<DefaultResponse> findMemberId(@RequestBody FindMemberDTO findMemberDTO) {

        Map<String, String> memberId = memberService.findMemberId(findMemberDTO.getName(), findMemberDTO.getEmail());

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_MYPAGE, memberId), HttpStatus.OK);
    }

    /**
     * find password by id and name and email
     */
    @PostMapping("/member/find-password")
    public ResponseEntity<DefaultResponse> findPassword(@Validated @RequestBody FindMemberDTO findMemberDTO) {

        Map<String, String> password = memberService.findPassword(findMemberDTO.getId(), findMemberDTO.getName(), findMemberDTO.getEmail());

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_MYPAGE, password), HttpStatus.OK);
    }

    /**
     * member info update
     */
    @PostMapping("/member/info-update")
    public ResponseEntity<DefaultResponse<EditMemberInfoDTO>> updateMember(@RequestBody EditMemberInfoDTO editMemberInfoDTO) {

        boolean result = memberService.editMemberInfo(editMemberInfoDTO);

        if(result) return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_UPDATE_MEMBER, editMemberInfoDTO), HttpStatus.OK);
        else return new ResponseEntity<>(DefaultResponse.res(StatusCode.BAD_REQUEST, DefaultResponseMessage.INTERNAL_SERVER_ERROR, editMemberInfoDTO), HttpStatus.BAD_REQUEST);
    }
}