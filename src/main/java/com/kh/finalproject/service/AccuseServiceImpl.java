package com.kh.finalproject.service;

import com.kh.finalproject.dto.accuse.AccuseDTO;
import com.kh.finalproject.dto.accuse.CancelAccuseDTO;
import com.kh.finalproject.dto.accuse.CreateAccuseDTO;
import com.kh.finalproject.dto.accuse.ProcessAccuseDTO;

import com.kh.finalproject.entity.Accuse;
import com.kh.finalproject.entity.Member;
import com.kh.finalproject.entity.ReviewComment;
import com.kh.finalproject.repository.AccuseRepository;
import com.kh.finalproject.repository.ReviewCommentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


/**
 * 신고 서비스 구현체
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class AccuseServiceImpl implements AccuseService {
    private final AccuseRepository accuseRepository;
    private final ReviewCommentRepository reviewCommentRepository;

    @Override
    public Boolean create(Member member, Long index) {
        ReviewComment reviewComment = reviewCommentRepository.findById(index).orElseThrow();
//        중복 신고 방지
        if (isNotAccuse(member,reviewComment)) {
            accuseRepository.save(new Accuse());
            return true;
        }
        Accuse accuse = new Accuse().createAccuse(member, member, reviewComment);
        accuseRepository.save(accuse);
        return true;
    }
//        이미 신고한 게시물인지 체크
    @Override
    public Boolean isNotAccuse(Member member, ReviewComment reviewComment){
            return accuseRepository.findByMemberSuspectAndReviewComment(member, reviewComment).isEmpty();
        }
//        좋아요 개수
//        @Override
//        @Transactional(readOnly = true)
//        public accuse


    @Override
    public void process(ProcessAccuseDTO processAccuseDTO) {

    }

    @Override
    public List<AccuseDTO> searchAll() {
        return null;
    }

    @Override
    public AccuseDTO searchByMemberVictim() {
        return null;
    }

    @Override
    public void cancel(CancelAccuseDTO cancelAccuseDTO) {

    }
}
