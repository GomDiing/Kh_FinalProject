package com.kh.finalproject.social.kakao.login;

import lombok.Getter;

@Getter
public class KakaoLoginUserInfoKakaoAccountProfile {
    private String nickname;
    private String thumbnail_image_url;
    private String profile_image_url;
    private Boolean default_image;
    private Boolean is_default_image;
    private Boolean is_default_nickname;
}
