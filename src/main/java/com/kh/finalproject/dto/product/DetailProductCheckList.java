package com.kh.finalproject.dto.product;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.kh.finalproject.entity.Product;
import com.kh.finalproject.vo.CalendarReserveInfoVO;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

@Getter
public class DetailProductCheckList {
    @JsonProperty("is_limit")
    private Boolean isLimit;
    @JsonProperty("is_age_korean")
    private Boolean ageIsKorean;

    @JsonProperty("is_info_casting")
    private Boolean isInfoCasting;

    @JsonProperty("is_info_time_casting")
    private Boolean isInfoTimeCasting;

    @JsonProperty("is_next_reserve")
    private Boolean isNextMonthProductExist;

    @JsonProperty("is_last_reserve")
    private Boolean isLastMonthProductExist;

    @JsonProperty("reserve_day_in_month")
    List<String> findReserveTimeDayListInMonth = new ArrayList<>();

    /**
     * 한정 상품일 경우
     */
    public DetailProductCheckList toDTO(Product product, CalendarReserveInfoVO calendarReserveInfoVO, Boolean isLimit) {
        this.isLimit = isLimit;
        this.ageIsKorean = product.getAgeIsKorean();
        this.isInfoCasting = product.getIsInfoCasting();
        this.isInfoTimeCasting = product.getIsInfoTimeCasting();
        this.isNextMonthProductExist = calendarReserveInfoVO.getIsNextMonthProductExist();
        this.isLastMonthProductExist = calendarReserveInfoVO.getIsLastMonthProductExist();
        this.findReserveTimeDayListInMonth = calendarReserveInfoVO.getReserveTimeDayListInMonth();

        return this;
    }

    /**
     * 상시 상품일 경우
     */
//    public DetailProductCheckList toDTO(Product product) {
//        this.ageIsKorean = product.getAgeIsKorean();
//        this.isInfoCasting = product.getIsInfoCasting();
//        this.isInfoTimeCasting = product.getIsInfoTimeCasting();
//        this.isNextMonthProductExist = false;
//
//        return this;
//    }
}
