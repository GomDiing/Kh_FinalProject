package com.kh.finalproject.dto.member;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.kh.finalproject.entity.Member;
import com.kh.finalproject.entity.enumurate.MemberStatus;
import lombok.Getter;

import javax.persistence.Column;

@Getter
public class SigninResponseDTO {
    private Long index;
    private String id;
    private String name;
    private String road;
    private String jibun;
    private String detail;
    private String zipcode;
    private Integer point;
    private String status;
    private String email;

    @JsonProperty("provider_type")
    private String providerType;


    public SigninResponseDTO toDTO(Member member) {
        this.index = member.getIndex();
        this.id = member.getId();
        this.name = member.getName();
        this.point = member.getPoint();
        this.road = member.getAddress().getRoad();
        this.jibun = member.getAddress().getJibun();
        this.detail = member.getAddress().getDetail();
        this.zipcode = member.getAddress().getZipcode();
        this.status = member.getStatus().name();
        this.providerType = member.getProviderType().name();
        this.email = member.getEmail();

        return this;
    }
}
