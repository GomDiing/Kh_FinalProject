package com.kh.finalproject.dto.accuse;

import com.kh.finalproject.entity.Member;
import com.kh.finalproject.entity.ReviewComment;
import com.kh.finalproject.entity.enumurate.AccuseStatus;
import lombok.Getter;
import lombok.Setter;

/**
 * 신고 생성 DTO
 */
@Getter
@Setter
public class CreateAccuseDTO {
    private Long index;
    private Member memberSuspect;
    private Member memberVictim;
    private String reason;
    private String process;
    private AccuseStatus status;
    private ReviewComment reviewComment;
}
