package com.kh.finalproject.dto.member;

import lombok.Getter;

import javax.validation.constraints.NotNull;

@Getter
public class DeleteMemberDTO {

    @NotNull(message = "아이디는 필수 입력 값")
    private String id;
    @NotNull(message = "비밀번호는 필수 입력 값")
    private String password;
}
