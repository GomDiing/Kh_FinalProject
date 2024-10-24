package com.kh.finalproject.controller;

import com.kh.finalproject.dto.qna.CreateQnADTO;
import com.kh.finalproject.dto.qna.PagingQnaDTO;
import com.kh.finalproject.dto.qna.ResponseQnADTO;
import com.kh.finalproject.response.DefaultResponse;
import com.kh.finalproject.response.DefaultResponseMessage;
import com.kh.finalproject.response.StatusCode;
import com.kh.finalproject.service.QnAService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * Q&A 관련 요청을 처리하는 API 컨트롤러
 * 관리자의 Q&A 목록 조회, 답변 관리 및 사용자의 Q&A 조회, 작성 기능을 제공
 *
 * @author GomDiing
 */
@RequiredArgsConstructor
@RestController
@Slf4j
@RequestMapping("/api/qna")
public class QnAController {
    private final QnAService qnAService;

    /**
     * 관리자용 전체 Q&A 목록을 페이징하여 조회
     *
     * @param pageable 페이징 정보
     * @return Q&A 목록과 페이징 정보를 포함한 응답
     */
    @GetMapping("/list")
    public ResponseEntity<DefaultResponse<Object>> qnaList(Pageable pageable) {
        PagingQnaDTO qnADTOList = qnAService.searchAll(pageable);
        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_SEARCH_QNALIST, qnADTOList), HttpStatus.OK);
    }

    /**
     * 관리자가 Q&A에 대한 답변을 등록
     *
     * @param responseQnADTO 답변 내용 담은 DTO
     * @return 답변 등록 성공 메시지
     */
    @PostMapping("/reply")
    public ResponseEntity<DefaultResponse<Object>> qnaReply(@Validated @RequestBody ResponseQnADTO responseQnADTO) {
        qnAService.response(responseQnADTO);
        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_REPLY_QNA), HttpStatus.OK);
    }

    /**
     * 마이 페이지 문의 조회
     * 특정 회원의 Q&A 목록을 페이징하여 조회
     *
     * @param index    회원 식별자
     * @param pageable 페이징 정보
     * @return 해당 회원 QnA 목록과 페이징 정보 포함한 응답 데이터, 조회 성공 메시지
     */
    @GetMapping("/mypage/{index}")
    public ResponseEntity<Object> qnaMypageList(@PathVariable Long index, Pageable pageable) {
        PagingQnaDTO searchQnaList = qnAService.searchByMember(index, pageable);
        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_SEARCH_QNALIST, searchQnaList), HttpStatus.OK);
    }

    /**
     * 새로운 QnA 등록
     *
     * @param createQnADTO QnA 등록에 필요한 정보 DTO
     * @return 등록 결과 메시지
     */
    @PostMapping("/write")
    public ResponseEntity<DefaultResponse<Object>> writeQna(@Validated @RequestBody CreateQnADTO createQnADTO) {
        qnAService.create(createQnADTO);
        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_SEND_QNA), HttpStatus.OK);
    }
}
