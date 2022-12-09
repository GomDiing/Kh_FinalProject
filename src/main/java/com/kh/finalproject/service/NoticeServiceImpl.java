package com.kh.finalproject.service;

import com.kh.finalproject.dto.notice.CreateNoticeDTO;
import com.kh.finalproject.dto.notice.EditNoticeDTO;
import com.kh.finalproject.dto.notice.NoticeDTO;
import com.kh.finalproject.entity.Notice;
import com.kh.finalproject.repository.NoticeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.EmptyStackException;
import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class NoticeServiceImpl implements NoticeService {

    private final NoticeRepository noticeRepository;

    @Override
    public Boolean createNotice(CreateNoticeDTO createNoticeDTO) {
        Notice notice = new Notice().toEntity(createNoticeDTO);
        Notice rst = noticeRepository.save(notice);
        return true;
    }
//수정
    @Override
    public Boolean editNotice(EditNoticeDTO editNoticeDTO, Long index) {
//        Notice checkNotice = noticeRepository.findByIndex(notice.getIndex()).orElseThrow(EmptyStackException::new);
        Notice findNotice = noticeRepository.findByIndex(index).get(0);
        if (Objects.isNull(findNotice)) {
            throw new EmptyStackException();
        }

        Notice newNotice = new Notice().toEntity(editNoticeDTO, findNotice.getCreate_time());

        Notice rst = noticeRepository.save(newNotice);

        return true;
    }

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

}
