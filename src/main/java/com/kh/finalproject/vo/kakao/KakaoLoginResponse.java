package com.kh.finalproject.vo.kakao;

import lombok.Getter;
import lombok.Setter;

@Getter
public class KakaoLoginResponse {
    private String access_token;
    private String token_type;
    private Integer expires_in;
    private String refresh_token;
    private Integer refresh_token_expires_in;
    private String scope;
}
