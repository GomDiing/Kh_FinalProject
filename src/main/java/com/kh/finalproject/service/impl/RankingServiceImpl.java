package com.kh.finalproject.service.impl;

import com.kh.finalproject.dto.ranking.*;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
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
        list.sort(Comparator.comparing(RankingWeekDTO::getRanking_order));

        log.info(list.toString());
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

    @Override
    public List<RankingRegionDTO> searchAllAboutRegion(Integer regionCode, Pageable pageSize) {

        String regionName = "서울";
        String regionNameNotContain = "옵션";

        switch (regionCode) {
            case 0:
                regionName = "서울";
                break;
            case 1:
                regionName = "경기";
                break;
            case 2:
                regionName = "대전";
                break;
            case 3:
                regionName = "부산";
                break;
            case 4:
                regionName = "경"; //경상남도, 경상북도, 경남, 경북 (경기도는 제외하도록)
                regionNameNotContain = "경기";
                break;
            case 5:
                regionName = "대구";
                break;
            case 6:
                regionName = "제주";
                break;
            case 7:
                regionName = "전"; //전남, 전라남도, 전북, 전라북도
                break;
            case 8:
                regionName = "인천";
                break;
            case 9:
                regionName = "충"; //충남 , 충북 , 충청남도, 충청북도
                break;
            case 10:
                regionName = "광주";
                break;
            case 11:
                regionName = "강원";
                break;
            case 12:
                regionName = "울산";
                break;

        }

        //초기화
        Page<Product> regionPageProductList;

        //지역별 조회,
        if (regionNameNotContain.equals("옵션")) {
            regionPageProductList = productRepository.findByDetailLocationStartsWith(regionName, pageSize);
        }
        else {
            regionPageProductList = productRepository.findByDetailLocationStartsWithAndDetailLocationNotContaining(regionName, regionNameNotContain, pageSize);
        }

        List<RankingRegionDTO> rankingRegionDTOList = new ArrayList<>();

        //Page 객체에서 추출
        List<Product> regionProductList = regionPageProductList.getContent();

        //값이 들어있다면
        if (!regionPageProductList.isEmpty()) {

            for (Product product : regionProductList) {
                List<ReserveTime> reserveTimeList = product.getReserveTimeList();
                boolean isReserveProduct = false;
                //예매 날짜가 현재 이후인 상품 조회
                for (ReserveTime reserveTime : reserveTimeList) {
                    if (reserveTime.getTime().isAfter(LocalDateTime.now())) {
                        isReserveProduct = true;
                    }
                }
                if (isReserveProduct) {
                    RankingRegionDTO rankingRegionDTO = new RankingRegionDTO().toDTO(product);
                    rankingRegionDTOList.add(rankingRegionDTO);
                }
            }
        }

        return rankingRegionDTOList;
    }
}
