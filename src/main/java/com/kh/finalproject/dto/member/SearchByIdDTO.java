package com.kh.finalproject.dto.member;

import lombok.Getter;

import javax.validation.constraints.NotNull;

@Getter
public class SearchByIdDTO {
    private String id;
    private String email;
    @NotNull(message = "가입 주체는 필수 입력값입니다")
    private String providerType;
}
