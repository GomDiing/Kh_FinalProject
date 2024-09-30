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

@RequiredArgsConstructor
@RestController
@Slf4j
@RequestMapping("/api/qna")
//@CrossOrigin(origins = "http://localhost:3000")
//@CrossOrigin(origins = "*", allowedHeaders = "*")
public class QnAController {
    private final QnAService qnAService;

    //    qna 조회(관리자페이지)
    @GetMapping("/list")
    public ResponseEntity<DefaultResponse<Object>> qnaList(Pageable pageable) {
        PagingQnaDTO qnADTOList = qnAService.searchAll(pageable);
        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_SEARCH_QNALIST, qnADTOList), HttpStatus.OK);
    }

    //    qna 답장하기(관리자)
    @PostMapping("/reply")
    public ResponseEntity<DefaultResponse<Object>> qnaReply(@Validated @RequestBody ResponseQnADTO responseQnADTO) {
        qnAService.response(responseQnADTO);
        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_REPLY_QNA), HttpStatus.OK);
    }

    /*qna 조회(마이페이지)*/
    @GetMapping("/mypage/{index}")
        public ResponseEntity<Object>qnaMypageList(@PathVariable Long index, Pageable pageable){
            PagingQnaDTO searchQnaList = qnAService.searchByMember(index,pageable);
        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_SEARCH_QNALIST, searchQnaList), HttpStatus.OK);
        }

        /*qna 작성하기*/
    @PostMapping("/write")
    public ResponseEntity<DefaultResponse<Object>> writeQna(@Validated @RequestBody CreateQnADTO createQnADTO){
        qnAService.create(createQnADTO);
        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_SEND_QNA), HttpStatus.OK);
    }
}
