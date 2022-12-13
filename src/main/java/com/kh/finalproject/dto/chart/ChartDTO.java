package com.kh.finalproject.dto.chart;

import com.kh.finalproject.entity.Chart;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChartDTO {
    //    private Long index;
    private Long cumuAmount;
    private Long cumuDiscount;
    private Long finalAmount;
    private Long totalMember;
    private Long totalReserve;

    public ChartDTO toDTO(Chart chart) {
        this.cumuAmount = chart.getCumuAmount();
        this.cumuDiscount = chart.getCumuDiscount();
        this.finalAmount = chart.getFinalAmount();
        this.totalMember = chart.getTotalMember();
        this.totalReserve = chart.getTotalReserve();
        return this;
    }
}
