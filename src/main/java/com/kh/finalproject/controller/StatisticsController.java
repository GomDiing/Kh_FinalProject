


package com.kh.finalproject.controller;

import com.kh.finalproject.dto.notice.NoticeDTO;
import com.kh.finalproject.dto.statistics.StatisticsDTO;
import com.kh.finalproject.service.StatisticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RestController
@CrossOrigin(origins = "http://localhost:3000")
@Slf4j
// 잘못 만든것 같습니다...
public class StatisticsController {
    public final StatisticsService statisticsService;

    @GetMapping("/product/detail/{code}")
    public ResponseEntity getStat(@PathVariable String code){
        List<StatisticsDTO> statisticsDTOList = statisticsService.selectByIndex(code);
        return new ResponseEntity<>(statisticsDTOList, HttpStatus.OK);
    }
}