package com.kh.finalproject.service;

import com.kh.finalproject.dto.wishProduct.AddWishProductDTO;
import com.kh.finalproject.dto.wishProduct.DeleteWishProductDTO;
import com.kh.finalproject.dto.wishProduct.WishProductDTO;

import java.util.List;

/**
 * 찜하기 서비스 인터페이스
 */
public interface WishProductService {
    /**
     * 찜하기 추가 메서드
     */
    void addWish(AddWishProductDTO addWishProductDTO);

    /**
     * 찜하기 제거 메서드
     * 이 메서드는 해당 레코드를 실제로 제거
     */
    void cancelWish(DeleteWishProductDTO deleteWishProductDTO);

    /**
     * 회원으로 찜하기 조회 메서드
     */
    List<WishProductDTO> selectByMember(Long memberIndex);

    /**
     * 찜하기 전체 조회 메서드
     */
    List<WishProductDTO> selectAll();
}
