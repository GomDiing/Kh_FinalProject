package com.kh.finalproject.dto.product;

import lombok.Getter;
import java.util.ArrayList;
import java.util.List;

@Getter
public class PagingProductDTO {
    private Integer page; // 현재페이지
    private Integer totalPages; //총페이지
    private Long totalResults;
    private List<ProductDTO> productDTOList = new ArrayList<>();

    public PagingProductDTO toPageDTO(Integer page, Integer totalPages, Long totalResults, List<ProductDTO> productDTOList) {
        this.page = page;
        this.totalPages = totalPages;
        this.totalResults = totalResults;
        this.productDTOList = productDTOList;

        return this;
    }
}
