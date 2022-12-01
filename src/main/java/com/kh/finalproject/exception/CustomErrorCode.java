package com.kh.finalproject.exception;

import com.kh.finalproject.response.StatusCode;
import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * 사용자 정의 예외 처리 상수 클래스
 */
@Getter
@AllArgsConstructor
public enum CustomErrorCode {
    DUPLI_MEMBER_ID(StatusCode.BAD_REQUEST, "J001", "이미 가입된 ID가 있습니다"),
    EMPTY_MEMBER(StatusCode.BAD_REQUEST, "J002", "일치한 회원이 없습니다"),
    NOT_MATCH_PASSWORD_ID(StatusCode.BAD_REQUEST, "J003", "이메일 혹은 아이디가 일치하지 않습니다"),
    NOT_MATCH_ID(StatusCode.BAD_REQUEST, "J004", "비밀번호가 일치하지 않습니다"),
    DUPLI_EMAIL(StatusCode.BAD_REQUEST, "J005", "이미 가입된 이메일이 있습니다"),
    NOT_MATCH_EMAIL_NAME(StatusCode.BAD_REQUEST, "J006", "이메일 혹은 이름이 올바르지 않습니다"),
    NOT_SEARCH_DATA(StatusCode.BAD_REQUEST, "J007", "검색한 결과가 없습니다"),
    NOT_MOVIE_DATA(StatusCode.BAD_REQUEST, "J008", "조회한 결과가 없습니다"),
    INVALID_TYPE_VALUE(StatusCode.BAD_REQUEST, "C001", "입력 타입이 올바르지 않습니다"),
    INVALID_INPUT_VALUE(StatusCode.BAD_REQUEST, "C002", "입력 값이 올바르지 않습니다"),
    METHOD_NOT_ALLOWED(StatusCode.METHOD_NOT_ALLOWED, "C003", "지원하지않은 Http Method입니다"),
    HANDLE_ACCESS_DENIED(StatusCode.FORBIDDEN, "C004", "접근이 거부되었습니다"),
    INTERNAL_SERVER_ERROR(StatusCode.INTERNAL_SERVER_ERROR, "S001", "내부 서버 오류입니다");

    private int status;
    private final String code;
    private final String message;
}
