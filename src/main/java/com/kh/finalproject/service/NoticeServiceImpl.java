package com.kh.finalproject.service;

import com.kh.finalproject.dto.notice.*;
import com.kh.finalproject.entity.Notice;
import com.kh.finalproject.entity.enumurate.NoticeStatus;
import com.kh.finalproject.exception.repository.NoticeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = false)
@Slf4j
public class NoticeServiceImpl implements NoticeService {

    private final NoticeRepository noticeRepository;

//    공지사항 작성하기
    @Override
    public Boolean createNotice(CreateNoticeDTO createNoticeDTO) {
        Notice notice = new Notice().toEntity(createNoticeDTO);
        Notice rst = noticeRepository.save(notice);
        return true;
    }
    // 공지사항 수정하기
    @Transactional
    @Override
    public Boolean editNotice(EditNoticeDTO editNoticeDTO, Long index) {
        Integer updateCount = noticeRepository.updateNotice(new Notice().toEntity(editNoticeDTO, index));
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
    public List<NoticeDTO> selectByIndex(Long index) {
        List<NoticeDTO> noticeDTOSList = new ArrayList<>();
        List<Notice> noticeDetail = noticeRepository.findByIndex(index);
        for(Notice e : noticeDetail){
            NoticeDTO noticeDTO = new NoticeDTO();
            noticeDTO.setIndex(e.getIndex());
            noticeDTO.setTitle(e.getTitle());
            noticeDTO.setContent(e.getContent());
            noticeDTOSList.add(noticeDTO);
        }
        return noticeDTOSList;
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
