
package com.kh.finalproject.controller;

import com.kh.finalproject.dto.statistics.StatisticsDTO;
import com.kh.finalproject.response.DefaultResponse;
import com.kh.finalproject.response.DefaultResponseMessage;
import com.kh.finalproject.response.StatusCode;
import com.kh.finalproject.service.StatisticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

/**
 * 상품 통계 정보를 제공하는 API 컨트롤러
 * 상품별 상세 통계 데이터 조회 기능 제공
 *
 * @author GomDiing
 */
@RequiredArgsConstructor
@RestController
@Slf4j
public class StatisticsController {
    public final StatisticsService statisticsService;

    /**
     * 특정 상품의 통계 정보 조회
     *
     * @param code 상품 코드
     * @return 해당 상품의 통계 정보를 담은 DTO와 조회 성공 메시지
     */
    @GetMapping("/product/detail/{code}")
    public ResponseEntity<DefaultResponse<StatisticsDTO>> getStat(@PathVariable String code){

        StatisticsDTO statisticsDTO = statisticsService.selectByIndex(code);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_SEARCH_STATIC, statisticsDTO), HttpStatus.OK);
    }
}