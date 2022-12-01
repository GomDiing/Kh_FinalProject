package com.kh.finalproject.service;

import com.kh.finalproject.dto.seatPrice.SeatPriceDTO;

import java.util.List;

/**
 * 좌석/가격 서비스 인터페이스
 */
public interface SeatPriceService {
    /**
     * 상품별 좌석/가격 조회 메서드
     */
    SeatPriceDTO selectByProductCode(Long productCode);

    /**
     * 좌석/가격 전체 조회 메서드
     */
    List<SeatPriceDTO> selectAll();
}
