package com.kh.finalproject.service;

import com.kh.finalproject.dto.notice.CheckDTO;
import com.kh.finalproject.dto.notice.CreateNoticeDTO;
import com.kh.finalproject.dto.notice.EditNoticeDTO;
import com.kh.finalproject.dto.notice.NoticeDTO;
import com.kh.finalproject.entity.Notice;
import com.kh.finalproject.entity.enumurate.NoticeStatus;
import com.kh.finalproject.repository.NoticeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.EmptyStackException;
import java.util.List;
import java.util.Objects;

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
//        Notice checkNotice = noticeRepository.findByIndex(notice.getIndex()).orElseThrow(EmptyStackException::new);
//        Notice findNotice = noticeRepository.findByIndex(index).get(0);
        Integer updateCount = noticeRepository.updateNotice(new Notice().toEntity(editNoticeDTO, index));
//        if (Objects.isNull(findNotice)) {
        if (updateCount == 0) {
            throw new EmptyStackException();
        }
//        Notice newNotice = new Notice().toEntity(editNoticeDTO, findNotice.getCreate_time());
//        Notice rst = noticeRepository.save(newNotice);
        return true;
    }

//    공지사항 디테일페이지 삭제버튼 기능
    @Override
    public void removeNotice(Long index) {
        noticeRepository.deleteById(index);
    }
//    공지 목록 조회 service
    @Override
    public List<NoticeDTO> selectAll() {
        List<NoticeDTO> noticeDTOSList = new ArrayList<>();
        List<Notice> noticeList = noticeRepository.findAll();
        for(Notice e : noticeList){
            NoticeDTO noticeDTO = new NoticeDTO().toDTO(e);
            noticeDTOSList.add(noticeDTO);
        }
        return noticeDTOSList;
    }

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
//    체크박스로 삭제
    public Boolean deleteCheckNotice(List<CheckDTO> noticeIndexList) {
        List<Notice> deleteList = new ArrayList<>();
        for (CheckDTO noticeIndex : noticeIndexList) {
            log.info("noticeIndex = {}", noticeIndex.getIndex());

//            List<Notice> checkNotice = noticeRepository.findByIndex(noticeIndex);
            noticeRepository.changeStatusNotice(noticeIndex.getIndex(), NoticeStatus.DELETE);
        }

        return true;
    }
}
