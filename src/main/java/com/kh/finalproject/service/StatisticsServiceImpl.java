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
    public List<StatisticsDTO> selectByIndex(String code) {
        List<StatisticsDTO> statisticsDTOList = new ArrayList<>();
        List<Statistics> statistics = statisticsRepository.findAll();
        Optional<Product> findIndex = productRepository.findByCode(code);

        if(findIndex.isEmpty()) {
            throw new IllegalArgumentException("상품정보에 해당하는 통계정보가 없습니다.");
        }
        for(Statistics e : statistics) {
            StatisticsDTO statisticsDTO = new StatisticsDTO().toDTO(e, findIndex.get());
            statisticsDTOList.add(statisticsDTO);
            System.out.println(statisticsDTOList);
        }
        return statisticsDTOList;
    }
}