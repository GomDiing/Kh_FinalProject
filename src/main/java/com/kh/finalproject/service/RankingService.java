package com.kh.finalproject.service;

import com.kh.finalproject.dto.ranking.RankingCloseDTO;
import com.kh.finalproject.dto.ranking.RankingMonDTO;
import com.kh.finalproject.dto.ranking.RankingWeekDTO;

import java.util.List;
import java.util.Map;

/**
 * 순위 상품 서비스 인터페이스
 */
public interface RankingService {
    /**
     * 주간 순위 상품 조회 메서드
     */
    List<RankingWeekDTO> searchAllAboutWeek();

    /**
     * 월간 순위 상품 조회 메서드
     */
    List<RankingMonDTO> searchAllAboutMonth();

    /**
     * 곧 종료 예정 순위 상품 조회 메서드
     */
    List<RankingCloseDTO> searchAllAboutCloseSoon();
}
