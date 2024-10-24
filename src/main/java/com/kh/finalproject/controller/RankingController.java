package com.kh.finalproject.controller;


import com.kh.finalproject.dto.ranking.RankingCloseDTO;
import com.kh.finalproject.dto.ranking.RankingMonDTO;
import com.kh.finalproject.dto.ranking.RankingRegionDTO;
import com.kh.finalproject.dto.ranking.RankingWeekDTO;
import com.kh.finalproject.response.DefaultResponse;
import com.kh.finalproject.response.DefaultResponseMessage;
import com.kh.finalproject.response.StatusCode;
import com.kh.finalproject.service.RankingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 상품 랭킹 정보를 제공하는 API 컨트롤러
 * 주간/월간 랭킹, 마감임박 상품, 지역별 상품 정보를 조회하는 기능 제공
 *
 * @author GomDiing
 */
@RequiredArgsConstructor
@RestController
@RequestMapping("/ranking")
public class RankingController {

    private final RankingService rankingService;

    /**
     * 카테고리별 주간 랭킹 상품 목록 조회
     *
     * @param category 조회할 카테고리
     * @param size 페이징 정보
     * @return 주간 랭킹 상품 목록과 상품 응답 메시지
     */
    @GetMapping("/week")
    public ResponseEntity<DefaultResponse<Object>> weekRankProduct(@RequestParam String category,
                                                                   @PageableDefault(size = 500) Pageable size) {

        List<RankingWeekDTO> rankingWeekDTOList = rankingService.searchAllAboutWeek(category, size);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_PRODUCT_WEEK, rankingWeekDTOList), HttpStatus.OK);
    }

    /**
     * 카테고리별 월간 랭킹 상품 목록 조회
     *
     * @param category 조회할 카테고리
     * @param size 페이징 정보
     * @return 월간 랭킹 상품 목록과 상품 응답 메시지
     */
    @GetMapping("/month")
    public ResponseEntity<DefaultResponse<Object>> monthRankProduct(@RequestParam String category,
                                                                    @PageableDefault(size = 500) Pageable size) {

        List<RankingMonDTO> rankingMonDTOList = rankingService.searchAllAboutMonth(category, size);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_PRODUCT_MONTH, rankingMonDTOList), HttpStatus.OK);
    }

    /**
     * 카테고리별 마감 임박 상품 목록 조회
     *
     * @param category 조회할 카테고리
     * @param size 페이징 정보
     * @return 마감 임박 상품 목록 및 상품 응답 메시지
     */
    @GetMapping("/close")
    public ResponseEntity<DefaultResponse<Object>> closeRankProduct(@RequestParam String category,
                                                                    @PageableDefault(size = 500) Pageable size) {

        List<RankingCloseDTO> rankingCloseDTOList = rankingService.searchAllAboutCloseSoon(category, size);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_PRODUCT_CLOSE, rankingCloseDTOList), HttpStatus.OK);

    }

    /**
     * 지역별 상품 목록 조회
     *
     * @param regionCode 조회할 지역 코드
     * @param size 페이징 정보
     * @return 해당 지역 상품 목록 및 상품 응답 메시지
     */
    @GetMapping("/region")
    public ResponseEntity<DefaultResponse<Object>> regionProduct(@RequestParam Integer regionCode,
                                                                 @PageableDefault(size = 500) Pageable size) {

        List<RankingRegionDTO> rankingRegionDTOList = rankingService.searchAllAboutRegion(regionCode, size);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_PRODUCT_REGION, rankingRegionDTOList), HttpStatus.OK);
    }
}

