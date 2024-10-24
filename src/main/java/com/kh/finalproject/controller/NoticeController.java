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

/**
 * 공지사항 관리를 위한 API 컨트롤러
 * 공지사항의 조회, 작성, 수정, 삭제 기능을 제공
 * 단일/다중 삭제와 페이징 처리를 지원
 *
 * @author GomDiing
 */
@RequiredArgsConstructor
@RestController
@Slf4j
@RequestMapping("/api/notice")
public class NoticeController {

    private final NoticeService noticeService;

    /**
     * 공지사항 목록을 페이징하여 조회
     *
     * @param pageable 페이징 정보
     * @return 공지사항 목록과 페이징 정보, 공지사항 조회 성공 메시지
     */
    @GetMapping("/list")
    public ResponseEntity<DefaultResponse<PagingNoticeDTO>> noticeList(Pageable pageable) {
        PagingNoticeDTO list = noticeService.selectAll(pageable);
        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_SEARCH_NOTICELIST, list), HttpStatus.OK);
    }

    /**
     * 신규 공지사항을 등록
     *
     * @param createNoticeDTO 새 공지사항 정보
     * @return 공지사항 등록 완료 응답 메시지
     */
    @PostMapping("/write")
    public ResponseEntity<DefaultResponse<Object>> writeNotice(@Validated @RequestBody CreateNoticeDTO createNoticeDTO) {

        noticeService.createNotice(createNoticeDTO);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_CREATE_NOTICE), HttpStatus.OK);
    }

    /**
     * 공지사항 상세페이지 이동
     *
     * @param index 이동하려는 공지사항 고유 인덱스
     * @return 공지사항 상세 정보
     */
    @GetMapping("/detail/{index}")
    public ResponseEntity<DefaultResponse<NoticeDTO>> getNotice(@PathVariable Long index) {

        NoticeDTO noticeDetail = noticeService.selectByIndex(index);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_SEARCH_NOTICE, noticeDetail), HttpStatus.OK);
    }

    /**
     * 공지사항 삭제
     *
     * @param index 삭제하려는 공지사항 고유 인덱스
     * @return 공지사항 삭제 성공 응답 메시지
     */
    @DeleteMapping("/delete/{index}")
    public ResponseEntity<DefaultResponse<Object>> deleteNotice(@PathVariable Long index) {

        noticeService.removeNotice(index);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_DELETE_NOTICE), HttpStatus.OK);
    }

    /**
     * 공지사항 수정
     *
     * @param editNoticeDTO 수정하려는 공지사항 정보
     * @param index 수정 공지사항 고유 인덱스
     * @return 공지사항 수정 성공 응답 메시지
     */
    @PutMapping("/edit/{index}")
    public ResponseEntity<DefaultResponse<Object>> editNotice(@Validated @RequestBody EditNoticeDTO editNoticeDTO, @PathVariable Long index) {
        noticeService.editNotice(editNoticeDTO, index);
        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_UPDATE_NOTICE), HttpStatus.OK);
    }

    /**
     * 공지사항 다중 삭제
     * 체크박스로 공지사항 삭제
     *
     * @param noticeDTOList 삭제하려는 공지사항 정보
     * @return 공지사항 삭제 성공 응답 메시지
     */
    @PostMapping("/delete/checkbox")
    public ResponseEntity<DefaultResponse<Object>> deleteCheckNotice(@RequestBody NoticeListDTO noticeDTOList) {
        List<CheckDTO> noticeList = noticeDTOList.getCheckDTOList();
        log.info("noticeList = {}", noticeList.toString());
        noticeService.deleteCheckNotice(noticeList);
        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_DELETE_NOTICE_BY_CHECKBOX), HttpStatus.OK);
    }
}
