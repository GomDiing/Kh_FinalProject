//package com.kh.finalproject.controller;
//
//import com.kh.finalproject.dto.ranking.RankingDTO;
//import com.kh.finalproject.entity.enumurate.ProductCategory;
//import com.kh.finalproject.response.DefaultResponse;
//import com.kh.finalproject.response.StatusCode;
//import com.kh.finalproject.service.RankingService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.awt.print.Pageable;
//import java.util.List;
//
//@RequiredArgsConstructor
//@RestController
//@CrossOrigin(origins = "http://localhost:3000")
//@RequestMapping("/ranking")
//public class RankingController {
//    private final RankingService rankingService;
//
//    @GetMapping("/week/{category}}")
//    public ResponseEntity weekList(@PathVariable String category, Pageable pageable ){
//        ProductCategory productCategory = ProductCategory.valueOf(category);
//        List<RankingDTO> rankingWeek = rankingService.searchAllAboutWeek(productCategory, pageable);
//        return new ResponseEntity(DefaultResponse.res(StatusCode.OK, "주간랭킹조회가 완료", rankingWeek), HttpStatus.OK);
//    }
//    @GetMapping("/month")
//    public ResponseEntity monthList(@PathVariable String category, Pageable pageable ){
//        ProductCategory productCategory = ProductCategory.valueOf(category);
//        List<RankingDTO> rankingmonth = rankingService.searchAllAboutMonth();
//        return new ResponseEntity(DefaultResponse.res(StatusCode.OK, "주간랭킹조회가 완료", rankingmonth), HttpStatus.OK);
//    }
//    @GetMapping("/closeSoon")
//    public ResponseEntity closeSoon(@PathVariable String category, Pageable pageable ){
//        List<RankingDTO> rankingCloseSoon = rankingService.searchAllAboutCloseSoon();
//        return new ResponseEntity(DefaultResponse.res(StatusCode.OK, "주간랭킹조회가 완료", rankingCloseSoon), HttpStatus.OK);
//    }
//}
//
