package com.kh.finalproject.service;

import com.kh.finalproject.dto.notice.*;
import com.kh.finalproject.entity.Notice;
import com.kh.finalproject.entity.enumurate.NoticeStatus;
import com.kh.finalproject.exception.CustomErrorCode;
import com.kh.finalproject.exception.CustomException;
import com.kh.finalproject.repository.NoticeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = false)
@Slf4j
public class NoticeServiceImpl implements NoticeService {

    private final NoticeRepository noticeRepository;

//    공지사항 작성하기
    @Override
    public void createNotice(CreateNoticeDTO createNoticeDTO) {
        Notice notice = new Notice().toEntity(createNoticeDTO);
        noticeRepository.save(notice);
    }
    // 공지사항 수정하기
    @Transactional
    @Override
    public Boolean editNotice(EditNoticeDTO editNoticeDTO, Long index) {
        Integer updateCount = noticeRepository.updateNotice(new Notice().toEntity(editNoticeDTO, index), LocalDateTime.now());
                if (updateCount == 0) {
            throw new EmptyStackException();
        }
        return true;
    }

//    공지사항 디테일페이지 삭제버튼 기능
    @Override
    public void removeNotice(Long index) {
        noticeRepository.changeStatusNotice(index, NoticeStatus.DELETE);
    }


    //    공지 목록 조회 service
    @Override
    public PagingNoticeDTO selectAll(Pageable pageable){
        List<NoticeDTO> noticeDTOList = new ArrayList<>();
        Page<Notice> pageNoticeList = noticeRepository.findByStatus(NoticeStatus.ACTIVE, pageable);

        List<Notice> noticeList = pageNoticeList.getContent();
        Integer totalPages = pageNoticeList.getTotalPages();
        Integer page = pageNoticeList.getNumber()+1;
        Long totalResults = pageNoticeList.getTotalElements();

        for (Notice notice : noticeList) {
            NoticeDTO noticeDTO = new NoticeDTO().toDTO(notice);
            noticeDTOList.add(noticeDTO);
        }
        PagingNoticeDTO pagingNoticeDTO = new PagingNoticeDTO().toPageDTO(page, totalPages, totalResults, noticeDTOList);

        return pagingNoticeDTO;
    }
    //공지사항 상세페이지별 데이터 조회
    @Override
    public NoticeDTO selectByIndex(Long index) {
        Notice noticeDetail = noticeRepository.findByIndex(index)
                .orElseThrow(() -> new CustomException(CustomErrorCode.EMPTY_NOTICE));

        return new NoticeDTO().toDTO(noticeDetail);
    }

    @Transactional
//    체크박스로 공지사항 삭제
    public Boolean deleteCheckNotice(List<CheckDTO> noticeIndexList) {
        List<Notice> deleteList = new ArrayList<>();
        for (CheckDTO noticeIndex : noticeIndexList) {
            log.info("noticeIndex = {}", noticeIndex.getIndex());
            noticeRepository.changeStatusNotice(noticeIndex.getIndex(), NoticeStatus.DELETE);
        }
        return true;
    }
}
