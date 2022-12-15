package com.kh.finalproject.controller;

import com.kh.finalproject.dto.qna.QnADTO;
import com.kh.finalproject.dto.qna.ResponseQnADTO;
import com.kh.finalproject.response.DefaultResponse;
import com.kh.finalproject.response.DefaultResponseMessage;
import com.kh.finalproject.response.StatusCode;
import com.kh.finalproject.service.QnAService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RequiredArgsConstructor
@RestController
public class QnAController {
    private final QnAService qnAService;

    //    qna 조회
    @GetMapping("/qna/list")
    public ResponseEntity<DefaultResponse<Object>> qnaList() {
        List<QnADTO> qnADTOList = qnAService.searchAll();
        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_SEARCH_QNALIST, qnADTOList), HttpStatus.OK);
    }

    //    qna 답장하기(관리자)
    @PostMapping("/qna/reply")
    public ResponseEntity<DefaultResponse<Object>> qnaReply(@RequestBody ResponseQnADTO responseQnADTO) {
        qnAService.response(responseQnADTO);
        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_REPLY_QNA), HttpStatus.BAD_REQUEST);
    }
}
