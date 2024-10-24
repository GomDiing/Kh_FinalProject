package com.kh.finalproject.controller;

import com.kh.finalproject.dto.chart.ChartDTO;
import com.kh.finalproject.response.DefaultResponse;
import com.kh.finalproject.response.DefaultResponseMessage;
import com.kh.finalproject.response.StatusCode;
import com.kh.finalproject.service.ChartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 관리자용 차트 데이터 제공 API 컨트롤러
 * 전체 차트 데이터 조회, 특정 기간 차트 데이터 조회 기능 제공
 *
 * @author GomDiing
 */
@RequiredArgsConstructor
@RestController
@Slf4j
public class ChartController {

    public final ChartService chartService;

    /**
     * 전체 기간 데이터 조회
     *
     * @return 전체 차트 데이터 목록과 응답 메시지
     */
    @GetMapping("/admin/chart")
    public ResponseEntity<DefaultResponse<List<ChartDTO>>> getChart(){

        List<ChartDTO> chartDTOList = chartService.searchByIndex();

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_SEARCH_CHART, chartDTOList), HttpStatus.OK);
    }

    /**
     * 지정된 기간 차트 데이터 조회
     *
     * @param count 조회할 데이터 기간 수
     * @return 지정된 기간 내 차트 데이터 목록과 응답 메시지
     */
    @GetMapping("/admin/chart/{count}")
    public ResponseEntity<DefaultResponse<List<ChartDTO>>> getChartList(@PathVariable Integer count) {

        List<ChartDTO> chartDTOList = chartService.searchChartList(count);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_SEARCH_CHART, chartDTOList), HttpStatus.OK);
    }
}