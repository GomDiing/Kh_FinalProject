package com.kh.finalproject.dto.member;

import com.kh.finalproject.entity.Address;
import com.kh.finalproject.entity.Member;
import lombok.Getter;

/**
 * 회원 정보 수정 DTO
 */
@Getter
public class EditMemberInfoDTO {

    private Long index;
    private String id;
    private String password;
    private String name;
    private String email;
    private String road;
    private String jibun;
    private String detail;
    private String zipcode;

    public EditMemberInfoDTO toDTO(Member member, Address address) {
        this.index = member.getIndex();
        this.id = member.getId();
        this.password = member.getPassword();
        this.name = member.getName();
        this.email = member.getEmail();
        this.road = address.getRoad();
        this.jibun = address.getJibun();
        this.detail = address.getDetail();
        this.zipcode = address.getZipcode();

        return this;
    }
}
