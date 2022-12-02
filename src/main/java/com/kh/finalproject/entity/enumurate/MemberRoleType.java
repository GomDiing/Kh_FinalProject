package com.kh.finalproject.entity.enumurate;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 회원 엔티티의 권한 클래스
 */
@Getter
@AllArgsConstructor
public enum MemberRoleType {
    ROLE_USER("USER", "일반 사용자 권한"),
    ROLE_ADMIN("ADMIN", "관리자 권한");

    private final String role;
    private final String description;
}
