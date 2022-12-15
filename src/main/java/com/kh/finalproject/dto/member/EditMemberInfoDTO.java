package com.kh.finalproject.dto.member;

import com.kh.finalproject.entity.Address;
import com.kh.finalproject.entity.Member;
import lombok.Getter;

import javax.validation.constraints.NotNull;

/**
 * 회원 정보 수정 DTO
 */
@Getter
public class EditMemberInfoDTO {

    @NotNull(message = "아이디는 필수 입력 값")
    private String id;
    @NotNull(message = "비밀번호는 필수 입력 값")
    private String password;
    @NotNull(message = "이름은 필수 입력 값")
    private String name;
    @NotNull(message = "이메일은 필수 입력 값")
    private String email;
    @NotNull(message = "도로명주소 필수 입력 값")
    private String road;
    @NotNull(message = "지번주소 필수 입력 값")
    private String jibun;
    @NotNull(message = "상세주소 필수 입력 값")
    private String detail;
    @NotNull(message = "우편번호 필수 입력 값")
    private String zipcode;
}
