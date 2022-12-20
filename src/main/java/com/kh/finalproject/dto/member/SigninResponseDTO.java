package com.kh.finalproject.dto.member;

import com.kh.finalproject.entity.Member;
import lombok.Getter;

import javax.persistence.Column;

@Getter
public class SigninResponseDTO {
    private String id;
    private String name;
    private String road;
    private String jibun;
    private String detail;
    private String zipcode;
    private Integer point;


    public SigninResponseDTO toDTO(Member member) {
        this.id = member.getId();
        this.name = member.getName();
        this.point = member.getPoint();
        this.road = member.getAddress().getRoad();
        this.jibun = member.getAddress().getJibun();
        this.detail = member.getAddress().getDetail();
        this.zipcode = member.getAddress().getZipcode();

        return this;
    }
}
