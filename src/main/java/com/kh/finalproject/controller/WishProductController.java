package com.kh.finalproject.controller;

import com.kh.finalproject.dto.wishProduct.AddWishProductDTO;
import com.kh.finalproject.dto.wishProduct.DeleteWishProductDTO;
import com.kh.finalproject.response.DefaultResponse;
import com.kh.finalproject.response.DefaultResponseMessage;
import com.kh.finalproject.response.StatusCode;
import com.kh.finalproject.service.WishProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/wish")
@Slf4j
@CrossOrigin(origins = "http://localhost:3000")
public class WishProductController {

    private final WishProductService wishProductService;

    /**
     * 찜하기 누르기 컨트롤러
     */
    @PostMapping("/add")
    public ResponseEntity<DefaultResponse<Object>> addWish(@RequestBody AddWishProductDTO addWishProductDTO){

        wishProductService.addWish(addWishProductDTO);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_ADD_WISH_PRODUCT), HttpStatus.OK);
    }

    /**
     * 찜하기 취소 컨트롤러
     */
    @PostMapping("/cancel")
    public ResponseEntity<DefaultResponse<Object>> cancelWish(@RequestBody DeleteWishProductDTO deleteWishProductDTO){

        wishProductService.cancelWish(deleteWishProductDTO);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_CANCEL_WISH_PRODUCT), HttpStatus.OK);
    }

//    @GetMapping("{index}")
//    public ResponseEntity<DefaultResponse<Object>> searchAllBy
}
