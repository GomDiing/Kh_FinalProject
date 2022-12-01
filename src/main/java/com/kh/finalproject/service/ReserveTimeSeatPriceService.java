package com.kh.finalproject.service;

import com.kh.finalproject.dto.reserveTimeSeatPrice.ReserveTimeSeatPriceDTO;

import java.util.List;

/**
 * 예매시간 좌석/가격 서비스 인터페이스
 */
public interface ReserveTimeSeatPriceService {
    /**
     * 상품별 모든 좌석/가격 조회
     */
    List<ReserveTimeSeatPriceDTO> selectAllByProductCOde(Long productCode);

    /**
     * 예매시간별 모든 좌석/가격 조회
     */
    List<ReserveTimeSeatPriceDTO> selectAllByReserveTime(Long reserveTimeIndex);
}
