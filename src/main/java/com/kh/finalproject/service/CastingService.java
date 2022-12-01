package com.kh.finalproject.service;

import com.kh.finalproject.dto.casting.CastingDTO;

import java.util.List;

/**
 * 캐스팅 서비스 인터페이스
 */
public interface CastingService {
    /**
     * 상품별 캐스팅 정보 조회
     */
    CastingDTO selectByProductCode(Long productCode);

    /**
     * 예매시간별 캐스팅 조회()
     */
    List<CastingDTO> selectAllByReserveTime(Long ReserveTimeSeatPriceIndex);
}
