package com.kh.finalproject.controller;

import com.kh.finalproject.dto.notice.PagingNoticeDTO;
import com.kh.finalproject.response.DefaultResponse;
import com.kh.finalproject.response.DefaultResponseMessage;
import com.kh.finalproject.response.StatusCode;
import com.kh.finalproject.service.ReserveService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@Slf4j
@RequestMapping("/api/reserve")
@CrossOrigin(origins = "http://localhost:3000")
public class ReserveController {
//    private final ReserveService reserveService;

//    @GetMapping("/{code}/{index}")
//    public ResponseEntity<DefaultResponse<Object>> createReserve(){
//       공지 서비스 호출해서 list로 반환
//        PagingNoticeDTO list = noticeService.selectAll(pageable);
//        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_SEARCH_NOTICELIST, list), HttpStatus.OK);
//    }
}
