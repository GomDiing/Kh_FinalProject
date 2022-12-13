package com.kh.finalproject.service;

import com.kh.finalproject.dto.statistics.StatisticsDTO;
import com.kh.finalproject.entity.Product;
import com.kh.finalproject.entity.Statistics;
import com.kh.finalproject.repository.ProductRepository;
import com.kh.finalproject.repository.StatisticsRepository;
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
        Optional<Product> findCode = productRepository.findByCode(code);

        // get code isNull Check!!
        if(findCode.isEmpty()) {
            throw new IllegalArgumentException("해당 상품코드를 찾을 수 없습니다.");
        }

        // 받아온 코드로 넣어줌 이제 이 엔티티는 해당 product code 에 해당하는 것만 보여준다.
        Optional<Statistics> stProductCode = statisticsRepository.findByProduct(findCode.get());

        if(stProductCode.isEmpty()) {
            throw new IllegalArgumentException("상품코드의 통계를 찾을 수 없습니다.");
        }

        // Entity -> DTO 변환
        StatisticsDTO statisticsDTO = new StatisticsDTO().toDTO(stProductCode.get(), findCode.get());

        return statisticsDTO;
    }
}