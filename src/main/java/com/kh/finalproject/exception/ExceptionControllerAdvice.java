package com.kh.finalproject.exception;

import com.kh.finalproject.response.DefaultErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.nio.file.AccessDeniedException;

/**
 * 예외 처리 컨트롤러
 */
@Slf4j
@RestControllerAdvice
public class ExceptionControllerAdvice {
    /**
     * @Valid 혹은 @Validated로 binding error 발생시
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<DefaultErrorResponse> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        log.error("[handleMethodArgumentNotValidException] ex", e);
        DefaultErrorResponse defaultErrorResponse = DefaultErrorResponse.of(CustomErrorCode.INVALID_TYPE_VALUE, e.getBindingResult());

        return new ResponseEntity<>(defaultErrorResponse, HttpStatus.BAD_REQUEST);
//        return new ResponseEntity<>(DefaultErrorResponse, HttpStatus.OK);
    }

    /**
     * @ModelAttribute로 binding error 발생시
     */
    @ExceptionHandler(BindException.class)
    public ResponseEntity<DefaultErrorResponse> handleBindException(BindException e) {
        log.error("[handleBindException] ex", e);
        DefaultErrorResponse defaultErrorResponse = DefaultErrorResponse.of(CustomErrorCode.INVALID_TYPE_VALUE, e.getBindingResult());

        return new ResponseEntity<>(defaultErrorResponse, HttpStatus.BAD_REQUEST);
//        return new ResponseEntity<>(DefaultErrorResponse, HttpStatus.OK);

    }

    /**
     * enum type 일치하지 않아 binding 못할 경우 발생
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<DefaultErrorResponse> handleMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException e) {
        log.error("[handleMethodArgumentTypeMismatchException] ex", e);
        DefaultErrorResponse defaultErrorResponse = DefaultErrorResponse.of(e);

        return new ResponseEntity<>(defaultErrorResponse, HttpStatus.BAD_REQUEST);
//        return new ResponseEntity<>(DefaultErrorResponse, HttpStatus.OK);
    }

    /**
     * 지원하지 않은 HTTP method 호출 할 경우 발생
     */
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<DefaultErrorResponse> handleHttpRequestMethodNotSupportedException(HttpRequestMethodNotSupportedException e) {
        log.error("[handleHttpRequestMethodNotSupportedException] ex", e);
        DefaultErrorResponse defaultErrorResponse = DefaultErrorResponse.of(CustomErrorCode.METHOD_NOT_ALLOWED);

        return new ResponseEntity<>(defaultErrorResponse, HttpStatus.METHOD_NOT_ALLOWED);
//        return new ResponseEntity<>(DefaultErrorResponse, HttpStatus.OK);
    }

    /**
     * Authentication 객체가 필요한 권한을 보유하지 않은 경우 발생함
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<DefaultErrorResponse> handleAccessDeniedException(AccessDeniedException e) {
        log.error("[handleAccessDeniedException] ex", e);
        DefaultErrorResponse defaultErrorResponse = DefaultErrorResponse.of(CustomErrorCode.HANDLE_ACCESS_DENIED);

        return new ResponseEntity<>(defaultErrorResponse, HttpStatus.valueOf(CustomErrorCode.HANDLE_ACCESS_DENIED.getStatus()));
//        return new ResponseEntity<>(DefaultErrorResponse, HttpStatus.OK);
    }

    /**
     * 사용자 정의 예외 처리
     */
    @ExceptionHandler(CustomException.class)
    public ResponseEntity<DefaultErrorResponse> handleCustomException(final CustomException e) {
        log.error("[handleCustomException] ex", e);
        CustomErrorCode customErrorCode = e.getCustomErrorCode();
        DefaultErrorResponse defaultErrorResponse = DefaultErrorResponse.of(customErrorCode);

        return new ResponseEntity<>(defaultErrorResponse, HttpStatus.valueOf(customErrorCode.getStatus()));
//        return new ResponseEntity<>(DefaultErrorResponse, HttpStatus.OK);
    }

    /**
     * 그 외 모든 에러 처리
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<DefaultErrorResponse> handleException(Exception e) {
        log.error("[handleException] ex", e);
        DefaultErrorResponse defaultErrorResponse = DefaultErrorResponse.of(CustomErrorCode.INTERNAL_SERVER_ERROR);

        return new ResponseEntity<>(defaultErrorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
//        return new ResponseEntity<>(DefaultErrorResponse, HttpStatus.OK);
    }
}
