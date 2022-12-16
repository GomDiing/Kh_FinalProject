package com.kh.finalproject.service;

import com.kh.finalproject.dto.product.BrowseKeywordDTO;
import com.kh.finalproject.dto.product.DetailProductDTO;
import com.kh.finalproject.dto.product.ProductDTO;

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
    List<ProductDTO> searchAll();

    /**
     * 상품 상세페이지 메서드
     */
    DetailProductDTO detailProductPage(Long productCode);
}
