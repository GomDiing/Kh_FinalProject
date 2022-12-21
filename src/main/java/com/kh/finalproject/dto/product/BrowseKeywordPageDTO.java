package com.kh.finalproject.dto.product;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.kh.finalproject.entity.Product;
import lombok.Getter;
import org.springframework.data.domain.Page;

import java.util.List;

@Getter
public class BrowseKeywordPageDTO {
    //조회한 전체 상품 개수
    @JsonProperty("total_elements")
    long totalElements;

    //조회한 전체 페이지 개수
    @JsonProperty("total_pages")
    int totalPages;

    //조회한 페이지 크기
    int size;

    //현재 페이지 위치
    int number;

    //페이지 내용물
    @JsonProperty("content")
    List<BrowseKeywordDTO> browseKeywordDTOList;

    public BrowseKeywordPageDTO toDTO(Page<Product> productList, List<BrowseKeywordDTO> browseKeywordDTOList) {
        this.totalElements = productList.getTotalElements();
        this.totalPages = productList.getTotalPages();
        this.size = productList.getSize();
        this.number = productList.getNumber();
        this.browseKeywordDTOList = browseKeywordDTOList;

        return this;
    }
}
