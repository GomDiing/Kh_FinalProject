package com.kh.finalproject.dto.casting;

import com.kh.finalproject.entity.Casting;
import lombok.Getter;

@Getter
public class CastingSimpleDTO {
    private String character;
    private String actor;

    /**
     * CastingDTO DTO -> CastingSimpleDTO DTO
     * 간단 캐스팅 정보 DTO 변환
     * 상세 상품 조회 사용
     */
    public CastingSimpleDTO toDTO(CastingDTO castingDTO) {
        this.character = castingDTO.getCharacter();
        this.actor = castingDTO.getActor();

        return this;
    }
}
