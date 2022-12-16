package com.kh.finalproject.dto.ranking;

import com.kh.finalproject.entity.RankingMonth;
import com.kh.finalproject.entity.RankingWeek;
import lombok.Getter;

/**
 * 순위 상품 DTO
 */
@Getter
public class RankingMonDTO {
    private String code;
    private Integer ranking_order;
    private String category;
    private String status;
    private RankProductDTO product;

    public RankingMonDTO toDTO(RankingMonth rankingMonth, RankProductDTO rankProductDTO) {
        this.code = rankingMonth.getCode();
        this.ranking_order = rankingMonth.getOrder();
        this.category = rankingMonth.getProductCategory().getCategory();
        this.status = rankingMonth.getRankStatus().getStatus();
        this.product = rankProductDTO;

        return this;
    }
}
