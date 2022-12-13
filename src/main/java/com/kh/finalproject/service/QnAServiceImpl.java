package com.kh.finalproject.service;

import com.kh.finalproject.dto.qna.*;
import com.kh.finalproject.entity.QnA;
import com.kh.finalproject.repository.QnARepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class QnAServiceImpl implements QnAService{
    private final QnARepository qnARepository;

    @Override
    public void create(CreateQnADTO createQnADTO) {

    }

    @Override
    public void update(UpdateQnADTO updateQnADTO) {

    }

    @Override
    public void cancel(CancelQnADTO cancelQnADTO) {

    }

    @Override
    public QnADTO searchByMember(Long memberIndex) {
        return null;
    }

//  qna 리스트 조회 service
    @Override
    public List<QnADTO> searchAll() {
        List<QnADTO> qnaDTOList = new ArrayList<>();
        List<QnA> qnaList = qnARepository.findAll();
        for(QnA e : qnaList) {
            QnADTO qnADTO = new QnADTO().toDTO(e);
            qnaDTOList.add(qnADTO);
        }
        return qnaDTOList;
    }

//    qna 답장 보내기
    @Override
    @Transactional
    public Boolean response(ResponseQnADTO responseQnADTO) {
        log.info("responseQnADTO = {}", responseQnADTO.getIndex());
        Long index = responseQnADTO.getIndex();
        Integer reply = qnARepository.updateReply(responseQnADTO.getReply(), index);
        return true;
    }

    @Override
    public void createExtra(CreateExtraQnADTO createExtraQnADTO) {

    }
}
