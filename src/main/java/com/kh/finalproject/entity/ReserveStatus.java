package com.kh.finalproject.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ReserveStatus {
    PAYMENT("Payment", "결제 상태"),
    REFUND("Refund", "환불 상태"),
    CANCEL("Cancel", "취소 상태");

    private final String status;
    private final String description;
}
