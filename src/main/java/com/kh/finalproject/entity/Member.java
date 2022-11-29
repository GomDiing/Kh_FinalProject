package com.kh.finalproject.entity;

import com.kh.finalproject.common.BaseTimeEntity;
import jdk.jfr.Timestamp;
import lombok.Getter;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Entity
@Table(name = "member")
public class Member extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_index")
    private Long index;

    @Column(name = "member_id", nullable = false)
    private String id;

    @Column(name = "member_name", nullable = false)
    private String name;

    @Column(name = "member_pwd")
    private String password;

    @Column(name = "member_email", nullable = false)
    private String email;

    @Column(name = "member_role", nullable = false)
    @Enumerated(EnumType.STRING)
    private MemberRoleType role;

    @Column(name = "member_point", nullable = false)
    private Integer point;

    @Column(name = "member_status", nullable = false)
    @Enumerated(EnumType.STRING)
    private MemberStatus status;

    @Column(name = "member_reason")
    private String reason;

    @Column(name = "unregister_time")
    @Timestamp
    private LocalDateTime unregister;

    @OneToOne(mappedBy = "member")
    private Address address;

    @OneToMany(mappedBy = "member")
    private List<Inquiry> inquiryList = new ArrayList<>();

    @OneToMany(mappedBy = "member")
    private List<ReviewLike> reviewLikeList = new ArrayList<>();

    @OneToMany(mappedBy = "memberSuspect")
    private List<Accuse> accuseListSuspectList = new ArrayList<>();

    @OneToMany(mappedBy = "memberVictim")
    private List<Accuse> accuseListVictimList = new ArrayList<>();

    @OneToMany(mappedBy = "member")
    private List<ReviewComment> reviewCommentList = new ArrayList<>();

    @OneToMany(mappedBy = "member")
    private List<MemberReserve> memberReserveList = new ArrayList<>();
}
