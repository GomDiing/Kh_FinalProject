package com.kh.finalproject.dto.member;

import com.kh.finalproject.entity.enumurate.MemberRoleType;
import com.kh.finalproject.entity.enumurate.MemberStatus;
import jdk.jfr.Timestamp;
import lombok.Getter;

import javax.persistence.*;
import java.time.LocalDateTime;
/**
 * 회원 DTO
 */
@Getter
public class MemberDTO {

    private Long index;

    private String id;

    private String name;

    private String password;

    private String email;

    private MemberRoleType role;

    private Integer point;

    private MemberStatus status;

    private String reason;

    private LocalDateTime unregister;
}
