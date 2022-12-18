package com.kh.finalproject.controller;

import com.kh.finalproject.dto.product.BrowseKeywordDTO;
import com.kh.finalproject.dto.product.PagingProductDTO;
import com.kh.finalproject.dto.product.ProductDTO;
import com.kh.finalproject.dto.product.DetailProductDTO;
import com.kh.finalproject.response.DefaultResponse;
import com.kh.finalproject.response.DefaultResponseMessage;
import com.kh.finalproject.response.StatusCode;
import com.kh.finalproject.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/product")
@Slf4j
@CrossOrigin(origins = "http://localhost:3000")
public class ProductController {

    private final ProductService productService;

    @GetMapping("{code}")
    public ResponseEntity<DefaultResponse<Object>> searchProductDetail(@PathVariable String code) {
        DetailProductDTO detailProductDTO = productService.detailProductPage(code);
        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_SEARCH_PRODUCT_DETAIL, detailProductDTO), HttpStatus.OK);
    }

    /*관리자 페이지에서 전시글 관리용*/
    @GetMapping("/list")
    public ResponseEntity<DefaultResponse<Object>> productList(Pageable pageable){
        PagingProductDTO productList = productService.searchAll(pageable);
        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_SEARCH_PRODUCTLIST, productList), HttpStatus.OK);
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
