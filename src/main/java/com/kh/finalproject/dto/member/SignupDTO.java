package com.kh.finalproject.dto.member;

<<<<<<< HEAD
import lombok.Getter;

=======
import com.fasterxml.jackson.annotation.JsonProperty;
import com.kh.finalproject.entity.Member;
import com.kh.finalproject.entity.enumurate.MemberRoleType;
import com.kh.finalproject.entity.enumurate.MemberStatus;
import lombok.Getter;

import javax.persistence.Column;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.validation.constraints.NotNull;

>>>>>>> develop
/**
 * 회원가입 DTO
 */
@Getter
public class SignupDTO {
    @NotNull(message = "아이디는 필수 입력값입니다")
    @JsonProperty("memberId")
    private String id;

    @NotNull(message = "이름은 필수 입력값입니다")
    private String name;

    @NotNull(message = "비밀번호는 필수 입력값입니다")
    private String password;

    @NotNull(message = "이메일은 필수 입력값입니다")
    private String email;

    @NotNull(message = "도로명 주소는 필수 입력값입니다")
    private String road;

    @NotNull(message = "지번 주소는 필수 입력값입니다")
    private String jibun;

    private String detail;

    @NotNull(message = "우편번호는 필수 입력값입니다")
    private String zipcode;
}
