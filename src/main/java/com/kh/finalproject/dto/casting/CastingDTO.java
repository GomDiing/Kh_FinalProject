package com.kh.finalproject.dto.casting;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.kh.finalproject.entity.Casting;
import lombok.Getter;

/**
 * 캐스팅 DTO
 */
@Getter
public class CastingDTO {
    private String id;

    @JsonProperty("info_url")
    private String infoUrl;

    @JsonProperty("image_url")
    private String imageUrl;

    private String character;
    private String actor;
    private Integer order;

    /**
     * Casting Enityt -> DTO
     * 상세 페이지 조회 사용
     */
    public CastingDTO toDTO(Casting casting) {
        this.id = casting.getId();
        this.infoUrl = casting.getInfoUrl();
        this.imageUrl = casting.getImageUrl();
        this.character = casting.getCharacter();
        this.actor = casting.getActor();
        this.order = casting.getOrder();

        return this;
    }
}
