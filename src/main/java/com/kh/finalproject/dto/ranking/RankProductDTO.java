package com.kh.finalproject.dto.ranking;

import com.kh.finalproject.entity.Product;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RankProductDTO {
    private String posterUrl;
    private String title;
    private String location;
    private String periodStart;
    private String periodEnd;

    public RankProductDTO toDTO(Product product) {
        this.posterUrl = product.getThumbPosterUrl();
        this.title = product.getTitle();
        this.location = product.getLocation();
        this.periodStart = product.getPeriodStart();
        this.periodEnd = product.getPeriodEnd();

        return this;
    }
}
