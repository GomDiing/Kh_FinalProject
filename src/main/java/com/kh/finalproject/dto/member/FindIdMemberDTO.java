package com.kh.finalproject.dto.member;

import com.kh.finalproject.entity.Member;
import lombok.Getter;

import javax.validation.constraints.NotNull;

@Getter
public class FindIdMemberDTO {

    private String id;
    @NotNull(message = "이름은 필수 입력 값")
    private String name;
    @NotNull(message = "이메일은 필수 입력 값")
    private String email;

    public FindIdMemberDTO toDTO(Member member) {
        this.id = member.getId();
        this.name = member.getName();
        this.email = member.getEmail();

        return this;
    }
}
