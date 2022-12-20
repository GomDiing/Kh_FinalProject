package com.kh.finalproject.dto.member;

import com.kh.finalproject.entity.enumurate.MemberProviderType;
import lombok.Getter;

import javax.validation.constraints.NotNull;

@Getter
public class DeleteMemberDTO {

    @NotNull(message = "아이디는 필수 입력 값")
    private String id;
    @NotNull(message = "비밀번호는 필수 입력 값")
    private String password;
    @NotNull(message = "회원 주체는 필수 입력 값")
    private MemberProviderType providerType;
}
