package com.kh.finalproject.service;

import com.kh.finalproject.dto.ranking.RankingDTO;

/**
 * 순위 상품 서비스 인터페이스
 */
public interface RankingService {
    /**
     * 주간 순위 상품 조회 메서드
     */
    RankingDTO searchAllAboutWeek();

    /**
     * 월간 순위 상품 조회 메서드
     */
    RankingDTO searchAllAboutMonth();

    /**
     * 곧 종료 예정 순위 상품 조회 메서드
     */
    RankingDTO searchAllAboutCloseSoon();
}
