package com.kh.finalproject.entity;

import com.kh.finalproject.common.BaseTimeEntity;
<<<<<<< HEAD
=======
import com.kh.finalproject.dto.member.SignupDTO;
import com.kh.finalproject.entity.enumurate.MemberRoleType;
import com.kh.finalproject.entity.enumurate.MemberStatus;
>>>>>>> develop
import lombok.Getter;

import javax.persistence.*;

/**
 * 주소 테이블과 연결된 엔티티
 * 생성/수정 시간 갱신 엔티티 클래스를 상속
 */
@Getter
@Entity
@Table(name = "address")
public class Address extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "address_index")
    private Long index;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_index", nullable = false)
    private Member member;

    @Column(name = "address_road", nullable = false)
    private String road;

    @Column(name = "address_jibun")
    private String jibun;

    @Column(name = "address_detail")
    private String detail;

    @Column(name = "address_zipcode", nullable = false)
    private String zipcode;

    /**
     * 회원가입 DTO를 회원 Entity 변환
     * SignupDTO DTO -> Address Entity
     */
    public Address toEntity(SignupDTO signupDTO, Member saveMember) {
        this.road = signupDTO.getRoad();
        this.jibun = signupDTO.getJibun();
        this.detail = signupDTO.getDetail();
        this.zipcode = signupDTO.getZipcode();

        // 연관관계 편의 메서드
        this.member = saveMember;
        saveMember.updateAddress(this);

        return this;
    }
}
