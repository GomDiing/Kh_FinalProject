package com.kh.finalproject.service.impl;

import com.kh.finalproject.dto.accuse.AccuseDTO;
import com.kh.finalproject.dto.accuse.CancelAccuseDTO;
import com.kh.finalproject.dto.accuse.CreateAccuseDTO;

import com.kh.finalproject.entity.Accuse;
import com.kh.finalproject.entity.Member;
import com.kh.finalproject.entity.ReviewComment;
import com.kh.finalproject.entity.enumurate.MemberStatus;
import com.kh.finalproject.exception.CustomErrorCode;
import com.kh.finalproject.exception.CustomException;
import com.kh.finalproject.repository.AccuseRepository;
import com.kh.finalproject.repository.MemberRepository;
import com.kh.finalproject.repository.ReviewCommentRepository;
import com.kh.finalproject.service.AccuseService;
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
    private final MemberRepository memberRepository;

    /**
     * 신고 생성 메서드
     */
    @Override
    @Transactional
    public void create(CreateAccuseDTO createAccuseDTO, Long reviewCommentIndex) {
        // 회원 Email 추출 후 회원, 후기 DB 조회
        String vitimEmail = createAccuseDTO.getMemberEmailVictim(); //신고한사람
        String suspectEmail = createAccuseDTO.getMemberEmailSuspect();//신고당한 사람(글쓴 사람)

        //조회한 회원, 후기가 없다면 예외 처리
        ReviewComment reviewComment = reviewCommentRepository.findById(reviewCommentIndex)
                .orElseThrow(() -> new CustomException(CustomErrorCode.EMPTY_REVIEW_COMMENT));
        Member findVictimMember = memberRepository.findByEmailAndStatusNot(vitimEmail, MemberStatus.UNREGISTER)
                .orElseThrow(() -> new CustomException(CustomErrorCode.EMPTY_MEMBER));
        Member findSuspectMember = memberRepository.findByEmailAndStatusNot(suspectEmail, MemberStatus.UNREGISTER)
                .orElseThrow(() -> new CustomException(CustomErrorCode.EMPTY_MEMBER));

        //중복 신고 방지
        if (isNotAccuse(findVictimMember, reviewComment)) { //신고자가 해당리뷰에 신고한적 없으면
            reviewComment.addAccuseCount(); // 해당 리뷰 count +1
            findSuspectMember.addMemberAccuseCount(); // 신고당한사람(작성자) 카운트 + 1
            Accuse saveAccuse = new Accuse().createAccuse(findSuspectMember, findVictimMember, reviewComment, createAccuseDTO.getReason());
            accuseRepository.save(saveAccuse);
        }
        //중복 신고가 된 경우
        else throw new CustomException(CustomErrorCode.OVERLAP_REVIEW_COMMENT);

        return;
    }

    /**
     * 신고한 회원이(victim) 동일 리뷰 중복 신고 여부 확인
     */
    public Boolean isNotAccuse(Member findVictimMember,
                               ReviewComment reviewComment) {
        return accuseRepository.findByMemberVictimAndReviewComment(findVictimMember, reviewComment)
                .isEmpty();
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
