package com.kh.finalproject.dto.member;

import com.kh.finalproject.entity.Address;
import com.kh.finalproject.entity.Member;
import com.kh.finalproject.entity.enumurate.MemberRoleType;
import com.kh.finalproject.entity.enumurate.MemberStatus;
import lombok.Getter;
import lombok.Setter;

/**
 * 회원 DTO
 */
@Getter
@Setter
public class MemberDTO {
    private String id;
    private String name;
//    private String password;
    private String email;
    private Address address;
    private String memberRoleType;
    private MemberStatus memberStatus;


    public MemberDTO toDTO (Member member) {
        this.id = member.getId();

        return this;
    }
}
// 가입일은 상속받아서 안써도 된다면 enum 타입은..?


