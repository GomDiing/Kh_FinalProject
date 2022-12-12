package com.kh.finalproject.controller;

import com.kh.finalproject.dto.product.ProductDTO;
import com.kh.finalproject.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RequiredArgsConstructor
@RestController
@CrossOrigin(origins = "http://localhost:3000")
@Slf4j
public class ProductController {

    private final ProductService productService;

//    상품 전체 조회
    @GetMapping("/product")
    public ResponseEntity productList(){
        List<ProductDTO> productDTOList = productService.searchAll();
        return new ResponseEntity<>(productDTOList, HttpStatus.OK);
    }
}
