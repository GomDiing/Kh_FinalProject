package com.kh.finalproject.entity.enumurate;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 회원 엔티티의 상태 클래스
 */
@Getter
@AllArgsConstructor
public enum MemberStatus {

    ACTIVE("Active", "활동 회원"),
    UNREGISTER("Unregister", "탈퇴 회원"),
    BLACKLIST("Blasklist", "블랙리스트 회원");

    private final String status;
    private final String description;
}
