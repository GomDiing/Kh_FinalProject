package com.kh.finalproject.controller;

import com.kh.finalproject.dto.notice.*;
import com.kh.finalproject.response.DefaultResponse;
import com.kh.finalproject.response.DefaultResponseMessage;
import com.kh.finalproject.response.StatusCode;
import com.kh.finalproject.service.NoticeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Objects;

@RequiredArgsConstructor
@RestController
@Slf4j
@RequestMapping("/api/notice")
//@CrossOrigin(origins = "http://localhost:3000")
//@CrossOrigin(origins = "*", allowedHeaders = "*")
public class NoticeController {

    private final NoticeService noticeService;

//   공지사항 조회(확인)
    @GetMapping("/list")
    public ResponseEntity <DefaultResponse<Object>> noticeList(Pageable pageable){
//       공지 서비스 호출해서 list로 반환
        PagingNoticeDTO list = noticeService.selectAll(pageable);
        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_SEARCH_NOTICELIST, list), HttpStatus.OK);
    }

//    공지사항 작성
    @PostMapping("/write")
    public ResponseEntity<DefaultResponse<Object>> writeNotice(@Validated @RequestBody CreateNoticeDTO createNoticeDTO){
        noticeService.createNotice(createNoticeDTO);
        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_CREATE_NOTICE), HttpStatus.OK);
    }
//  공지사항 상세페이지 이동
    @GetMapping("/detail/{index}")
    public ResponseEntity<DefaultResponse<Object>> getNotice(@PathVariable Long index){
        NoticeDTO noticeDetail = noticeService.selectByIndex(index);
        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_SEARCH_NOTICE, noticeDetail), HttpStatus.OK);
    }
//  공지사항 삭제
    @DeleteMapping("/delete/{index}")
    public ResponseEntity<DefaultResponse<Object>> deleteNotice(@PathVariable Long index){
        noticeService.removeNotice(index);
        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_DELETE_NOTICE), HttpStatus.OK);
    }

//  공지사항 수정
    @PutMapping("/edit/{index}")
    public ResponseEntity<DefaultResponse<Object>> editNotice(@Validated @RequestBody EditNoticeDTO editNoticeDTO, @PathVariable Long index){
        noticeService.editNotice(editNoticeDTO, index);
        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_UPDATE_NOTICE), HttpStatus.OK);
    }
//    공지사항 체크박스로 삭제
    @PostMapping("/delete/checkbox")
    public ResponseEntity<DefaultResponse<Object>> deleteCheckNotice(@RequestBody NoticeListDTO noticeDTOList){
        List<CheckDTO> noticeList = noticeDTOList.getCheckDTOList();
        log.info("noticeList = {}", noticeList.toString());
        noticeService.deleteCheckNotice(noticeList);
        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_DELETE_NOTICE_BY_CHECKBOX), HttpStatus.OK);
    }
}
