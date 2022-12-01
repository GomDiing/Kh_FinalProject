package com.kh.finalproject.service;

import com.kh.finalproject.dto.reviewLike.AddReviewLikeDTO;
import com.kh.finalproject.dto.reviewLike.RemoveReviewLikeDTO;

/**
 * 좋아요 후기 서비스 인터페이스
 */
public interface ReviewLikeService {
    /**
     * 좋아요 추가 메서드
     */
    void create(AddReviewLikeDTO addReviewLikeDTO);

    /**
     * 좋아요 제거 메서드
     * 이 메서드는 해당 레코드를 실제로 제거
     */
    void delete(RemoveReviewLikeDTO removeReviewLikeDTO);
}
