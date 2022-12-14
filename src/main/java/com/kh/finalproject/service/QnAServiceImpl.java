//package com.kh.finalproject.service;
//
//import com.kh.finalproject.dto.notice.PagingNoticeDTO;
//import com.kh.finalproject.dto.qna.*;
//import com.kh.finalproject.entity.QnA;
//import com.kh.finalproject.repository.QnARepository;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.util.ArrayList;
//import java.util.List;
//
//@Service
//@RequiredArgsConstructor
//@Slf4j
//public class QnAServiceImpl implements QnAService{
//    private final QnARepository qnARepository;
//
//    @Override
//    public void create(CreateQnADTO createQnADTO) {
//
//    }
//
//    @Override
//    public void update(UpdateQnADTO updateQnADTO) {
//
//    }
//
//    @Override
//    public void cancel(CancelQnADTO cancelQnADTO) {
//
//    }
//
////    qna 목록 조회(마이페이지)
//    @Override
//    public PagingQnaDTO searchByMember(Long memberIndex, Pageable pageable) {
//        List<QnADTO> qnaDTOList = new ArrayList<>();
//        Page<QnA> pageMyQnaList = qnARepository.findById(index, pageable);
//
//        List<QnA> qnaMypageList = pageMyQnaList.getContent();
//        Integer totalPages = pageMyQnaList.getTotalPages();
//        Integer page = pageMyQnaList.getNumber()+1;
//        Long totalResults = pageMyQnaList.getTotalElements();
//
//        for(QnA qna : qnaMypageList){
//            QnADTO qnADTO = new QnADTO().toDTO(qna);
//            qnaDTOList.add(qnADTO);
//        }
//        PagingQnaDTO pagingQnaDTO = new PagingNoticeDTO().toPageDTO(page, totalPages, totalResults, qnaDTOList);
//
//        return pagingQnaDTO;
//
//    }
//
////  qna 리스트 조회 service
//    @Override
//    public List<QnADTO> searchAll() {
//        List<QnADTO> qnaDTOList = new ArrayList<>();
//        List<QnA> qnaList = qnARepository.findAll();
//        for(QnA e : qnaList) {
//            QnADTO qnADTO = new QnADTO().toDTO(e);
//            qnaDTOList.add(qnADTO);
//        }
//        return qnaDTOList;
//    }
//
////    qna 답장 보내기
//    @Override
//    @Transactional
//    public Boolean response(ResponseQnADTO responseQnADTO) {
//        log.info("responseQnADTO = {}", responseQnADTO.getIndex());
//        Long index = responseQnADTO.getIndex();
//        Integer reply = qnARepository.updateReply(responseQnADTO.getReply(), index);
//        return true;
//    }
//
//    @Override
//    public void createExtra(CreateExtraQnADTO createExtraQnADTO) {
//
//    }
//}
