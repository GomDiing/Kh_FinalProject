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
    @NotNull(message = "아이디는 필수 입력 값")
    private String id;
//    @NotNull(message = "비밀번호는 필수 입력 값")
//    소셜 로그인때문에 제외
    private String password;
//    @NotNull(message =  "이름은 필수 입력 값")
    private String name;
    @NotNull(message =  "이메일 필수 입력 값")
    private String email;
    @NotNull(message =  "도로명주소 필수 입력 값")
    private String road;
    @NotNull(message =  "지번주소 필수 입력 값")
    private String jibun;
    @NotNull(message =  "상세주소 필수 입력 값")
    private String detail;
    @NotNull(message =  "우편번호 필수 입력 값")
    private String zipcode;
    @NotNull(message = "서비스 제공자는 필수값")
    private String providerType;

    // 아이디를 입력 받으면 그에 맞는 회원 조회
    public SignupDTO toDTO(Member member, Address address) {
        this.id = member.getId();
        this.password = member.getPassword();
        this.email = member.getEmail();
        this.name = member.getName();
        this.providerType = member.getProviderType().name();
        this.jibun = address.getJibun();
        this.detail = address.getDetail();
        this.road = address.getRoad();
        this.zipcode = address.getZipcode();

        return this;
    }

    public void updateName(String randomName) {
        this.name = randomName;
    }
}
