package com.kh.finalproject.controller;

import com.kh.finalproject.dto.member.CheckMemberDTO;
import com.kh.finalproject.dto.member.MemberCheckListDTO;
import com.kh.finalproject.dto.member.MemberDTO;
import com.kh.finalproject.dto.notice.CheckDTO;
import com.kh.finalproject.dto.notice.NoticeListDTO;
import com.kh.finalproject.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

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
}