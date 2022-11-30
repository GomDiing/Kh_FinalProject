package com.kh.finalproject.entity.status;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum MemberStatus {

    ACTIVE("Active", "활동 회원"),
    UNREGISTER("Unregister", "탈퇴 회원"),
    BLACKLIST("Blasklist", "블랙리스트 회원");

    private final String status;
    private final String description;
}
