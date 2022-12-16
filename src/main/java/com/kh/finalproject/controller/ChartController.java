package com.kh.finalproject.controller;

import com.kh.finalproject.dto.chart.ChartDTO;
import com.kh.finalproject.dto.member.MemberDTO;
import com.kh.finalproject.response.DefaultErrorResponse;
import com.kh.finalproject.response.DefaultResponse;
import com.kh.finalproject.response.DefaultResponseMessage;
import com.kh.finalproject.response.StatusCode;
import com.kh.finalproject.service.ChartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@Slf4j
public class ChartController {
    public final ChartService chartService;

    @GetMapping("/admin/chart")
    public ResponseEntity<DefaultResponse<Object>> getChart(){
        List<ChartDTO> chartDTOList = chartService.searchByIndex();
        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_SEARCH_CHART, chartDTOList), HttpStatus.OK);
    }
}