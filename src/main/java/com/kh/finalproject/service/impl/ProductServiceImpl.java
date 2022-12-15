package com.kh.finalproject.service.impl;

import com.kh.finalproject.dto.product.BrowseKeywordDTO;
import com.kh.finalproject.dto.product.DetailProductDTO;
import com.kh.finalproject.dto.product.ProductDTO;
import com.kh.finalproject.entity.Product;
import com.kh.finalproject.repository.ProductRepository;
import com.kh.finalproject.service.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    @Override
    public ProductDTO browseByKeyword(BrowseKeywordDTO browseKeywordDTO) {
        return null;
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
