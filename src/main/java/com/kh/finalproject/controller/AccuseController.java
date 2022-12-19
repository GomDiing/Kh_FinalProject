package com.kh.finalproject.controller;

import com.kh.finalproject.dto.accuse.CreateAccuseDTO;
import com.kh.finalproject.dto.accuse.ProcessAccuseDTO;
import com.kh.finalproject.entity.Member;
import com.kh.finalproject.response.DefaultResponse;
import com.kh.finalproject.response.DefaultResponseMessage;
import com.kh.finalproject.response.StatusCode;
import com.kh.finalproject.service.AccuseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@Slf4j
@RequestMapping("/api/accuse")
public class AccuseController {
    private final AccuseService accuseService;

    /**
     * 리뷰 신고하기
     */
    @PostMapping("/{index}")
    public ResponseEntity<DefaultResponse<Object>> createAccuse(@PathVariable Long index,
                                               @RequestBody CreateAccuseDTO createAccuseDTO) {
        //후기 index 랑 유저 정보 service 넘겨주기
        accuseService.create(createAccuseDTO, index);
        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_CREATE_ACCUSE), HttpStatus.OK);
    }


}