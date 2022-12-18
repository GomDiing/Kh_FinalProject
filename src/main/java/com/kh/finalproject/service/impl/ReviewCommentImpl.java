package com.kh.finalproject.service.impl;

import com.kh.finalproject.dto.reviewComment.*;
import com.kh.finalproject.entity.Member;
import com.kh.finalproject.entity.Product;
import com.kh.finalproject.entity.ReviewComment;
import com.kh.finalproject.exception.CustomErrorCode;
import com.kh.finalproject.exception.CustomException;
import com.kh.finalproject.repository.MemberRepository;
import com.kh.finalproject.repository.ProductRepository;
import com.kh.finalproject.repository.ReviewCommentRepository;
import com.kh.finalproject.service.ReviewCommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
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
    private final ProductRepository productRepository;

    /*공연 후기 작성*/
    @Override
    public void create(CreateReviewCommentDTO createReviewCommentDTO) {
    /*공연 후기 작성 시 회원 아이디로 회원 조회*/
        Optional<Member> findOne = memberRepository.findByIndex(createReviewCommentDTO.getMemberIndex());
        if(findOne.isEmpty()){
            throw new CustomException(CustomErrorCode.EMPTY_MEMBER);
        }
        Member member = findOne.get();
        log.info("일치하는 아이디가 있습니다.", member);
        /*후기 작성 시 공연 조회 */
        Optional<Product> findProduct = productRepository.findByCode(createReviewCommentDTO.getCode());
        if(findProduct.isEmpty()){
            throw new CustomException(CustomErrorCode.ERROR_EMPTY_PRODUCT_CODE);
        }
        Product product = findProduct.get();
        log.info("일치하는 공연명이 있습니다.", product);

        ReviewComment writeReviewComment = new ReviewComment().createReviewComment(member, product, createReviewCommentDTO.getContent(),
                 createReviewCommentDTO.getRate());
        reviewCommentRepository.save(writeReviewComment);
        return;

    }
    /*후기 대댓글 작성*/
    @Override
    public void reCreate(CreateReviewCommentDTO createReviewCommentDTO){
        Integer commentLayer = reviewCommentRepository.findCommentGroup().orElse(0);
        Integer commentOrder = reviewCommentRepository.findCommentGroup().orElse(0);

        ReviewComment reviewComment = new ReviewComment();
        reviewComment.changeLayer(commentLayer,commentOrder);
        reviewCommentRepository.save(reviewComment);
    }

    /*후기 댓글 삭제하기*/
    @Override
    public void remove(RemoveReviewCommentDTO removeReviewCommentDTO) {
//        아이디 조회
        Optional<Member> findOne = memberRepository.findByIndex(removeReviewCommentDTO.getMemberIndex());
        if(findOne.isEmpty()){
            throw new CustomException(CustomErrorCode.EMPTY_MEMBER);
        }
        Member member = findOne.get();
        log.info("일치하는 아이디가 있습니다.", member);
//        글 조회
        Optional<ReviewComment> findReview = reviewCommentRepository.findById(removeReviewCommentDTO.getIndex());
        ReviewComment reviewComment = findReview.get();

//        changeReviewCommentStatus를 불러오고 싶은데
        return;
    }

    /*후기 댓글 수정하기*/
    @Override
    public void update(UpdateReviewCommentDTO updateReviewCommentDTO) {

//        Member findMember = memberRepository.findById()
//
//        Member findMember = memberRepository.findById(memberInfoDTO.getId())
//                .orElseThrow(() -> new CustomException(CustomErrorCode.EMPTY_MEMBER));
//        /*작성한 댓글 아이디, index 조회*/
//        Integer updateCount = reviewCommentRepository.updateNotice(new ReviewComment().UpdateReviewComment(updateReviewCommentDTO));

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

    /*공연 후기 리스트*/
    @Override
    public List<ReviewCommentDTO> searchAll(Pageable pageSize) {
        List<ReviewCommentDTO> reviewCommentDTOList = new ArrayList<>();
        List<ReviewComment> reviewCommentList = reviewCommentRepository.selectAll(pageSize);

        for (ReviewComment e : reviewCommentList) {
            ReviewCommentDTO reviewCommentDTO = new ReviewCommentDTO().toDTO(e);
            reviewCommentDTOList.add(reviewCommentDTO);
        }
        return reviewCommentDTOList;
    }

}
