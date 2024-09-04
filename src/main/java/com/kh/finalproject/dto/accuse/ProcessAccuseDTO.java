package com.kh.finalproject.dto.accuse;

import lombok.Getter;

/**
 * 신고 처리 DTO
 */
@Getter
public class ProcessAccuseDTO {
    private Long id;
    private Long reviewCommentIndex;
    private String accuseStatus;
    private String memberStatus;
    private Integer accuseCount;

}
