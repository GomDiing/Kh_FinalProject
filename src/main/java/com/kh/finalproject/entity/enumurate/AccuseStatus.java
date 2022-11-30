package com.kh.finalproject.entity.enumurate;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 신고 엔티티의 상태 클래스
 */
@Getter
@AllArgsConstructor
public enum AccuseStatus {
    WAIT("Wait", "응답 대기"),
    COMPLETE("Complete", "처리 완료");

    private final String status;
    private final String description;
}
