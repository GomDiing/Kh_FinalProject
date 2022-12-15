package com.kh.finalproject.controller;

import com.kh.finalproject.dto.qna.PagingQnaDTO;
import com.kh.finalproject.dto.qna.QnADTO;
import com.kh.finalproject.dto.qna.ResponseQnADTO;
import com.kh.finalproject.entity.Member;
import com.kh.finalproject.response.DefaultResponse;
import com.kh.finalproject.response.DefaultResponseMessage;
import com.kh.finalproject.response.StatusCode;
import com.kh.finalproject.service.QnAService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@Slf4j
@CrossOrigin(origins = "http://localhost:3000")
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

    /*qna 조회(마이페이지)*/
    @GetMapping("/qna/mypage")
        public ResponseEntity<Object>qnaMypageList(Member member, Pageable pageable){
            PagingQnaDTO searchQnaList = qnAService.searchByMember(member,pageable);
            return new ResponseEntity<>(searchQnaList, HttpStatus.OK);
        }
}
