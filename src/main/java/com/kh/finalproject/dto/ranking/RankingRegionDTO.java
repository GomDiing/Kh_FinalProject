package com.kh.finalproject.dto.ranking;

import com.kh.finalproject.entity.Product;
import lombok.Getter;

@Getter
public class RankingRegionDTO {
    private String poster_url;
    private String title;
    private String location;
    private String period_start;
    private String period_end;

    public RankingRegionDTO toDTO(Product product) {
        this.poster_url = product.getThumbPosterUrl();
        this.title = product.getTitle();
        this.location = product.getLocation();
        this.period_start = product.getPeriodStart();
        this.period_end = product.getPeriodEnd();

        if(product.getPeriodEnd() == null) {
            this.period_end = "당일 공연";
        } else {
            this.period_end = product.getPeriodEnd();
        }

        return this;
    }
}
