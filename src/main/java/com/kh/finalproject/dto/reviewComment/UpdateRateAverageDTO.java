package com.kh.finalproject.dto.reviewComment;

import lombok.Getter;

/**
 * 평점 추가 DTO
 */
@Getter
public class UpdateRateAverageDTO {
    Long memberIndex;
    String productCode;
    Float addRate;
}
