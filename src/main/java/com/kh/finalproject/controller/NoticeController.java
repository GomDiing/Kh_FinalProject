package com.kh.finalproject.controller;

import com.kh.finalproject.dto.notice.CreateNoticeDTO;
import com.kh.finalproject.dto.notice.EditNoticeDTO;
import com.kh.finalproject.dto.notice.NoticeDTO;
import com.kh.finalproject.entity.Notice;
import com.kh.finalproject.repository.NoticeRepository;
import com.kh.finalproject.service.NoticeService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/notice")
public class NoticeController {

    private final NoticeService noticeService;

    @PostMapping("/write")
    public ResponseEntity<Boolean> writeNotice(@RequestBody CreateNoticeDTO createNoticeDTO){
        Boolean isCreate = noticeService.createNotice(createNoticeDTO);
        if(isCreate){
            return new ResponseEntity<>(true, HttpStatus.OK);
        } else{
            return new ResponseEntity<>(false, HttpStatus.BAD_REQUEST);
        }
    }
//    getmapping 하니까 프론트에 Access-Control-Allow-Origin error 뜸 이유가 뭘까
    @PostMapping("/list")
    public ResponseEntity <List<NoticeDTO>> noticeList(){
//       공지 서비스 호출해서 list로 반환
        List<NoticeDTO> List = noticeService.selectAll();
        return new ResponseEntity(List, HttpStatus.OK);
    }
    @GetMapping("/post")
    public ResponseEntity getNotice(@RequestParam Long index){
        List<NoticeDTO> list = noticeService.selectByIndex(index);

        return new ResponseEntity<>(list, HttpStatus.OK);
    }
//    공지 삭제
    @PostMapping("/delete/{index}")
    public String deleteNotice(@PathVariable Long index){
        noticeService.removeNotice(index);
        return "삭제됨";
//        return noticeService.removeNotice(index);
    }
//    공지 수정
    @PostMapping("/edit")
    public ResponseEntity<Boolean> editNotice(@RequestBody EditNoticeDTO editNoticeDTO){
        Boolean isEdit = noticeService.editNotice(editNoticeDTO);
        if(isEdit) {
            return new ResponseEntity <>(true, HttpStatus.OK);
        } return new ResponseEntity<>(false, HttpStatus.BAD_REQUEST);
    }
}
