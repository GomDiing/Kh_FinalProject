package com.kh.finalproject.controller;

import com.kh.finalproject.dto.product.BrowseKeywordPageDTO;
import com.kh.finalproject.dto.product.DetailProductDTO;
import com.kh.finalproject.dto.product.DetailRequestDTO;
import com.kh.finalproject.dto.product.PagingProductDTO;
import com.kh.finalproject.dto.reservetime.DetailProductReserveTimeSetDTO;
import com.kh.finalproject.response.DefaultResponse;
import com.kh.finalproject.response.DefaultResponseMessage;
import com.kh.finalproject.response.StatusCode;
import com.kh.finalproject.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

/**
 * 전시/공연 상품 관리를 위한 API 컨트롤러
 * 상품 상세 조회, 예약 일정 관리, 검색 기능을 제공,
 * 관리자용 상품 목록 조회를 지원
 *
 * @author GomDiing
 */
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/product")
@Slf4j
public class ProductController {

    private final ProductService productService;

    /**
     * 상품의 상세 정보를 조회합니다.
     * 회원인 경우 회원별 맞춤 정보도 함께 제공합니다.
     *
     * @param code       상품 코드
     * @param requestDTO 회원 정보(선택)
     * @return 상품 상세 정보와 상세 상품 조회 성공 응답 메시지
     */
    @GetMapping("/{code}")
    public ResponseEntity<DefaultResponse<DetailProductDTO>> searchProductDetail(@PathVariable String code,
                                                                                 @RequestBody(required = false) DetailRequestDTO requestDTO) {
        //회원 인덱스가 존재하지않으면 -1, 존재하면 해당 값 매핑
        Long isMemberIndex = (long) -1;
        if (!Objects.isNull(requestDTO))
            if (!Objects.isNull(requestDTO.getMemberIndex()))
                isMemberIndex = requestDTO.getMemberIndex();

        DetailProductDTO detailProductDTO = productService.detailProductPage(code, isMemberIndex);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_SEARCH_PRODUCT_DETAIL, detailProductDTO), HttpStatus.OK);
    }

    /**
     * 특정 연월의 예약 현황을 조회합니다.
     *
     * @param code  상품 코드
     * @param year  조회 연도
     * @param month 조회 월
     * @return 해당 월의 예약 현황과 조회 성공 응답 메시지
     */
    @GetMapping("/{code}/{year}/{month}")
    public ResponseEntity<DefaultResponse<DetailProductDTO>> searchReserveList(@PathVariable String code,
                                                                               @PathVariable Integer year,
                                                                               @PathVariable Integer month) {

        DetailProductDTO detailProductDTO = productService.reserveCalendarMonth(code, year, month);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_SEARCH_YEAR_MONTH_RESERVE, detailProductDTO), HttpStatus.OK);
    }

    /**
     * 특정 일의 예약 현황을 조회합니다.
     *
     * @param code  상품 코드
     * @param year  조회 연도
     * @param month 조회 월
     * @param day   조회 일
     * @return 해당 일의 예약 현황과 조회 성공 응답 메시지
     */
    @GetMapping("/{code}/{year}/{month}/{day}")
    public ResponseEntity<DefaultResponse<DetailProductReserveTimeSetDTO>> searchReserveList(@PathVariable String code,
                                                                                             @PathVariable Integer year,
                                                                                             @PathVariable Integer month,
                                                                                             @PathVariable Integer day) {

        log.info("code = {}, year = {}, month = {}", code, year, month);

        DetailProductReserveTimeSetDTO detailProductReserveTimeSetDTO = productService.reserveCalendarDay(code, year, month, day);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_SEARCH_DAY_RESERVE, detailProductReserveTimeSetDTO), HttpStatus.OK);
    }

    /**
     * 상품 목록 페이징하여 조회
     *
     * @param pageable 페이징 정보
     * @return 상품 목록 리스트 페이징 정보 및 조회 성공 응답 메시지
     */
    @GetMapping("/list")
    public ResponseEntity<DefaultResponse<PagingProductDTO>> productList(Pageable pageable) {

        PagingProductDTO productList = productService.searchAll(pageable);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_SEARCH_PRODUCTLIST, productList), HttpStatus.OK);
    }

    /**
     * 상품 제목 페이징하여 조회
     *
     * @param title    검색할 상품 제목
     * @param pageable 페이징 정보
     * @return 검색된 상품 목록
     */
    @GetMapping("/search")
    public ResponseEntity<DefaultResponse<BrowseKeywordPageDTO>> productSearch(@RequestParam String title, Pageable pageable) {

        BrowseKeywordPageDTO browseKeywordPageDTO = productService.browseByKeyword(title, pageable);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_MOVIE_SEARCH, browseKeywordPageDTO), HttpStatus.OK);
    }
}