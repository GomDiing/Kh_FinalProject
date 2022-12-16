package com.kh.finalproject.controller;


import com.kh.finalproject.dto.ranking.RankingMonDTO;
import com.kh.finalproject.dto.ranking.RankingWeekDTO;
import com.kh.finalproject.response.DefaultResponse;
import com.kh.finalproject.response.DefaultResponseMessage;
import com.kh.finalproject.response.StatusCode;
import com.kh.finalproject.service.RankingService;
import lombok.RequiredArgsConstructor;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/ranking")
public class RankingController {

    private final RankingService rankingService;

    @GetMapping("/week")
    public ResponseEntity<DefaultResponse<Object>> weekRankProduct() {

        List<RankingWeekDTO> rankingWeekDTOList = rankingService.searchAllAboutWeek();

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_PRODUCT_WEEK, rankingWeekDTOList), HttpStatus.OK);
    }

    @GetMapping("/month")
    public ResponseEntity<DefaultResponse<Object>> monthRankProduct() {

        List<RankingMonDTO> rankingMonDTOList = rankingService.searchAllAboutMonth();

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_PRODUCT_MONTH, rankingMonDTOList), HttpStatus.OK);
    }
}

