package com.kh.finalproject.dto.member;

import com.kh.finalproject.entity.Address;
import com.kh.finalproject.entity.Member;
import lombok.Getter;
import lombok.Setter;
import java.time.format.DateTimeFormatter;
import java.util.Objects;

/**
 * 회원 DTO
 */
@Getter
@Setter
//@JsonInclude(JsonInclude.Include.NON_NULL) // 이거 쓰면 toDTO로 만든 컬럼명만 나옴
public class MemberDTO {
    private Long index;
    private String id;
    private String name;
    private String pwd;
    private Integer point;
    private String email;
    private String road;
    private String jibun;
    private String detail;
    private String memberRoleType;
    private String memberStatus;
    private String createTime;
    private String unregisterTime;
    private Integer memberAccuseCount;
    private String zipcode;
    private Integer MemberAccuseCount;

    /**
     * 전체 일반 회원 조회 Entity -> DTO
     * 조회 프론트에 뿌려주는거니까 toDTO로
     */
    public MemberDTO toDTO(Member member, Address address) {
        this.index = member.getIndex();
        this.id = member.getId();
        this.name = member.getName();
        this.pwd = member.getPassword();
        this.point = member.getPoint();
        this.email=member.getEmail();
        if (Objects.isNull(address.getRoad())) {
            this.road = "null";
        }
        else this.road = address.getRoad();

        if (Objects.isNull(address.getRoad())) {
            this.jibun = "null";
        }
        else this.jibun = address.getJibun();

        if (Objects.isNull(address.getDetail())){
            this.detail = "null";
        }
        else this.detail = address.getDetail();
        if (Objects.isNull(address.getZipcode())){
            this.zipcode = "null";
        }
        else this.zipcode = address.getZipcode();
        this.memberRoleType = member.getRole().getRole();
        this.memberStatus = member.getStatus().getStatus();
        this.createTime=member.getCreateTime().format(DateTimeFormatter.ofPattern("yyyy.MM.dd"));
        if (Objects.isNull(member.getUnregister())){
            this.unregisterTime = "null";
        }
        else this.unregisterTime = member.getUnregister().format(DateTimeFormatter.ofPattern("yyyy.MM.dd"));
        this.memberAccuseCount = member.getAccuseCount();

        return this;
    }
    public MemberDTO toDTOByCount(Member member){
        this.index = member.getIndex();
        this.memberStatus = member.getStatus().getStatus();
        this.memberAccuseCount = member.getAccuseCount();
        return this;

    }
}