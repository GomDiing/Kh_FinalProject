package com.kh.finalproject.service;

import com.kh.finalproject.dto.product.BrowseKeywordDTO;
import com.kh.finalproject.dto.product.BrowseKeywordPageDTO;
import com.kh.finalproject.dto.product.PagingProductDTO;
import com.kh.finalproject.dto.product.DetailProductDTO;
import com.kh.finalproject.dto.reservetime.DetailProductReserveTimeDTO;
import com.kh.finalproject.dto.reservetime.DetailProductReserveTimeSetDTO;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * 상품 서비스 인터페이스
 */
public interface ProductService {
    /**
     * 상품 검색 메서드
     */
    BrowseKeywordPageDTO browseByKeyword(String keyword, Pageable pageable);

    /**
     * 상품 전체 조회 메서드
     */
    public PagingProductDTO searchAll(Pageable pageable);


    /**
     * 상품 상세페이지 메서드
     */
    DetailProductDTO detailProductPage(String productCode);

    DetailProductDTO reserveCalendarMonth(String productCode, Integer year, Integer month);

    DetailProductReserveTimeSetDTO reserveCalendarDay(String productCode, Integer year, Integer month, Integer day);
}
