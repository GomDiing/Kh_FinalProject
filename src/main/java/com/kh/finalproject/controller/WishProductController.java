package com.kh.finalproject.controller;

import com.kh.finalproject.dto.wishProduct.AddWishProductDTO;
import com.kh.finalproject.dto.wishProduct.DeleteWishProductDTO;
import com.kh.finalproject.dto.wishProduct.WishProductDTO;
import com.kh.finalproject.response.DefaultResponse;
import com.kh.finalproject.response.DefaultResponseMessage;
import com.kh.finalproject.response.StatusCode;
import com.kh.finalproject.service.WishProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 상품 찜하기 기능을 관리하는 API 컨트롤러
 * 찜하기 추가/취소 및 회원별 찜 목록 조회 기능 제공
 *
 * @author GomDiing
 */
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/wish")
@Slf4j
public class WishProductController {

    private final WishProductService wishProductService;

    /**
     * 상품 찜하기 추가
     *
     * @param addWishProductDTO 찜하기 추가 정보를 담은 DTO
     * @return 찜하기 추가 처리 결과와 찜하기 성공 메시지
     */
    @PostMapping("/add")
    public ResponseEntity<DefaultResponse<Object>> addWish(@Validated @RequestBody AddWishProductDTO addWishProductDTO){

        wishProductService.addWish(addWishProductDTO);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_ADD_WISH_PRODUCT), HttpStatus.OK);
    }

    /**
     * 상품 찜하기 취소
     *
     * @param deleteWishProductDTO 찜하기 취소 정보를 담은 DTO
     * @return 찜하기 취소 처리 결과와 취소 결과 메시지
     */
    @PostMapping("/cancel")
    public ResponseEntity<DefaultResponse<Object>> cancelWish(@Validated @RequestBody DeleteWishProductDTO deleteWishProductDTO){

        wishProductService.cancelWish(deleteWishProductDTO);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_CANCEL_WISH_PRODUCT), HttpStatus.OK);
    }

    /**
     * 특정 회원의 찜한 상품 목록 조회
     *
     * @param index 회원 식별자
     * @return 해당 회원이 찜한 상품 목록과 조회 결과 메시지
     */
    @GetMapping("{index}")
    public ResponseEntity<DefaultResponse<Object>> searchAllByMember(@PathVariable Long index) {

        List<WishProductDTO> wishProductDTOList = wishProductService.selectByMember(index);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_SEARCH_WISH_PRODUCT_BY_MEMBER, wishProductDTOList), HttpStatus.OK);
    }
}
