package com.kh.finalproject.service.impl;

import com.kh.finalproject.dto.statistics.StatisticsDTO;
import com.kh.finalproject.entity.Product;
import com.kh.finalproject.entity.Statistics;
import com.kh.finalproject.exception.CustomErrorCode;
import com.kh.finalproject.exception.CustomException;
import com.kh.finalproject.repository.ProductRepository;
import com.kh.finalproject.repository.StatisticsRepository;
import com.kh.finalproject.service.StatisticsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class StatisticsServiceImpl implements StatisticsService {

    private final StatisticsRepository statisticsRepository;
    private final ProductRepository productRepository;

    @Override
    public StatisticsDTO selectByIndex(String code) {

        // Product Entity -> code get.
        // get code isNull Check!!
        Product findCode = productRepository.findByCode(code)
                .orElseThrow(() -> new CustomException(CustomErrorCode.ERROR_EMPTY_PRODUCT_CODE));

        // 받아온 코드로 넣어줌 이제 이 엔티티는 해당 product code 에 해당하는 것만 보여준다.
        Statistics stProductCode = statisticsRepository.findByProduct(findCode)
                .orElseThrow(() -> new CustomException(CustomErrorCode.ERROR_EMPTY_STATIC_BY_PRODUCT_CODE));

        // Entity -> DTO 변환
        return new StatisticsDTO().toDTO(stProductCode, findCode);
    }
}