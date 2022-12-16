package com.kh.finalproject.service.impl;

import com.kh.finalproject.dto.product.BrowseKeywordDTO;
import com.kh.finalproject.dto.product.DetailProductDTO;
import com.kh.finalproject.dto.product.ProductDTO;
import com.kh.finalproject.entity.Product;
import com.kh.finalproject.exception.CustomErrorCode;
import com.kh.finalproject.exception.CustomException;
import com.kh.finalproject.repository.ProductRepository;
import com.kh.finalproject.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;

    @Transactional
    @Override
    public List<BrowseKeywordDTO> browseByKeyword(String title) {

        List<BrowseKeywordDTO> browseKeywordDTOList = new ArrayList<>();
        // 영어 대소문자 구분 없이, 한글 다 검색 가능
        if(title.matches(".*[a-zA-Z0-9 ㄱ-ㅎㅏ-ㅣ가-힣]+.*")) {
            List<Product> productList = productRepository.findByTitleContaining(title);
            for(Product product : productList) {
                BrowseKeywordDTO browseKeywordDTO = new BrowseKeywordDTO().toDTO(product);
                browseKeywordDTOList.add(browseKeywordDTO);
            }
        } else {
            throw new CustomException(CustomErrorCode.NOT_SEARCH_DATA);
        }
        return browseKeywordDTOList;
    }


    //    상품 전체 조회
    @Override
    public List<ProductDTO> searchAll() {
        List<ProductDTO> productDTOList = new ArrayList<>();
        List<Product> productList = productRepository.findAll();
        for(Product e : productList){
            ProductDTO productDTO = new ProductDTO().toDTO(e);
            productDTOList.add(productDTO);
        }
        return productDTOList;
    }

    @Override
    public DetailProductDTO detailProductPage(Long productCode) {
        return null;
    }
}
