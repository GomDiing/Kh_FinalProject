package com.kh.finalproject.controller;

import com.kh.finalproject.dto.reviewComment.*;
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
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;


/**
 * 공연 후기 및 댓글 관리를 위한 API 컨트롤러
 * 후기 작성, 수정, 삭제 및 조회 기능을 제공
 * 대시보드용 최근 후기 조회 기능 포함
 *
 * @author GomDiing
 */
@RequiredArgsConstructor
@RestController
@Slf4j
@RequestMapping("/api/review")
public class ReviewCommentController {
    private final ReviewCommentService reviewCommentService;

    /**
     * 최근 후기 4개를 조회 (대시보드, 메인페이지용)
     *
     * @param size 조회할 후기 수 (기본값 4)
     * @return 최근 등록된 후기 목록과 조회 성공 메시지
     */
    @GetMapping("/dashboard")
    public ResponseEntity<DefaultResponse<List<ReviewCommentDTO>>> recentReview(@PageableDefault(size = 4) Pageable size){

        List<ReviewCommentDTO> reviewCommentDTOList = reviewCommentService.searchAll(size);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_SEARCH_REVIEW_TOP_FOUR, reviewCommentDTOList), HttpStatus.OK);
    }

    /**
     * 새로운 공연 후기 등록
     *
     * @param createReviewCommentDTO 후기 작성 정보를 담은 DTO
     * @return 후기 등록 결과와 조회 성공 메시지
     */
    @PostMapping("/write")
    public ResponseEntity<DefaultResponse<Object>> writeReview(@Validated @RequestBody CreateReviewCommentDTO createReviewCommentDTO){

        reviewCommentService.create(createReviewCommentDTO);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_CREATE_REVIEW), HttpStatus.OK);
    }

    /**
     * 기존 후기에 대한 답글 등록
     *
     * @param createReviewCommentDTO 답글 작성 정보를 담은 DTO
     * @return 답글 등록 결과와 조회 성공 메시지
     */
    @PostMapping("/add")
    public ResponseEntity<DefaultResponse<Object>> addReview(@Validated @RequestBody CreateReviewCommentDTO createReviewCommentDTO){
        reviewCommentService.reCreate(createReviewCommentDTO);
        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK,DefaultResponseMessage.SUCCESS_ADD_REVIEW), HttpStatus.OK);
    }

    /**
     * 등록된 후기 내용 수정
     *
     * @param updateReviewCommentDTO 수정할 후기 정보를 담은 DTO
     * @return 수정 처리 결과와 수정 성공 메시지
     */
    @PostMapping("/update")
    public ResponseEntity<DefaultResponse<Object>> updateReview(@Validated @RequestBody UpdateReviewCommentDTO updateReviewCommentDTO){

        reviewCommentService.update(updateReviewCommentDTO);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_UPDATE_REVIEW), HttpStatus.OK);
    }

    /**
     * 등록된 후기 삭제
     *
     * @param removeReviewCommentDTO 삭제할 후기 정보를 담은 DTO
     * @return 삭제 처리 결과와 삭제 성공 메시지
     */
    @PostMapping("/delete")
    public ResponseEntity<DefaultResponse<Object>> deleteReview(@Validated @RequestBody RemoveReviewCommentDTO removeReviewCommentDTO){

        reviewCommentService.remove(removeReviewCommentDTO);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_DELETE_REVIEW), HttpStatus.OK);

    }

    /**
     * 특정 공연의 전체 후기 목록 조회
     *
     * @param productCode 공연 코드
     * @param pageable 페이징 정보
     * @return 해당 공연의 전체 후기 목록와 조회 성공 메시지
     */
    @GetMapping("/all/{productCode}")
    public ResponseEntity<DefaultResponse<PageReviewCommentDTO>> viewAllReview(@PathVariable String productCode, Pageable pageable){

        log.info("Controller : viewAllReview, productCode = {}", productCode);

        PageReviewCommentDTO pageReviewCommentDTO = reviewCommentService.allComment(productCode, pageable);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_SEARCH_REVIEW, pageReviewCommentDTO),HttpStatus.OK);
    }
}
