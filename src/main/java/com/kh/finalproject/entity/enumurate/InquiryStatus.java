package com.kh.finalproject.entity.enumurate;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 1대1 문의 엔티티의 상태 클래스
 */
@Getter
@AllArgsConstructor
public enum InquiryStatus {
    WAIT("Wait", "질문 대기"),
    COMPLETE("Complete", "응답 완료");

    private final String status;
    private final String description;
}
