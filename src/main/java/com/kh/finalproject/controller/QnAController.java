package com.kh.finalproject.controller;

import com.kh.finalproject.dto.qna.QnADTO;
import com.kh.finalproject.dto.qna.ResponseQnADTO;
import com.kh.finalproject.service.QnAService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RequiredArgsConstructor
@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class QnAController {
    private final QnAService qnAService;
//    qna 조회
    @GetMapping("/qna/list")
    public ResponseEntity qnaList() {
        List<QnADTO> qnADTOList = qnAService.searchAll();
        return new ResponseEntity<>(qnADTOList, HttpStatus.OK);
    }
//    qna 답장하기(관리자)
    @PostMapping("/qna/reply")
    public ResponseEntity qnaReply (@RequestBody ResponseQnADTO responseQnADTO, Long index){
        Boolean isTrue = qnAService.response(responseQnADTO, index);
        if(isTrue){
            return new ResponseEntity<>(true,HttpStatus.OK);
        } else{
            return new ResponseEntity<>(false,HttpStatus.BAD_REQUEST);
        }
    }
}
