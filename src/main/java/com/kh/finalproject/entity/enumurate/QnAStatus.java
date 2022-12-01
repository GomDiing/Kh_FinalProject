package com.kh.finalproject.entity.enumurate;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 1대1 문의 엔티티의 상태 클래스
 */
@Getter
@AllArgsConstructor
public enum QnAStatus {
    WAIT("Wait", "질문 대기"),
    CANCEL("Cancel", "문의 취소"),
    ADDITIONAL("Additional", "부가 문의"),
    COMPLETE("Complete", "응답 완료");

    private final String status;
    private final String description;
}
