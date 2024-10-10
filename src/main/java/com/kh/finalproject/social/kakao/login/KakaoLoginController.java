package com.kh.finalproject.social.kakao.login;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kh.finalproject.entity.enumurate.MemberProviderType;
import com.kh.finalproject.exception.CustomErrorCode;
import com.kh.finalproject.exception.CustomException;
import com.kh.finalproject.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.nio.charset.StandardCharsets;

@RequiredArgsConstructor
@Controller
@RequestMapping("/login/oauth2/code")
@Slf4j
//@CrossOrigin(origins = "*", allowedHeaders = "*")
public class KakaoLoginController {


    private final MemberService memberService;
    @Value("${kakao.client-id}")
    private String kakaoId;

    @Value("${kakao.client-secret}")
    private String kakaoSecret;

    @Value("${kakao.authorization-grant-type}")
    private String kakaoAuthorizationGrantType;

    @Value("${kakao.redirect-uri}")
    private String kakaoRedirectUri;


    @GetMapping("/kakao")
    public String redirectKakaoLogin(
            @RequestParam(value = "code") String authCode, HttpServletResponse res, HttpSession session) {

//        return socialLoginService.processKakaoLogin(authCode, res, session);

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
            KakaoLoginTokenResponse kakaoResponseObject = objectMapper.readValue(accessTokenResponse.getBody(), new TypeReference<KakaoLoginTokenResponse>() {
            });

            session.setAttribute("Authorization", kakaoResponseObject.getAccess_token());

            String header = "Bearer " + kakaoResponseObject.getAccess_token();
            log.info("header = {}", header);
            MultiValueMap<String, String> requestHeaders = new LinkedMultiValueMap<>();
            requestHeaders.add("Authorization", header);
            log.info(requestHeaders.toString());

            ResponseEntity<String> responseBody = restTemplate.exchange(
                    "https://kapi.kakao.com/v2/user/me",
                    HttpMethod.GET,
                    new HttpEntity<>(requestHeaders),
                    String.class
            );

            log.info("responseBody = {}", responseBody.getBody());

            KakaoLoginUserInfo profile = objectMapper.readValue(responseBody.getBody(), new TypeReference<>() {
            });
            log.info("profile = {}", profile);

            if (profile != null) {

                KakaoLoginUserInfoProperties properties = profile.getProperties();
                KakaoLoginUserInfoKakaoAccount kakao_account = profile.getKakao_account();

                String nickname = properties.getNickname();
                String email = kakao_account.getEmail();

                Boolean isJoin = memberService.searchByEmailSocialLogin(email, MemberProviderType.KAKAO);
                int isJoinParam = 0;
                if (isJoin) isJoinParam = 1;

                return "redirect:" + UriComponentsBuilder.fromUriString("http://localhost:8100/social")
//                return "redirect:" + UriComponentsBuilder.fromUriString("https://tcats.tk/social")
                        .queryParam("name", nickname)
                        .queryParam("email", email)
                        .queryParam("isJoin", isJoinParam)
                        .queryParam("socialSuccess", 1)
                        .queryParam("providerType", MemberProviderType.KAKAO.name())
                        .build()
                        .encode(StandardCharsets.UTF_8);
            }

        } catch (Exception e) {
            throw new CustomException(CustomErrorCode.ERROR_KAKAO_LOGIN);
        }
        return "redirect:" + UriComponentsBuilder.fromUriString("http://localhost:8100/social")
//        return "redirect:" + UriComponentsBuilder.fromUriString("https://tcats.tk/social")
                .queryParam("socialSuccess", 0)
                .queryParam("providerType", MemberProviderType.KAKAO.name())
                .build()
                .encode(StandardCharsets.UTF_8);
    }
}
