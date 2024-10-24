package com.kh.finalproject.controller;

import com.kh.finalproject.dto.reviewLike.AddReviewLikeDTO;
import com.kh.finalproject.response.DefaultResponse;
import com.kh.finalproject.response.DefaultResponseMessage;
import com.kh.finalproject.response.StatusCode;
import com.kh.finalproject.service.ReviewLikeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 리뷰 좋아요 기능을 처리하는 API 컨트롤러
 * 리뷰에 대한 사용자의 좋아요 추가 기능 제공
 *
 * @author GomDiing
 */
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/review-like")
@Slf4j
public class ReviewLikeController {

    private final ReviewLikeService reviewLikeService;

    /**
     * 특정 리뷰에 좋아요 추가
     *
     * @param addReviewLikeDTO 좋아요 추가 정보를 담은 DTO
     * @return 좋아요 추가 처리 결과
     */
    @PostMapping("/add")
    public ResponseEntity<DefaultResponse<Object>> addReviewLike(@Validated @RequestBody AddReviewLikeDTO addReviewLikeDTO){

        reviewLikeService.addLike(addReviewLikeDTO);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_ADD_REVIEW_LIKE), HttpStatus.OK);
    }
}
