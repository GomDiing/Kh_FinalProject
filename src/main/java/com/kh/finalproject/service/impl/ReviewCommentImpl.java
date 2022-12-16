package com.kh.finalproject.service.impl;

import com.kh.finalproject.dto.reviewComment.*;
import com.kh.finalproject.entity.Member;
import com.kh.finalproject.entity.ReviewComment;
import com.kh.finalproject.exception.CustomErrorCode;
import com.kh.finalproject.exception.CustomException;
import com.kh.finalproject.repository.MemberRepository;
import com.kh.finalproject.repository.ReviewCommentRepository;
import com.kh.finalproject.service.ReviewCommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewCommentImpl implements ReviewCommentService {
    private final ReviewCommentRepository reviewCommentRepository;
    private final MemberRepository memberRepository;
    @Override
    public void create(CreateReviewCommentDTO createReviewCommentDTO) {
    /*공연 후기 작성 시 회원 아이디로 회원 조회*/
        Optional<Member> findOne = memberRepository.findById(createReviewCommentDTO.getMemberId());
        if(findOne.isEmpty()){
            throw new CustomException(CustomErrorCode.EMPTY_MEMBER);
        }
        Member member = findOne.get();


    }

    @Override
    public void remove(RemoveReviewCommentDTO removeReviewCommentDTO) {

    }

    @Override
    public void update(UpdateReviewCommentDTO updateReviewCommentDTO) {

    }

    @Override
    public void rearrangeOrder(Long productCode) {

    }

    @Override
    public void addRateAverage(UpdateRateAverageDTO updateRateAverageDTO) {

    }

    @Override
    public ReviewCommentDTO searchByProduct(Long index) {
        return null;
    }

    @Override
    public List<ReviewCommentDTO> searchAll() {
        List<ReviewCommentDTO> reviewCommentDTOList = new ArrayList<>();
        List<ReviewComment> reviewCommentList = reviewCommentRepository.findAll();

        for (ReviewComment e : reviewCommentList) {
            ReviewCommentDTO reviewCommentDTO = new ReviewCommentDTO().toDTO(e);
            reviewCommentDTOList.add(reviewCommentDTO);
        }
        return reviewCommentDTOList;
    }

}
