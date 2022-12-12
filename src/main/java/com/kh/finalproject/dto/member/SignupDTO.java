package com.kh.finalproject.dto.member;

import com.kh.finalproject.entity.Address;
import com.kh.finalproject.entity.Member;
import lombok.Getter;

import javax.validation.constraints.NotNull;

/**
 * 회원가입 DTO
 */
@Getter
public class SignupDTO {

    private String id;
    private String password;
    private String name;
    private String email;
    private String road;
    private String jibun;
    private String detail;
    private String zipcode;

    // 이메일을 입력 받으면 그에 맞은 회원 조회
    public SignupDTO toDTO(Member member, Address address) {
        this.id = member.getId();
        this.password = member.getPassword();
        this.email = member.getEmail();
        this.name = member.getName();
        this.jibun = address.getJibun();
        this.detail = address.getDetail();
        this.road = address.getRoad();
        this.zipcode = address.getZipcode();

        return this;
    }
}
