package com.kh.finalproject.controller;

import com.kh.finalproject.dto.product.BrowseKeywordDTO;
import com.kh.finalproject.dto.product.ProductDTO;
import com.kh.finalproject.response.DefaultResponse;
import com.kh.finalproject.response.DefaultResponseMessage;
import com.kh.finalproject.response.StatusCode;
import com.kh.finalproject.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RequiredArgsConstructor
@RestController
@Slf4j
@RequestMapping("/api/product")
public class ProductController {

    private final ProductService productService;

//    상품 전체 조회
    @GetMapping("/list")
    public ResponseEntity productList(){
        List<ProductDTO> productDTOList = productService.searchAll();
        return new ResponseEntity<>(productDTOList, HttpStatus.OK);
    }

    /**
     * 상품 제목으로 검색 기능 추가로 메인에서 필요한 기능 있으면 구현 예정
     */
    @GetMapping("/search")
    public ResponseEntity<DefaultResponse<Object>> productSearch(@RequestParam String title) {

        List<BrowseKeywordDTO> productDTOList = productService.browseByKeyword(title);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_MOVIE_SEARCH, productDTOList), HttpStatus.OK);
    }
}
