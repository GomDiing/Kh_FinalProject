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
    DELETE("Delete", "탈퇴 신청 회원, 탈퇴 후 일주일이 지나지않은 상태의 회원"),
    UNREGISTER("Unregister", "완전 탈퇴 회원"),
    BLACKLIST("Blacklist", "블랙리스트 회원");

    private final String status;
    private final String description;
}
