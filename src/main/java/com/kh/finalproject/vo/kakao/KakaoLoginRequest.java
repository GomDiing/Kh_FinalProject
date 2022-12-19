package com.kh.finalproject.vo.kakao;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Builder
public class KakaoLoginRequest {
    @JsonProperty("grant_type")
    private String grant_type;

    @JsonProperty("client_id")
    private String client_id;

    @JsonProperty("code")
    private String code;

    @JsonProperty("redirect_uri")
    private String redirect_uri;

//    public KakaoLoginRequest createRequest(String grantType, String clientId, String code, String redirectUri) {
//        this.grantType = grantType;
//        this.clientId = clientId;
//        this.code = code;
//        this.redirectUri = redirectUri;
//
//        return this;
//    }
}
