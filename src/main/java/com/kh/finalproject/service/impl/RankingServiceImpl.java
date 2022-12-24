package com.kh.finalproject.service.impl;

import com.kh.finalproject.dto.ranking.RankProductDTO;
import com.kh.finalproject.dto.ranking.RankingCloseDTO;
import com.kh.finalproject.dto.ranking.RankingMonDTO;
import com.kh.finalproject.dto.ranking.RankingWeekDTO;
import com.kh.finalproject.entity.*;
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

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

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

        List<RankingWeekDTO> weekDTOList = new LinkedList<>();

        // 크롤링이 완료된 랭킹 코드를 찾음
        List<RankingWeek> rankingCodeList = rankingWeekRepository.findAllByRankStatusAndProductCategoryOrderByOrder(RankStatus.COMPLETE, ProductCategory.valueOf(category), pageSize);

        for (RankingWeek rankingCode : rankingCodeList) {
            // 랭킹 코드에서 가져온 코드에 맞는 상품 정보를 다 가져옴
            Optional<Product> productList = productRepository.findByCode(rankingCode.getCode());

            if(productList.isPresent()) {
                List<ReserveTime> reserveTimeList = productList.get().getReserveTimeList();
                boolean isReserveProduct = false;
                for (ReserveTime reserveTime : reserveTimeList) {
                    if (reserveTime.getTime().isAfter(LocalDateTime.now())) {
                        isReserveProduct = true;
                    }
                }
                if (isReserveProduct) {
                    RankProductDTO rankProductDTO = new RankProductDTO().toDTO(productList.get());
                    weekDTOList.add(new RankingWeekDTO().toDTO(rankingCode, rankProductDTO));
                }
            }
        }

        Set<RankingWeekDTO> set = new HashSet<>(weekDTOList);
        List<RankingWeekDTO> list = new ArrayList<>(set);
        return list;
    }

    @Override
    public List<RankingMonDTO> searchAllAboutMonth(String category, Pageable pageSize) {

        List<RankingMonDTO> monDTOList = new ArrayList<>();
        List<RankingMonth> rankingMonthList = rankingMonRepository.findAllByRankStatusAndProductCategoryOrderByOrder(RankStatus.COMPLETE, ProductCategory.valueOf(category), pageSize);

        for (RankingMonth rankingCode : rankingMonthList) {
            // 랭킹 코드에서 가져온 코드에 맞는 상품 정보를 다 가져옴
            Optional<Product> productList = productRepository.findByCode(rankingCode.getCode());

            if(productList.isPresent()) {
                List<ReserveTime> reserveTimeList = productList.get().getReserveTimeList();
                boolean isReserveProduct = false;
                for (ReserveTime reserveTime : reserveTimeList) {
                    if (reserveTime.getTime().isAfter(LocalDateTime.now())) {
                        isReserveProduct = true;
                    }
                }
                if (isReserveProduct) {
                    RankProductDTO rankProductDTO = new RankProductDTO().toDTO(productList.get());
                    monDTOList.add(new RankingMonDTO().toDTO(rankingCode, rankProductDTO));
                }
            }
        }
        return monDTOList;
    }

    @Override
    public List<RankingCloseDTO> searchAllAboutCloseSoon(String category, Pageable pageSize) {
        List<RankingCloseDTO> rankingCloseDTOS = new ArrayList<>();
        List<RankingCloseSoon> rankingCloseSoonList = rankingCloseRepository.findAllByRankStatusAndProductCategoryOrderByOrder(RankStatus.COMPLETE, ProductCategory.valueOf(category), pageSize);
        for (RankingCloseSoon rankingCode : rankingCloseSoonList) {
            // 랭킹 코드에서 가져온 코드에 맞는 상품 정보를 다 가져옴
            Optional<Product> productList = productRepository.findByCode(rankingCode.getCode());

            if(productList.isPresent()) {
                List<ReserveTime> reserveTimeList = productList.get().getReserveTimeList();
                boolean isReserveProduct = false;
                for (ReserveTime reserveTime : reserveTimeList) {
                    if (reserveTime.getTime().isAfter(LocalDateTime.now())) {
                        isReserveProduct = true;
                    }
                }
                if (isReserveProduct) {
                    RankProductDTO rankProductDTO = new RankProductDTO().toDTO(productList.get());
                    rankingCloseDTOS.add(new RankingCloseDTO().toDTO(rankingCode, rankProductDTO));
                }
            }
        }
        return rankingCloseDTOS;
    }
}
