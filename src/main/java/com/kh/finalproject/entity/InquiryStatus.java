package com.kh.finalproject.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum InquiryStatus {
    WAIT("Wait", "질문 대기"),
    COMPLETE("Complete", "응답 완료");

    private final String status;
    private final String description;
}
