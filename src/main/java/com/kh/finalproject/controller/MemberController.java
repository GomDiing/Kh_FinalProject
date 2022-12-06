package com.kh.finalproject.controller;


import com.kh.finalproject.dto.member.MemberDTO;
import com.kh.finalproject.entity.enumurate.MemberStatus;
import com.kh.finalproject.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/member")
public class MemberController {
    private final MemberService memberService;

    @PostMapping("/list")
    public ResponseEntity memberList(){
        List<MemberDTO> memberList = memberService.searchAllMember();
        return new ResponseEntity(memberList, HttpStatus.OK);
    }
    @GetMapping("/list/black")
    public ResponseEntity blackList(){
        MemberStatus status = MemberStatus.valueOf("Blacklist");
        System.out.println(status);
        List<MemberDTO> blackList = memberService.searchAllMember();
        return new ResponseEntity(blackList, HttpStatus.OK);
    }



}
