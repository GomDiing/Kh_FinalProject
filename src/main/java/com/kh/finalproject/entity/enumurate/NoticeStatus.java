package com.kh.finalproject.entity.enumurate;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 공지사항 엔티티의 상태 클래스
 */
@Getter
@AllArgsConstructor
public enum NoticeStatus {

    ACTIVE("Active", "정상적으로 보여지는 상태"),
    DELETE("Delete", "해당 공지사항이 삭제된 상태");

    private final String status;
    private final String description;
}
