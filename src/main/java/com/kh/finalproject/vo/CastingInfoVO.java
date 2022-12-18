package com.kh.finalproject.vo;

import com.kh.finalproject.dto.casting.CastingDTO;
import com.kh.finalproject.dto.reservetime.DetailProductReserveTimeCastingDTO;
import lombok.Getter;

import java.util.ArrayList;
import java.util.List;

/**
 * 상세 상품 구현의 processCastingInfo 메서드에 사용하는 VO
 * 캐스팅DTO 리스트
 * 시간별 예매 캐스팅 DTO 리스트 구현
 */
@Getter
public class CastingInfoVO {
    private List<CastingDTO> castingDTOList = new ArrayList<>();
//    private List<DetailProductReserveTimeCastingDTO> detailProductReserveTimeCastingDTOList = new ArrayList<>();

    //시간별 캐스팅 정보가 존재하지 않을 경우
    public CastingInfoVO toVO(List<CastingDTO> castingDTOList) {
        this.castingDTOList = castingDTOList;

        return this;
    }

    //시간별 캐스팅 정보가 존재했을 경우
//    public void updateVO (List<DetailProductReserveTimeCastingDTO> detailProductReserveTimeCastingDTOList) {
//        this.castingDTOList = castingDTOList;
//        this.detailProductReserveTimeCastingDTOList = detailProductReserveTimeCastingDTOList;
//    }
}
