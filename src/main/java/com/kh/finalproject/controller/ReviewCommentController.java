package com.kh.finalproject.controller;

import com.kh.finalproject.dto.reviewComment.CreateReviewCommentDTO;
import com.kh.finalproject.dto.reviewComment.RemoveReviewCommentDTO;
import com.kh.finalproject.dto.reviewComment.ReviewCommentDTO;
import com.kh.finalproject.dto.reviewComment.UpdateReviewCommentDTO;
import com.kh.finalproject.response.DefaultResponse;
import com.kh.finalproject.response.DefaultResponseMessage;
import com.kh.finalproject.response.StatusCode;
import com.kh.finalproject.service.ReviewCommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@Slf4j
@CrossOrigin(origins = "http://localhost:3000")
public class ReviewCommentController {
    private final ReviewCommentService reviewCommentService;

    /*관리자 dashboard, 메인페이지 최근 후기 조회*/
    @GetMapping("/dashboard/review")
    public ResponseEntity<Object> recentReview(@PageableDefault(size = 4) Pageable size){
        List<ReviewCommentDTO> reviewCommentDTOList = reviewCommentService.searchAll(size);
        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_RECEIVE_QNA, reviewCommentDTOList), HttpStatus.OK);
    }

    /*공연 후기 작성 */
    @PostMapping("/review/write")
    public ResponseEntity<Object> writeReview(@RequestBody CreateReviewCommentDTO createReviewCommentDTO){
        reviewCommentService.create(createReviewCommentDTO);
        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_ADD_REVIEW), HttpStatus.OK);
    }

    /*공연 후기 대댓글 작성*/
    @PostMapping("/review/add")
    public ResponseEntity<Object> addReview(@RequestBody CreateReviewCommentDTO createReviewCommentDTO){
        reviewCommentService.reCreate(createReviewCommentDTO);
        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK,DefaultResponseMessage.SUCCESS_ADD_REVIEW), HttpStatus.OK);
    }

    /*공연 후기 댓글 수정*/
    @PostMapping("/review/update")
    public ResponseEntity<Object> updateReview(@RequestBody UpdateReviewCommentDTO updateReviewCommentDTO){
        reviewCommentService.update(updateReviewCommentDTO);
        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_UPDATE_REVIEW), HttpStatus.OK);
    }

    /*공연 후기 댓글 삭제*/
    @PostMapping("/review/delete")
    public ResponseEntity<Object> deleteReview(@RequestBody RemoveReviewCommentDTO removeReviewCommentDTO){
        reviewCommentService.remove(removeReviewCommentDTO);
        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_DELETE_REVIEW), HttpStatus.OK);

    }
}
