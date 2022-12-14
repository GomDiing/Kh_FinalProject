


package com.kh.finalproject.controller;

import com.kh.finalproject.dto.notice.NoticeDTO;
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

import java.util.List;

@RequiredArgsConstructor
@RestController
@Slf4j
public class StatisticsController {
    public final StatisticsService statisticsService;

    @GetMapping("/product/detail/{code}")
    public ResponseEntity<DefaultResponse<Object>> getStat(@PathVariable String code){

        StatisticsDTO statisticsDTO = statisticsService.selectByIndex(code);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_MOVIE_INQUIRE, statisticsDTO), HttpStatus.OK);
    }
}