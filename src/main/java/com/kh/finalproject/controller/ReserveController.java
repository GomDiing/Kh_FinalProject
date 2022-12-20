package com.kh.finalproject.controller;

import com.kh.finalproject.dto.notice.PagingNoticeDTO;
import com.kh.finalproject.dto.reserve.PaymentReserveDTO;
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
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@Slf4j
@RequestMapping("/api/reserve")
@CrossOrigin(origins = "http://localhost:3000")
public class ReserveController {
    private final ReserveService reserveService;

    @GetMapping("/payment")
    public ResponseEntity<DefaultResponse<Object>> createReserve(@RequestBody PaymentReserveDTO paymentReserveDTO){

        //예매 생성
        reserveService.createReserve(paymentReserveDTO);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, "디버깅 중"), HttpStatus.OK);
    }
}
