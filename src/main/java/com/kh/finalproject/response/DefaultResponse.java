package com.kh.finalproject.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 공통 응답 페이지
 */
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DefaultResponse<T> {

    private int statusCode;
    private String message;
    private T results;

    @Builder
    public DefaultResponse(final int statusCode, String message, final T results) {
        this.statusCode = statusCode;
        this.message = message;
        this.results = results;
    }

    /**
     * results(제네릭)을 포함한 응답 페이지
     */
    public static<T> DefaultResponse<T> res(final int statusCode, final String message, final T t) {
        return DefaultResponse.<T>builder()
                .results(t)
                .statusCode(statusCode)
                .message(message)
                .build();
    }

    /**
     * 상태코드와 메세지만으로 구성된 응답 페이지
     */
    public static<T> DefaultResponse<T> res(final int statusCode, final String message) {
        return DefaultResponse.<T>builder()
                .statusCode(statusCode)
                .message(message)
                .build();
    }
}
