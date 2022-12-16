package com.kh.finalproject.controller;


import com.kh.finalproject.dto.ranking.RankingCloseDTO;
import com.kh.finalproject.dto.ranking.RankingMonDTO;
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

@RequiredArgsConstructor
@RestController
@RequestMapping("/ranking")
public class RankingController {

    private final RankingService rankingService;

    @GetMapping("/week")
    public ResponseEntity<DefaultResponse<Object>> weekRankProduct(@RequestParam String category, @PageableDefault(size = 500) Pageable size) {

        List<RankingWeekDTO> rankingWeekDTOList = rankingService.searchAllAboutWeek(category, size);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_PRODUCT_WEEK, rankingWeekDTOList), HttpStatus.OK);
    }

    @GetMapping("/month")
    public ResponseEntity<DefaultResponse<Object>> monthRankProduct(@RequestParam String category, @PageableDefault(size = 500) Pageable size) {

        List<RankingMonDTO> rankingMonDTOList = rankingService.searchAllAboutMonth(category, size);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_PRODUCT_MONTH, rankingMonDTOList), HttpStatus.OK);
    }
    @GetMapping("/close")
    public ResponseEntity<DefaultResponse<Object>> closeRankProduct(@RequestParam String category, @PageableDefault(size = 500) Pageable size) {

        List<RankingCloseDTO> rankingCloseDTOList = rankingService.searchAllAboutCloseSoon(category, size);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_PRODUCT_CLOSE, rankingCloseDTOList), HttpStatus.OK);

    }
}

