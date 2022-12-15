package com.kh.finalproject.service.impl;

import com.kh.finalproject.dto.product.ProductDTO;
import com.kh.finalproject.dto.ranking.RankProductDTO;
import com.kh.finalproject.dto.ranking.RankingMonDTO;
import com.kh.finalproject.dto.ranking.RankingWeekDTO;
import com.kh.finalproject.entity.Product;
import com.kh.finalproject.entity.RankingWeek;
import com.kh.finalproject.entity.enumurate.ProductCategory;
import com.kh.finalproject.entity.enumurate.RankStatus;
import com.kh.finalproject.exception.CustomErrorCode;
import com.kh.finalproject.exception.CustomException;
import com.kh.finalproject.repository.ProductRepository;
import com.kh.finalproject.repository.RankingRepository;
import com.kh.finalproject.service.RankingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RankingServiceImpl implements RankingService {

    private final RankingRepository rankingRepository;
    private final ProductRepository productRepository;

    /**
     * 주간 랭킹 조회 서비스
     */
    @Override
    public List<RankingWeekDTO> searchAllAboutWeek() {

        RankProductDTO productDTO = new RankProductDTO();
        List<RankingWeekDTO> weekDTOList = new ArrayList<>();
        // 크롤링이 완료된 랭킹 코드를 찾음
        List<RankingWeek> rankingCodeList = rankingRepository.findAllByRankStatus(RankStatus.COMPLETE);
        for (RankingWeek rankingCode : rankingCodeList) {
            // 랭킹 코드에서 가져온 코드에 맞는 상품 정보를 다 가져옴
            Optional<Product> productList = productRepository.findByCode(rankingCode.getCode());
            if(productList.isPresent()) {
                productDTO.toDTO(productList.get());
                weekDTOList.add(new RankingWeekDTO().toDTO(rankingCode, productDTO));
            }
        }
        return weekDTOList;
    }

    @Override
    public RankingMonDTO searchAllAboutMonth() {
         return null;
    }

    @Override
    public RankingMonDTO searchAllAboutCloseSoon() {
        return null;
    }
}
