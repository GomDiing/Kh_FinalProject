package com.kh.finalproject.dto.product;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.kh.finalproject.dto.casting.CastingDTO;
import com.kh.finalproject.dto.reservetime.DetailProductReserveTimeSetDTO;
import com.kh.finalproject.dto.reservetime.DetailProductReserveTimeCastingDTO;
import com.kh.finalproject.dto.seatPrice.SeatPriceDTO;
import com.kh.finalproject.dto.statistics.StatisticsDTO;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

/**
 * 상품 상세페이지 DTO
 */
@Getter
public class DetailProductDTO {
    @JsonProperty("check_list")
    DetailProductCheckList detailProductCheckList;
    @JsonProperty("compact_list")
    DetailProductCompactDTO detailProductCompactDTO;

    @JsonProperty("calendar_list")
    private List<DetailProductReserveTimeSetDTO> detailProductReserveTimeSetDTOList = new ArrayList<>();

    @JsonProperty("info_casting")
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private List<CastingDTO> castingDTOList = new ArrayList<>();

    @JsonProperty("statistics_list")
    private StatisticsDTO statisticsDTO;

    @JsonProperty("seat_price_list")
    List<SeatPriceDTO> seatPriceDTOList;

//    @JsonProperty("info_time_casting")
//    @JsonInclude(JsonInclude.Include.NON_NULL)
//    private List<DetailProductReserveTimeCastingDTO> detailProductReserveTimeCastingDTOList = new ArrayList<>();


    /**
     * 캐스팅 정보가 존재하지 않을 경우
     */
    public DetailProductDTO toDTO(DetailProductCheckList detailProductCheckList,
                                  DetailProductCompactDTO detailProductCompactDTO,
                                  List<DetailProductReserveTimeSetDTO> detailProductReserveTimeSetDTOList,
                                  StatisticsDTO statisticsDTO,
                                  List<SeatPriceDTO> seatPriceDTOList) {
        this.detailProductCheckList = detailProductCheckList;
        this.detailProductCompactDTO = detailProductCompactDTO;
        this.detailProductReserveTimeSetDTOList = detailProductReserveTimeSetDTOList;
        this.statisticsDTO = statisticsDTO;
        this.seatPriceDTOList = seatPriceDTOList;

        return this;
    }

    /**
     * 캐스팅 정보만 존재하고 시간별 캐스팅 정보는 존재하지 않을 경우
     */
    public DetailProductDTO toDTO(DetailProductCheckList detailProductCheckList,
                                  DetailProductCompactDTO detailProductCompactDTO,
                                  List<DetailProductReserveTimeSetDTO> detailProductReserveTimeSetDTOList,
                                  List<CastingDTO> castingDTOList,
                                  StatisticsDTO statisticsDTO,
                                  List<SeatPriceDTO> seatPriceDTOList) {
        this.detailProductCheckList = detailProductCheckList;
        this.detailProductCompactDTO = detailProductCompactDTO;
        this.detailProductReserveTimeSetDTOList = detailProductReserveTimeSetDTOList;
        this.castingDTOList = castingDTOList;
        this.statisticsDTO = statisticsDTO;
        this.seatPriceDTOList =seatPriceDTOList;

        return this;
    }

    /**
     * 캐스팅 정보 및 시간별 캐스팅 정보 모두 존재할 경우
     */
//    public DetailProductDTO toDTO(DetailProductCheckList detailProductCheckList,
//                                  DetailProductCompactDTO detailProductCompactDTO,
//                                  List<DetailProductReserveTimeSetDTO> detailProductReserveTimeSetDTOList,
//                                  List<CastingDTO> castingDTOList,
//                                  List<DetailProductReserveTimeCastingDTO> detailProductReserveTimeCastingDTOList) {
//        this.detailProductCheckList = detailProductCheckList;
//        this.detailProductCompactDTO = detailProductCompactDTO;
//        this.detailProductReserveTimeSetDTOList = detailProductReserveTimeSetDTOList;
//        this.castingDTOList = castingDTOList;
//        this.detailProductReserveTimeCastingDTOList = detailProductReserveTimeCastingDTOList;
//
//        return this;
//    }
}
