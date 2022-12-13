package com.kh.finalproject.service;

import com.kh.finalproject.dto.accuse.AccuseDTO;
import com.kh.finalproject.dto.accuse.CancelAccuseDTO;
import com.kh.finalproject.dto.accuse.CreateAccuseDTO;
import com.kh.finalproject.dto.accuse.ProcessAccuseDTO;

import com.kh.finalproject.entity.Accuse;
import com.kh.finalproject.entity.Member;
import com.kh.finalproject.entity.ReviewComment;
import com.kh.finalproject.repository.AccuseRepository;
import com.kh.finalproject.repository.MemberRepository;
import com.kh.finalproject.repository.ReviewCommentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;


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
    private final MemberRepository memberRepository;

    @Override
    public Boolean create(CreateAccuseDTO createAccuseDTO, Long reviewCommentIndex) {
        String vitimEmail = createAccuseDTO.getMemberEmailVictim();
        String suspectEmail = createAccuseDTO.getMemberEmailSuspect();
        ReviewComment reviewComment = reviewCommentRepository.findById(reviewCommentIndex).orElseThrow();
        Member findVictimMember = memberRepository.findByEmail(vitimEmail).orElseThrow(RuntimeException::new);
        Member findSuspectMember = memberRepository.findByEmail(suspectEmail).orElseThrow(RuntimeException::new);
        // 중복 신고 방지
        if (isNotAccuse(createAccuseDTO, findVictimMember, reviewComment)) {
            reviewComment.addAccuseCount();
            Accuse accuse = new Accuse().createAccuse(findSuspectMember, findVictimMember, reviewComment);
            accuseRepository.save(accuse);
            return true;
        }
        return false;
    }

    //        이미 신고한 게시물인지 체크
    @Override
    public Boolean isNotAccuse(CreateAccuseDTO createAccuseDTO,
                               Member findVictimMember,
                               ReviewComment reviewComment) {
        Optional<Accuse> findDupliReviewComment = accuseRepository.findByMemberSuspectAndReviewComment(findVictimMember, reviewComment);

        return findDupliReviewComment.isEmpty();
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
