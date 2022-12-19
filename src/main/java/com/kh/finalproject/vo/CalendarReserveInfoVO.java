package com.kh.finalproject.vo;

import com.kh.finalproject.dto.reservetime.DetailProductReserveTimeDTO;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

/**
 * 상세 상품 구현의 processReserve 메서드에 사용하는 VO
 * 예매 가능한 날짜 리스트
 * 다음달 예매 가능 여부
 * 예매 시간 엔티티
 */
@Getter
public class CalendarReserveInfoVO {
    //    Boolean isLimit;
    List<Integer> reserveTimeDayListInMonth = new ArrayList<>();
    Boolean isNextMonthProductExist;
    DetailProductReserveTimeDTO reserveTimeFirst;
    List<DetailProductReserveTimeDTO> reserveTimeListFirstList = new ArrayList<>();

    public CalendarReserveInfoVO toVO(List<Integer> reserveTimeDayListInMonth, Boolean isNextMonthProductExist, DetailProductReserveTimeDTO reserveTimeFirst, List<DetailProductReserveTimeDTO> reserveTimeListMonth) {
        this.reserveTimeDayListInMonth = reserveTimeDayListInMonth;
//        this.isLimit = isLimit;
        this.isNextMonthProductExist = isNextMonthProductExist;
        this.reserveTimeFirst = reserveTimeFirst;
        this.reserveTimeListFirstList = reserveTimeListMonth;

        return this;
    }

    public CalendarReserveInfoVO toVO(Boolean isNextMonthProductExist, DetailProductReserveTimeDTO reserveTimeFirst, List<DetailProductReserveTimeDTO> reserveTimeListMonth) {
//        this.findReserveTimeDayListInMonth = null;
//        this.isLimit = isLimit;
        this.isNextMonthProductExist = isNextMonthProductExist;
        this.reserveTimeFirst = reserveTimeFirst;
        this.reserveTimeListFirstList = reserveTimeListMonth;

        return this;
    }
}
