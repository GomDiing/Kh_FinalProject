package com.kh.finalproject.service;

/**
 * 좋아요 후기 서비스 인터페이스
 */
public interface ReviewLikeService {
    /**
     * 좋아요 추가
     */
    void addReviewLikeByMember(AddReviewLikeDTO addReviewLikeDTO);

    /**
     * 좋아요 제거
     */
    void removeReviewLikeByMember(RemoveReviewLikeDTO removeReviewLikeDTO);
}
