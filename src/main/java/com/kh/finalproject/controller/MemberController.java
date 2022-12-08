package com.kh.finalproject.controller;

import com.kh.finalproject.dto.member.MemberDTO;
import com.kh.finalproject.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RequiredArgsConstructor
@RestController
@CrossOrigin(origins = "http://localhost:3000")
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
//    @PostMapping("/delete/{id}")
//    public ResponseEntity<UnregisterDTO> deleteUser(@PathVariable String id){
//        memberService.unregister(id);
//        return new ResponseEntity<>(Map.of("message", "회원 탈퇴 처리"), HttpStatus.OK);
//    }

}