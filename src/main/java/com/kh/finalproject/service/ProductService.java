package com.kh.finalproject.service;

import com.kh.finalproject.dto.product.BrowseKeywordDTO;
import com.kh.finalproject.dto.product.PagingProductDTO;
import com.kh.finalproject.dto.product.DetailProductDTO;
import com.kh.finalproject.dto.reservetime.DetailProductReserveTimeDTO;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * 상품 서비스 인터페이스
 */
public interface ProductService {
    /**
     * 상품 검색 메서드
     */
    List<BrowseKeywordDTO> browseByKeyword(String keyword);

    /**
     * 상품 전체 조회 메서드
     */
    public PagingProductDTO searchAll(Pageable pageable);


    /**
     * 상품 상세페이지 메서드
     */
    DetailProductDTO detailProductPage(String productCode);

    DetailProductDTO reserveCalendarMonth(String productCode, Integer year, Integer month);

    List<DetailProductReserveTimeDTO> reserveCalendarDay(String productCode, Integer year, Integer month, Integer day);
}
