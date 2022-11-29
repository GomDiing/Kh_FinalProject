package com.kh.finalproject.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum AccuseStatus {
    WAIT("Wait", "응답 대기"),
    COMPLETE("Complete", "처리 완료");

    private final String status;
    private final String description;
}
