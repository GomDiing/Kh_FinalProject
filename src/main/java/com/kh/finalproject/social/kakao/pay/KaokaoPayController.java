package com.kh.finalproject.social.kakao.pay;

import com.kh.finalproject.response.DefaultResponse;
import com.kh.finalproject.response.DefaultResponseMessage;
import com.kh.finalproject.response.StatusCode;
import com.kh.finalproject.social.kakao.pay.approve.KakaoPayApproveRequestDTO;
import com.kh.finalproject.social.kakao.pay.approve.KakaoPayApproveResponse;
import com.kh.finalproject.social.kakao.pay.cancel.KakaoPayCancelRequestDTO;
import com.kh.finalproject.social.kakao.pay.cancel.KakaoPayCancelResponse;
import com.kh.finalproject.social.kakao.pay.ready.KakaoPayReadyRequestDTO;
import com.kh.finalproject.social.kakao.pay.ready.KakaoPayReadyResponse;
import com.kh.finalproject.social.kakao.pay.ready.KakaoPayService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequiredArgsConstructor
@RequestMapping("pay/kakao")
@Slf4j
public class KaokaoPayController {

    private final KakaoPayService kakaoPayService;

    @PostMapping("/ready")
    public ResponseEntity<DefaultResponse<Object>> kakaoPayReady(@Validated @RequestBody KakaoPayReadyRequestDTO kakaoPayReadyRequestDTO) {

        KakaoPayReadyResponse kakaoPayReadyResponse = kakaoPayService.ready(kakaoPayReadyRequestDTO);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_KAKAOPAY_READY, kakaoPayReadyResponse), HttpStatus.OK);
    }

    @PostMapping("/approve")
    public ResponseEntity<DefaultResponse<Object>> kakaoPayApprove(@Validated @RequestBody KakaoPayApproveRequestDTO kakaoPayApproveRequestDTO) {

        KakaoPayApproveResponse kakaoPayApproveResponse = kakaoPayService.approve(kakaoPayApproveRequestDTO);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_KAKAOPAY_APPROVE, kakaoPayApproveResponse), HttpStatus.OK);
    }

    @PostMapping("/cancel")
    public ResponseEntity<DefaultResponse<Object>> kakaoPayApprove(@Validated @RequestBody KakaoPayCancelRequestDTO kakaoPayCancelRequestDTO) {

        KakaoPayCancelResponse kakaoPayCancelResponse = kakaoPayService.cancel(kakaoPayCancelRequestDTO);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_KAKAOPAY_CANCEL, kakaoPayCancelResponse), HttpStatus.OK);
    }
}
