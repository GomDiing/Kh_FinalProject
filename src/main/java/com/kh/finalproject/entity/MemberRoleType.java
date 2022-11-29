package com.kh.finalproject.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum MemberRoleType {
    USER("ROLE_USER", "일반 사용자 권한"),
    ADMIN("ROLE_ADMIN", "관리자 권한");

    private final String role;
    private final String description;
}
