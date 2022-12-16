package com.kh.finalproject.service.impl;

import com.kh.finalproject.dto.ranking.RankProductDTO;
import com.kh.finalproject.dto.ranking.RankingCloseDTO;
import com.kh.finalproject.dto.ranking.RankingMonDTO;
import com.kh.finalproject.dto.ranking.RankingWeekDTO;
import com.kh.finalproject.entity.Product;
import com.kh.finalproject.entity.RankingCloseSoon;
import com.kh.finalproject.entity.RankingMonth;
import com.kh.finalproject.entity.RankingWeek;
import com.kh.finalproject.entity.enumurate.ProductCategory;
import com.kh.finalproject.entity.enumurate.RankStatus;
import com.kh.finalproject.repository.ProductRepository;
import com.kh.finalproject.repository.RankingCloseRepository;
import com.kh.finalproject.repository.RankingMonRepository;
import com.kh.finalproject.repository.RankingWeekRepository;
import com.kh.finalproject.service.RankingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RankingServiceImpl implements RankingService {

    private final RankingWeekRepository rankingWeekRepository;
    private final ProductRepository productRepository;
    private final RankingMonRepository rankingMonRepository;
    private final RankingCloseRepository rankingCloseRepository;

    /**
     * 주간 랭킹 조회 서비스
     */
    @Override
    public List<RankingWeekDTO> searchAllAboutWeek(String category, Pageable pageSize) {

        List<RankingWeekDTO> weekDTOList = new ArrayList<>();

        // 크롤링이 완료된 랭킹 코드를 찾음
        List<RankingWeek> rankingCodeList = rankingWeekRepository.findAllByRankStatusAndProductCategoryOrderByOrder(RankStatus.COMPLETE, ProductCategory.valueOf(category), pageSize);

        for (RankingWeek rankingCode : rankingCodeList) {
            // 랭킹 코드에서 가져온 코드에 맞는 상품 정보를 다 가져옴
            Optional<Product> productList = productRepository.findByCode(rankingCode.getCode());

            if(productList.isPresent()) {
                RankProductDTO rankProductDTO = new RankProductDTO().toDTO(productList.get());
                weekDTOList.add(new RankingWeekDTO().toDTO(rankingCode, rankProductDTO));
            }
        }
        return weekDTOList;
    }

    @Override
    public List<RankingMonDTO> searchAllAboutMonth(String category, Pageable pageSize) {

        List<RankingMonDTO> monDTOList = new ArrayList<>();
        List<RankingMonth> rankingMonthList = rankingMonRepository.findAllByRankStatusAndProductCategoryOrderByOrder(RankStatus.COMPLETE, ProductCategory.valueOf(category), pageSize);

        for(RankingMonth rankingMonth : rankingMonthList) {
            Optional<Product> product = productRepository.findByCode(rankingMonth.getCode());

            if(product.isPresent()) {
                RankProductDTO rankProductDTO = new RankProductDTO().toDTO(product.get());
                monDTOList.add(new RankingMonDTO().toDTO(rankingMonth, rankProductDTO));
            }
        }
        return monDTOList;
    }

    @Override
    public List<RankingCloseDTO> searchAllAboutCloseSoon(String category, Pageable pageSize) {
        List<RankingCloseDTO> rankingCloseDTOS = new ArrayList<>();
        List<RankingCloseSoon> rankingCloseSoonList = rankingCloseRepository.findAllByRankStatusAndProductCategoryOrderByOrder(RankStatus.COMPLETE, ProductCategory.valueOf(category), pageSize);
        for(RankingCloseSoon rankingCloseSoon : rankingCloseSoonList) {
            Optional<Product> product = productRepository.findByCode(rankingCloseSoon.getCode());
            if(product.isPresent()) {
                RankProductDTO rankProductDTO = new RankProductDTO().toDTO(product.get());
                rankingCloseDTOS.add(new RankingCloseDTO().toDTO(rankingCloseSoon, rankProductDTO));
            }
        }
        return rankingCloseDTOS;
    }
}
