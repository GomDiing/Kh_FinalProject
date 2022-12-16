package com.kh.finalproject.dto.ranking;


import com.kh.finalproject.entity.RankingCloseSoon;
import lombok.Getter;

@Getter
public class RankingCloseDTO {
    private String code;
    private Integer ranking_order;
    private String category;
    private String status;
    private RankProductDTO product;

    public RankingCloseDTO toDTO(RankingCloseSoon rankingCloseSoon, RankProductDTO rankProductDTO) {
        this.code = rankingCloseSoon.getCode();
        this.ranking_order = rankingCloseSoon.getOrder();
        this.category = rankingCloseSoon.getProductCategory().getCategory();
        this.status = rankingCloseSoon.getRankStatus().getStatus();
        this.product = rankProductDTO;
        return this;
    }
}
