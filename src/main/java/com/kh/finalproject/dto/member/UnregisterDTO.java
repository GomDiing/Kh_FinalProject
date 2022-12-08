package com.kh.finalproject.dto.member;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.kh.finalproject.entity.Address;
import com.kh.finalproject.entity.enumurate.MemberStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/**
 * 회원 탈퇴 DTO
 */
@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UnregisterDTO {
    private String id;
    private String name;
    private String password;
    private String email;
    private Address address;
    private String memberRoleType;
    private MemberStatus memberStatus;
    private LocalDateTime unregister;
}
