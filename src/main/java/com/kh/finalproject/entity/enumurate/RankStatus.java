package com.kh.finalproject.entity.enumurate;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 순위 엔티티의 상태 클래스
 */
@Getter
@AllArgsConstructor
public enum RankStatus {
    READY("Ready", "크롤링 대기 중인 상태"),
    END("End", "이미 예매가 종료된 상태"),
    SCHEDULED("Scheduled", "아직 예매 대기 중인 상태"),
    COMPLETE("Complete", "정상적으로 크롤링이 만료된 상태");

    private final String status;
    private final String description;
}
