package com.kh.finalproject.service.impl;

import com.kh.finalproject.dto.reviewComment.*;
import com.kh.finalproject.entity.Member;
import com.kh.finalproject.entity.Product;
import com.kh.finalproject.entity.ReviewComment;
import com.kh.finalproject.entity.enumurate.ReviewCommentStatus;
import com.kh.finalproject.exception.CustomErrorCode;
import com.kh.finalproject.exception.CustomException;
import com.kh.finalproject.repository.MemberRepository;
import com.kh.finalproject.repository.ProductRepository;
import com.kh.finalproject.repository.ReviewCommentRepository;
import com.kh.finalproject.service.ReviewCommentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ReviewCommentImpl implements ReviewCommentService {
    private final ReviewCommentRepository reviewCommentRepository;
    private final MemberRepository memberRepository;
    private final ProductRepository productRepository;

    /*공연 후기 작성*/
    @Transactional
    @Override
    public void create(CreateReviewCommentDTO createReviewCommentDTO) {
        /*공연 후기 작성 시 회원 아이디로 회원 조회*/
        Optional<Member> findOne = memberRepository.findByIndex(createReviewCommentDTO.getMemberIndex());
        if (findOne.isEmpty()) {
            throw new CustomException(CustomErrorCode.EMPTY_MEMBER);
        }
        Member member = findOne.get();
        log.info("일치하는 아이디가 있습니다.", member);
        /*후기 작성 시 공연 조회 */
        Optional<Product> findProduct = productRepository.findByCode(createReviewCommentDTO.getProductCode());
        if (findProduct.isEmpty()) {
            throw new CustomException(CustomErrorCode.ERROR_EMPTY_PRODUCT_CODE);
        }
        Product product = findProduct.get();
        log.info("일치하는 공연명이 있습니다.", product);

        /*작성 후 save*/
        ReviewComment writeReviewComment = new ReviewComment().createReviewComment(member, product, createReviewCommentDTO.getTitle(), createReviewCommentDTO.getContent(),
                createReviewCommentDTO.getRate());
        reviewCommentRepository.save(writeReviewComment);

        //평점 추가
        product.updateRate(createReviewCommentDTO.getRate());

        List<ReviewComment> findAllReview = reviewCommentRepository.findAllByProduct(product);

        Long group = 0L;
        for (ReviewComment reviewComment : findAllReview) {
            if (reviewComment.getIndex() > group) {  //부모 그룹값보다 작성된 후기글 값이 더 크면 똑같이
                group = reviewComment.getIndex();
            }
        }
        log.info("findAllReview.size() = {}", findAllReview.size());

        int lastOrder = findAllReview.size();

        ReviewComment savedreview = findAllReview.get(lastOrder - 1);
        log.info("savedreview.getIndex() = {}", savedreview.getIndex());

        savedreview.updateGroupAndOrder(group, lastOrder);
        return;

    }

    /*후기 대댓글 작성*/
    @Override
    @Transactional
    public void reCreate(CreateReviewCommentDTO createReviewCommentDTO) {
        /*회원 조회*/
        Optional<Member> findOne = memberRepository.findByIndex(createReviewCommentDTO.getMemberIndex());
        if (findOne.isEmpty()) {
            throw new CustomException(CustomErrorCode.EMPTY_MEMBER);
        }
        Member member = findOne.get();
        log.info("일치하는 아이디가 있습니다.", member);
        /*공연상품 조회 */
        Optional<Product> findProduct = productRepository.findByCode(createReviewCommentDTO.getProductCode());
        if (findProduct.isEmpty()) {
            throw new CustomException(CustomErrorCode.ERROR_EMPTY_PRODUCT_CODE);
        }
        Product product = findProduct.get();

        /*댓글 후기 작성*/
        ReviewComment rewriteReviewComment = new ReviewComment().createAddReviewComment(member, product, createReviewCommentDTO.getContent(),
                createReviewCommentDTO.getGroup());
        reviewCommentRepository.save(rewriteReviewComment);

        /*해당 상품에 작성된 모든 후기 가져오기*/
        List<ReviewComment> findAllReview = reviewCommentRepository.findAllByProduct(product);
        Collections.sort(findAllReview, new ListComparator()); //순서 정렬

//        log.info("findAllReview.toString() = {}", findAllReview.toString());

        int reOrder = 0;
        int reLayer = 0;
        int reCount = 0;
        Long reGroup = 0L;

        Long parentGroup = createReviewCommentDTO.getGroup(); //후기 그룹
        Integer parentLayer = createReviewCommentDTO.getLayer(); // 후기 layer


        for (ReviewComment reviewComment : findAllReview) {
            if (Objects.equals(reviewComment.getGroup(), parentGroup)) { // 후기 그룹 값이랑 그룹 값이 같은거 가져오기 => 총 몇개 댓글 달린지 유추
                reCount++;
                reGroup = parentGroup;
            }
//            reviewComment.updateGroup(reGroup); // 댓글 그룹 부모 그룹값으로 저장
        }

        Integer lastOrder = findAllReview.get(findAllReview.size() - 2).getOrder(); //마지막 쓰여진 글의 순서 가져오기

        for (ReviewComment reviewComment : findAllReview) {
            if (reviewComment.getOrder() > lastOrder) {
                reviewComment.updateOrder(reviewComment.getOrder() + 1);
            }
        }
        findAllReview.get(findAllReview.size() - 1).updateOrder(lastOrder + 1);
    }

    /*후기 댓글 삭제하기(status 상태 변화)*/
    @Override
    @Transactional
    public void remove(RemoveReviewCommentDTO removeReviewCommentDTO) {
//        아이디 조회
        Optional<Member> findOne = memberRepository.findByIndex(removeReviewCommentDTO.getMemberIndex());
        if (findOne.isEmpty()) {
            throw new CustomException(CustomErrorCode.EMPTY_MEMBER);
        }
        Member member = findOne.get();
        log.info("일치하는 아이디가 있습니다.", member);

        // optional 예외처리 필수-> 앞에 optional 빼줌
        ReviewComment findReview = reviewCommentRepository.findById(removeReviewCommentDTO.getIndex())
                .orElseThrow(() -> new IllegalArgumentException("조회된 글이 없습니다."));
        findReview.changeReviewCommentStatus(); // 작성글 index 찾아서 status 값 바꿔주기
    }

    /*후기 댓글 수정하기*/
    @Override
    @Transactional
    public void update(UpdateReviewCommentDTO updateReviewCommentDTO) {
        // 회원 고유 index 값으로 회원 조회
        Optional<Member> findOne = memberRepository.findByIndex(updateReviewCommentDTO.getMemberIndex());
        if (findOne.isEmpty()) {
            throw new CustomException(CustomErrorCode.EMPTY_MEMBER);
        }
        Member member = findOne.get();
        Integer updateCount = reviewCommentRepository.updateReviewComment(new ReviewComment().UpdateReviewComment(updateReviewCommentDTO), LocalDateTime.now());
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

    /*공연 후기 리스트(페이지 사이즈 자른거)*/
    @Override
    public List<ReviewCommentDTO> searchAll(Pageable pageSize) {
        List<ReviewCommentDTO> reviewCommentDTOList = new ArrayList<>();
        List<ReviewComment> reviewCommentList = reviewCommentRepository.searchAllByLayerAndStatus(0, ReviewCommentStatus.ACTIVE, pageSize);

        for (ReviewComment e : reviewCommentList) {
            ReviewCommentDTO reviewCommentDTO = new ReviewCommentDTO().toDTO(e, e.getMember());
            reviewCommentDTOList.add(reviewCommentDTO);
        }
        return reviewCommentDTOList;
    }

    /*공연 후기 전체 리스트*/
    @Override

    public PagingReviewCommentDTO allComment(String productCode, Pageable pageable) {
        List<ReviewCommentDTO> reviewCommentDTOList = new ArrayList<>();

        Page<ReviewComment> pageReviewCommentList = reviewCommentRepository.findAllByProductCodeAndStatus(productCode, ReviewCommentStatus.ACTIVE, pageable);

        List<ReviewComment> reviewCommentList = pageReviewCommentList.getContent();
        Integer totalPages = pageReviewCommentList.getTotalPages();
        Integer page = pageReviewCommentList.getNumber() + 1;
        Long totalResults = pageReviewCommentList.getTotalElements();

        for (ReviewComment e : reviewCommentList) {
            ReviewCommentDTO reviewCommentDTO = new ReviewCommentDTO().toDTO(e,e.getMember());
            reviewCommentDTOList.add(reviewCommentDTO);
        }
        return new PagingReviewCommentDTO().toPageDTO(page, totalPages, totalResults, reviewCommentDTOList);
    }

    /*댓글 순서 정렬용*/
    public class ListComparator implements Comparator {
        @Override
        public int compare(Object o1, Object o2) {
            Long o1Index = ((ReviewComment) o1).getIndex();
            Long o2Index = ((ReviewComment) o2).getIndex();

            if (o1Index > o2Index) {
                return 1;
            } else {
                return -1;
            }
        }
    }
}
