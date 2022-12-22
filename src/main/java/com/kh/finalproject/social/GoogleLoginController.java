package com.kh.finalproject.social;


import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.kh.finalproject.entity.enumurate.MemberProviderType;
import com.kh.finalproject.repository.MemberRepository;
import com.kh.finalproject.service.MemberService;
import com.kh.finalproject.social.google.ConfigUtils;
import com.kh.finalproject.social.google.GoogleLoginDto;
import com.kh.finalproject.social.google.GoogleLoginRequest;
import com.kh.finalproject.social.google.GoogleLoginResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.net.URISyntaxException;
import java.nio.charset.StandardCharsets;

@Controller
@RequiredArgsConstructor
@RequestMapping(value = "/google")
@Slf4j
public class GoogleLoginController {

    private final ConfigUtils configUtils;

    private final MemberService memberService;

    @GetMapping(value = "/login")
    public ResponseEntity<Object> moveGoogleInitUrl() {
        String authUrl = configUtils.googleInitUrl();
        try {
//            URI redirectUri = new URI(authUrl);
            HttpHeaders httpHeaders = new HttpHeaders();
            httpHeaders.setLocation(new URI(authUrl));
            return new ResponseEntity<>(httpHeaders, HttpStatus.SEE_OTHER);
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }

        return ResponseEntity.badRequest().build();
    }

    @GetMapping(value = "/login/redirect")
    public String redirectGoogleLogin(
            @RequestParam(value = "code") String authCode
    ) {
        // HTTP 통신을 위해 RestTemplate 활용
        log.info("Auth Code = {}", authCode);
        RestTemplate restTemplate = new RestTemplate();
        GoogleLoginRequest requestParams = GoogleLoginRequest.builder()
                .clientId(configUtils.getGoogleClientId())
                .clientSecret(configUtils.getGoogleSecret())
                .code(authCode)
                .redirectUri(configUtils.getGoogleRedirectUri())
                .grantType("authorization_code")
                .build();
        log.info("Request Parameters = {}", requestParams.toString());

        try {
            // Http Header 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<GoogleLoginRequest> httpRequestEntity = new HttpEntity<>(requestParams, headers);
            ResponseEntity<String> apiResponseJson = restTemplate.postForEntity(configUtils.getGoogleAuthUrl() + "/token", httpRequestEntity, String.class);

            // ObjectMapper를 통해 String to Object로 변환
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.setPropertyNamingStrategy(PropertyNamingStrategy.SNAKE_CASE);
            objectMapper.setSerializationInclusion(JsonInclude.Include.NON_NULL); // NULL이 아닌 값만 응답받기(NULL인 경우는 생략)
            GoogleLoginResponse googleLoginResponse = objectMapper.readValue(apiResponseJson.getBody(), new TypeReference<GoogleLoginResponse>() {});

            // 사용자의 정보는 JWT Token으로 저장되어 있고, Id_Token에 값을 저장한다.
            String jwtToken = googleLoginResponse.getIdToken();
            log.info("GoogleLoginResponse");
            log.info("AccessToken = {}", googleLoginResponse.getAccessToken());
            log.info("IdToken(AccessToken) = {}", googleLoginResponse.getIdToken());


            // JWT Token을 전달해 JWT 저장된 사용자 정보 확인
            String requestUrl = UriComponentsBuilder.fromHttpUrl(configUtils.getGoogleAuthUrl() + "/tokeninfo").queryParam("id_token", jwtToken).toUriString();

            String resultJson = restTemplate.getForObject(requestUrl, String.class);

            if(resultJson != null) {
                GoogleLoginDto userInfoDto = objectMapper.readValue(resultJson, new TypeReference<GoogleLoginDto>() {});
                log.info("Google Login Dto = {}", userInfoDto.toString());

                Boolean isJoin = memberService.searchByEmailSocialLogin(userInfoDto.getEmail(), MemberProviderType.GOOGLE);
                int isJoinParam = 0;
                if (isJoin) isJoinParam = 1;

//                return ResponseEntity.ok().body(userInfoDto);
                return "redirect:" + UriComponentsBuilder.fromUriString("http://localhost:8100/social")
                        .queryParam("name", userInfoDto.getFamilyName() + " " + userInfoDto.getGivenName())
                        .queryParam("email", userInfoDto.getEmail())
                        .queryParam("isJoin", isJoinParam)
                        .queryParam("socialSuccess", 1)
                        .queryParam("providerType", MemberProviderType.GOOGLE.name())
                        .build()
                        .encode(StandardCharsets.UTF_8);
            }
            else {
                throw new Exception("Google OAuth failed!");
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }

        return "redirect:" + UriComponentsBuilder.fromUriString("http://localhost:8100/social")
                .queryParam("socialSuccess", 0)
                .queryParam("providerType", MemberProviderType.GOOGLE.name())
                .build()
                .encode(StandardCharsets.UTF_8);
    }
}