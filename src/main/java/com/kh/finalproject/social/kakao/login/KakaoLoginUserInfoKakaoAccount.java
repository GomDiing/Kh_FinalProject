package com.kh.finalproject.social.kakao.login;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

@Getter
public class KakaoLoginUserInfoKakaoAccount {
    private Boolean profile_nickname_needs_agreement;
    private Boolean profile_image_needs_agreement;
    private Boolean has_email;
    private Boolean email_needs_agreement;
    private Boolean is_email_valid;
    private Boolean is_email_verified;
    private String email;
    @JsonProperty("profile")
    private KakaoLoginUserInfoKakaoAccountProfile account_profile;
}
