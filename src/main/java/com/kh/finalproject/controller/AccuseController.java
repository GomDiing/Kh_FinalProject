package com.kh.finalproject.controller;

import com.kh.finalproject.dto.accuse.CreateAccuseDTO;
import com.kh.finalproject.entity.Member;
import com.kh.finalproject.service.AccuseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@CrossOrigin(origins = "http://localhost:3000")
@Slf4j
public class AccuseController {
    private final AccuseService accuseService;

    /**
     * 리뷰 신고하기
     */
    @PostMapping("/accuse/{index}")
    public ResponseEntity<Boolean>createAccuse(@PathVariable Long index,
                                               @RequestBody CreateAccuseDTO createAccuseDTO) {
        //후기 index 랑 유저 정보 service 넘겨주기
        Boolean isTrue = accuseService.create(createAccuseDTO, index);
        if (isTrue) {
            return new ResponseEntity<>(true, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(false, HttpStatus.BAD_REQUEST);
        }
    }
}