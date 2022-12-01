package com.kh.finalproject.exception;

import lombok.Getter;

/**
 * 사용자 정의 예외 처리 클래스
 */
@Getter
public class CustomException extends RuntimeException {

    private CustomErrorCode customErrorCode;

    public CustomException(String message, CustomErrorCode customErrorCode) {
        super(message);
        this.customErrorCode = customErrorCode;
    }

    public CustomException(CustomErrorCode customErrorCode) {
        super(customErrorCode.getMessage());
        this.customErrorCode = customErrorCode;
    }
}
