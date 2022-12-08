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

    @Override
    public Boolean editNotice(EditNoticeDTO editNoticeDTO) {
        Notice notice = new Notice().toEntity(editNoticeDTO);
        Notice checkNotice = noticeRepository.findById(notice.getIndex()).orElseThrow(EmptyStackException::new);
        Notice rst = noticeRepository.save(notice);
        return true;
    }

    @Override
    public void removeNotice(Long index) {
        noticeRepository.deleteById(index);
    }
    @Override
    public List<NoticeDTO> selectAll() {
        List<NoticeDTO> noticeDTOSList = new ArrayList<>();
        List<Notice> noticeList = noticeRepository.findAll();
        for(Notice e : noticeList){
            NoticeDTO noticeDTO = new NoticeDTO();
            noticeDTO.setIndex(e.getIndex());
            noticeDTO.setTitle(e.getTitle());
            noticeDTO.setContent(e.getContent());
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
