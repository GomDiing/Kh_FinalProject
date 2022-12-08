package com.kh.finalproject.dto.member;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.kh.finalproject.entity.Address;
import com.kh.finalproject.entity.Member;
import com.kh.finalproject.entity.enumurate.MemberStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * 회원 DTO
 */
@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL) // 이거 쓰면 toDTO로 만든 컬럼명만 나옴
public class MemberDTO {
    private Long index;
    private String id;
    private String name;
//    private String password;
    private String email;
    private Address address;
    private String memberRoleType;
    private MemberStatus memberStatus;
    private LocalDateTime unregister;

// 조회 프론트에 뿌려주는거니까 toDTO로
    public MemberDTO toDTO (Member member) {
        this.index = member.getIndex(); //dto에 인덱스 안쓰고 싶은데 화면에 보여주려면.. 어쩔수 없나?
        this.id = member.getId();
        this.name = member.getName();
        this.email=member.getEmail();
        this.address=member.getAddress();
        this.memberStatus=member.getStatus();
//        String createTime = member.getCreate_time().format(DateTimeFormatter.ofPattern("yyyy.MM.dd"));
        return this;
    }
}


