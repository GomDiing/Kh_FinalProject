package com.kh.finalproject.dto.member;

import com.kh.finalproject.entity.enumurate.MemberProviderType;
import lombok.Getter;

import javax.validation.constraints.NotNull;

@Getter
public class SigninRequestDTO {
    private String id;
    private String password;
    private String email;
    @NotNull(message = "providerType은 필수입니다")
    private MemberProviderType providerType;
}
