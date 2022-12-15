package com.kh.finalproject.dto.member;

import com.kh.finalproject.entity.Member;
import lombok.Getter;

import javax.validation.constraints.NotNull;

@Getter
public class FindPwdMemberDTO {

    @NotNull(message = "아이디는 필수 입력 값")
    private String id;

    private String password;
    @NotNull(message = "이름은 필수 입력 값")
    private String name;
    @NotNull(message = "이메일은 필수 입력 값")
    private String email;

    public FindPwdMemberDTO toDTO(Member member) {
        this.id = member.getId();
        this.password = member.getPassword();
        this.name = member.getName();
        this.email = member.getEmail();

        return this;
    }
}
