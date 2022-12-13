package com.kh.finalproject.dto.statistics;

import com.kh.finalproject.entity.Product;
import com.kh.finalproject.entity.Statistics;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class StatisticsDTO {
    private Long index;
    private Float male;
    private Float female;
    private Float teen;
    private Float twenties;
    private Float thirties;
    private Float forties;
    private Float fifties;
    private String product_code;

    public StatisticsDTO toDTO(Statistics statistics, Product product) {
        this.male= statistics.getMale();
        this.female = statistics.getFemale();
        this.teen = statistics.getTeen();
        this.twenties = statistics.getTwenties();
        this.thirties = statistics.getThirties();
        this.forties = statistics.getForties();
        this.fifties = statistics.getFifties();
        this.product_code = product.getCode();
        return this;
    }
}
