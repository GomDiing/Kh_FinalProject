package com.kh.finalproject.dto.member;

import lombok.Getter;

@Getter
public class KakaoLoginResponseDTO {
    String email;
    String nickname;

    public KakaoLoginResponseDTO toDTO(String email, String nickname) {
        this.email = email;
        this.nickname = nickname;

        return this;
    }
}
