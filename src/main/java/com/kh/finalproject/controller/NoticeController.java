package com.kh.finalproject.controller;

import com.kh.finalproject.dto.notice.*;
import com.kh.finalproject.service.NoticeService;
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
public class NoticeController {

    private final NoticeService noticeService;

//   공지사항 조회(확인)
    @GetMapping("/notice/list")
    public ResponseEntity <List<NoticeDTO>> noticeList(Pageable pageable){
//       공지 서비스 호출해서 list로 반환
        PagingNoticeDTO list = noticeService.selectAll(pageable);
        return new ResponseEntity(list, HttpStatus.OK);
    }

//    공지사항 작성
    @PostMapping("/notice/write")
    public ResponseEntity<Boolean> writeNotice(@RequestBody CreateNoticeDTO createNoticeDTO){
        Boolean isCreate = noticeService.createNotice(createNoticeDTO);
        if(isCreate){
            return new ResponseEntity<>(true, HttpStatus.OK);
        } else{
            return new ResponseEntity<>(false, HttpStatus.BAD_REQUEST);
        }
    }
//  공지사항 상세페이지 이동
    @GetMapping("/notice/detail/{index}")
    public ResponseEntity getNotice(@PathVariable Long index){
        List<NoticeDTO> list = noticeService.selectByIndex(index);
        return new ResponseEntity<>(list, HttpStatus.OK);
    }
//  공지사항 삭제
    @DeleteMapping("/notice/delete/{index}")
    public void deleteNotice(@PathVariable Long index){
        noticeService.removeNotice(index);
    }

//  공지사항 수정
    @PutMapping("/notice/edit/{index}")
    public ResponseEntity<Boolean> editNotice(@RequestBody EditNoticeDTO editNoticeDTO, @PathVariable Long index){
        Boolean isEdit = noticeService.editNotice(editNoticeDTO, index);
        if(isEdit) {
            return new ResponseEntity <>(true, HttpStatus.OK);
        }else{
            return new ResponseEntity<>(false, HttpStatus.BAD_REQUEST);
        }
    }
//    공지사항 체크박스로 삭제
    @PostMapping("/notice/delete/check")
    public ResponseEntity deleteCheckNotice(@RequestBody NoticeListDTO noticeListAAA){
        List<CheckDTO> noticeList = noticeListAAA.getCheckDTOList();
        log.info("noticeList = {}", noticeList.toString());
        boolean isTrue = noticeService.deleteCheckNotice(noticeList);
        if (isTrue) {
            return new ResponseEntity<>(true,HttpStatus.OK);
        } else{
            return new ResponseEntity<>(false,HttpStatus.BAD_REQUEST);
        }
    }

}
