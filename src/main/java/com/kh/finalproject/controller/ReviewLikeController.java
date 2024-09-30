package com.kh.finalproject.controller;

import com.kh.finalproject.dto.member.CheckMemberDTO;
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
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/review-like")
@Slf4j
//@CrossOrigin(origins = "http://localhost:3000")
//@CrossOrigin(origins = "*", allowedHeaders = "*")
public class ReviewLikeController {

    private final ReviewLikeService reviewLikeService;

    /**
     * 좋아요 누르기 컨트롤러
     */
    @PostMapping("/add")
    public ResponseEntity<DefaultResponse<Object>> addReviewLike(@Validated @RequestBody AddReviewLikeDTO addReviewLikeDTO){

        reviewLikeService.addLike(addReviewLikeDTO);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_ADD_REVIEW_LIKE), HttpStatus.OK);
    }
}
