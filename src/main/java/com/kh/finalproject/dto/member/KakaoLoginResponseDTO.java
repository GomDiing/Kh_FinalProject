package com.kh.finalproject.dto.member;

import lombok.Getter;

@Getter
public class KakaoLoginResponseDTO {
    String email;
    String isJoin;
    String providerType;

    public KakaoLoginResponseDTO toDTO(String email, Boolean isJoin) {
        this.email = email;
        if (isJoin) this.isJoin = "true";
        else this.isJoin = "false";
        this.providerType = "kakao";

        return this;
    }
}
