package com.kh.finalproject.entity;

import com.kh.finalproject.common.BaseTimeEntity;
import jdk.jfr.Timestamp;
import lombok.Getter;

import javax.persistence.*;
import java.time.LocalDateTime;

@Getter
@Entity
@Table(name = "member")
public class Member extends BaseTimeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_index", nullable = false)
    private Integer id;

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
}
