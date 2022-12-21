package com.kh.finalproject.dto.product;

import com.kh.finalproject.entity.Product;
import lombok.Getter;
import org.springframework.data.domain.Page;

import java.util.List;

@Getter
public class BrowseKeywordPageDTO {
    List<BrowseKeywordDTO> browseKeywordDTOList;

//    public BrowseKeywordPageDTO toDTO(Page<Product> productList, List<BrowseKeywordDTO> browseKeywordDTOList) {
//        long totalElements = productList.getTotalElements();
//        int totalPages = productList.getTotalPages();
//        productList
//        this.browseKeywordDTOList = browseKeywordDTOList;
//    }
}
