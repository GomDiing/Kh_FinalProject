package com.kh.finalproject.social.kakao.pay.approve;

import lombok.Getter;

import javax.validation.constraints.NotNull;

/**
 * 카카오Pay Approve DTO
 * 프론트에서 전달한 예매 정보
 */

@Getter
public class KakaoPayApproveRequestDTO {
    @NotNull(message = "pg_token은 필수 입력 값")
    private String pg_token;

    @NotNull(message = "tid는 필수 입력 값")
    private String tid;

    public KakaoPayApproveRequestDTO toDto(String pg_token, String tid) {
        this.pg_token = pg_token;
        this.tid = tid;

        return this;
    }
}
