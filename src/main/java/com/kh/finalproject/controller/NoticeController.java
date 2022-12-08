package com.kh.finalproject.controller;

import com.kh.finalproject.dto.notice.CreateNoticeDTO;
import com.kh.finalproject.dto.notice.EditNoticeDTO;
import com.kh.finalproject.dto.notice.NoticeDTO;
import com.kh.finalproject.service.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RequiredArgsConstructor
@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/notice")
public class NoticeController {

    private final NoticeService noticeService;

//   공지사항 조회
    @GetMapping("/list")
    public ResponseEntity <List<NoticeDTO>> noticeList(){
//       공지 서비스 호출해서 list로 반환
        List<NoticeDTO> List = noticeService.selectAll();
        return new ResponseEntity(List, HttpStatus.OK);
    }
//    공지사항 작성
    @PostMapping("/write")
    public ResponseEntity<Boolean> writeNotice(@RequestBody CreateNoticeDTO createNoticeDTO){
        Boolean isCreate = noticeService.createNotice(createNoticeDTO);
        if(isCreate){
            return new ResponseEntity<>(true, HttpStatus.OK);
        } else{
            return new ResponseEntity<>(false, HttpStatus.BAD_REQUEST);
        }
    }
//  공지사항 상세페이지 이동
    @GetMapping("/detail/{index}")
    public ResponseEntity getNotice(@PathVariable Long index){
        List<NoticeDTO> list = noticeService.selectByIndex(index);
        return new ResponseEntity<>(list, HttpStatus.OK);
    }
//  공지사항 삭제
    @DeleteMapping("/delete/{index}")
    public void deleteNotice(@PathVariable Long index){
        noticeService.removeNotice(index);
    }
//  공지사항 수정
    @PutMapping("/edit/{index}")
    public ResponseEntity<Boolean> editNotice(@RequestBody EditNoticeDTO editNoticeDTO, @PathVariable Long index){
        Boolean isEdit = noticeService.editNotice(editNoticeDTO);
        if(isEdit) {
            return new ResponseEntity <>(true, HttpStatus.OK);
        }else{
            return new ResponseEntity<>(false, HttpStatus.BAD_REQUEST);
        }
    }
}
