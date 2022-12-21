package com.kh.finalproject.service.impl;

import com.kh.finalproject.dto.reviewLike.AddReviewLikeDTO;
import com.kh.finalproject.dto.reviewLike.RemoveReviewLikeDTO;
import com.kh.finalproject.entity.Member;
import com.kh.finalproject.entity.ReviewComment;
import com.kh.finalproject.entity.ReviewLike;
import com.kh.finalproject.exception.CustomErrorCode;
import com.kh.finalproject.exception.CustomException;
import com.kh.finalproject.repository.MemberRepository;
import com.kh.finalproject.repository.ReviewCommentRepository;
import com.kh.finalproject.repository.ReviewLikeRepository;
import com.kh.finalproject.service.ReviewLikeService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ReviewLikeServiceImpl implements ReviewLikeService {

    private final ReviewCommentRepository reviewCommentRepository;
    private final MemberRepository memberRepository;

    private final ReviewLikeRepository reviewLikeRepository;

    /**
     * 좋아요 추가 메서드
     */
    @Transactional
    @Override
    public void addLike(AddReviewLikeDTO addReviewLikeDTO) {
        //좋아요 누른 회원 조회
        Member likeMember = memberRepository.findByIndex(addReviewLikeDTO.getMemberIndex())
                .orElseThrow(() -> new CustomException(CustomErrorCode.EMPTY_MEMBER));

        //좋아요 받은 게시글 조회
        ReviewComment likeReviewComment = reviewCommentRepository.findByIndex(addReviewLikeDTO.getReviewCommentIndex())
                .orElseThrow(() -> new CustomException(CustomErrorCode.EMPTY_REVIEW_COMMENT));

        //중복 좋아요 누른게 아니라면
        if (isNotDupliLike(likeMember, likeReviewComment)) {
            ReviewLike reviewLike = new ReviewLike().toEntity(likeReviewComment, likeMember);

            //리뷰 게시글 좋아요 개수 갱신
            likeReviewComment.updateLike();

            //DB 저장
            reviewLikeRepository.save(reviewLike);

        } else throw new CustomException(CustomErrorCode.DUPLI_REVIEW_LIKE); //눌렀다면 예외 처리
    }

    /**
     * 동일한 회원이 후기/댓글에 좋아요 눌렀는지 확인
     */
    public Boolean isNotDupliLike(Member likeMember,
                               ReviewComment likeReviewComment) {
        return reviewLikeRepository.findByMemberAndReviewComment(likeMember, likeReviewComment)
                .isEmpty();
    }

    @Override
    public void delete(RemoveReviewLikeDTO removeReviewLikeDTO) {

    }
}
