package com.kh.finalproject.dto.ranking;

import com.kh.finalproject.entity.RankingWeek;
import lombok.Getter;

@Getter
public class RankingWeekDTO {

    private String code;
    private Integer ranking_order;
    private String category;
    private String status;
    private RankProductDTO product;

    public RankingWeekDTO toDTO(RankingWeek rankingWeek, RankProductDTO rankProductDTO) {
        this.code = rankingWeek.getCode();
        this.ranking_order = rankingWeek.getOrder();
        this.category = rankingWeek.getProductCategory().getCategory();
        this.status = rankingWeek.getRankStatus().getStatus();
        this.product = rankProductDTO;

        return this;
    }
}
