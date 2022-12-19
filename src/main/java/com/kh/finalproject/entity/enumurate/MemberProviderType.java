package com.kh.finalproject.entity.enumurate;

import lombok.AllArgsConstructor;

/**
 * 회원등록 주체 구분
 */
@AllArgsConstructor
public enum MemberProviderType {
    HOME("Home", "웹사이트 회원가입 회원"),
    GOOGLE("Google", "구글 소셜 회원가입 회원"),
    KAKAO("Kakao", "카카오 소셜 회원가입 회원");

    private final String provider;
    private final String description;
}
