package com.kh.finalproject.controller;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kh.finalproject.dto.member.KakaoLoginResponseDTO;
import com.kh.finalproject.exception.CustomErrorCode;
import com.kh.finalproject.exception.CustomException;
import com.kh.finalproject.response.DefaultErrorResponse;
import com.kh.finalproject.response.DefaultResponse;
import com.kh.finalproject.response.DefaultResponseMessage;
import com.kh.finalproject.response.StatusCode;
import com.kh.finalproject.service.impl.SocialLoginServiceImpl;
import com.kh.finalproject.vo.kakao.KakaoLoginInfoAccount;
import com.kh.finalproject.vo.kakao.KakaoLoginInfoProfile;
import com.kh.finalproject.vo.kakao.KakaoLoginInfoProperties;
import com.kh.finalproject.vo.kakao.KakaoLoginResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@RequiredArgsConstructor
@RestController
@RequestMapping("/login/oauth2/code")
@Slf4j
@CrossOrigin(origins = "http://localhost:3000")
public class SocialLoginController {

    private final SocialLoginServiceImpl socialLoginService;

    @GetMapping("/kakao")
    public ResponseEntity<Object> redirectKakaoLogin(
            @RequestParam(value = "code") String authCode, HttpServletResponse res, HttpSession session) {

        KakaoLoginResponseDTO kakaoLoginResponse = socialLoginService.processKakaoLogin(authCode, res, session);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_KAKAO_SIGNUP, kakaoLoginResponse), HttpStatus.OK);
    }
}
