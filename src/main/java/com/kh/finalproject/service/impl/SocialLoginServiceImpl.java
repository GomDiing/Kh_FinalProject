package com.kh.finalproject.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kh.finalproject.dto.member.KakaoLoginResponseDTO;
import com.kh.finalproject.response.DefaultResponse;
import com.kh.finalproject.response.DefaultResponseMessage;
import com.kh.finalproject.response.StatusCode;
import com.kh.finalproject.vo.kakao.KakaoLoginInfoAccount;
import com.kh.finalproject.vo.kakao.KakaoLoginInfoProfile;
import com.kh.finalproject.vo.kakao.KakaoLoginInfoProperties;
import com.kh.finalproject.vo.kakao.KakaoLoginResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class SocialLoginServiceImpl {
    @Value("${kakao.client-id}")
    private String kakaoId;

    @Value("${kakao.client-secret}")
    private String kakaoSecret;

    @Value("${kakao.authorization-grant-type}")
    private String kakaoAuthorizationGrantType;

    @Value("${kakao.redirect-uri}")
    private String kakaoRedirectUri;

    public KakaoLoginResponseDTO processKakaoLogin(String authCode, HttpServletResponse res, HttpSession session) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();

        headers.add("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");

        MultiValueMap<String, String> accessTokenParams = new LinkedMultiValueMap<>();
        accessTokenParams.add("grant_type", kakaoAuthorizationGrantType);
        accessTokenParams.add("client_id", kakaoId);
        accessTokenParams.add("code", authCode);
        accessTokenParams.add("redirect_uri", kakaoRedirectUri);
        accessTokenParams.add("client_secret", kakaoSecret);

        log.info("accessTokenParams = {}", accessTokenParams.toString());
        log.info("headers = {}", headers);

        ResponseEntity<String> accessTokenResponse = restTemplate.postForEntity("https://kauth.kakao.com/oauth/token", accessTokenParams, String.class);

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            log.info("accessTokenResponse = {}", accessTokenResponse.getBody());
            KakaoLoginResponse kakaoResponseObject = objectMapper.readValue(accessTokenResponse.getBody(), new TypeReference<KakaoLoginResponse>() {
            });

            session.setAttribute("Authorization", kakaoResponseObject.getAccess_token());

            String header = "Bearer " + kakaoResponseObject.getAccess_token();
            log.info("header = {}", header);
            MultiValueMap<String, String> requestHeaders = new LinkedMultiValueMap<>();
            requestHeaders.add("Authorization", header);

            ResponseEntity<String> responseBody = restTemplate.exchange(
                    "https://kapi.kakao.com/v2/user/me",
                    HttpMethod.GET,
                    new HttpEntity<>(requestHeaders),
                    String.class
            );

            KakaoLoginInfoProfile profile = objectMapper.readValue(responseBody.getBody(), new TypeReference<KakaoLoginInfoProfile>() {
            });

            if (profile != null) {

                KakaoLoginInfoProperties properties = profile.getProperties();
                KakaoLoginInfoAccount kakao_account = profile.getKakao_account();

                String nickname = properties.getNickname();
                String email = kakao_account.getEmail();

                return new KakaoLoginResponseDTO().toDTO(email, nickname);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
