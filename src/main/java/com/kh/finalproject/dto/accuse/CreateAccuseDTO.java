package com.kh.finalproject.dto.accuse;

import com.kh.finalproject.entity.Member;
import com.kh.finalproject.entity.ReviewComment;
import com.kh.finalproject.entity.enumurate.AccuseStatus;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;

/**
 * 신고 생성 DTO
 */
@Getter
@Setter
public class CreateAccuseDTO {
    @NotNull(message = "후기 작성자 인덱스는 필수 입력값 입니다")
    private Long memberIndexSuspect;
    @NotNull(message = "후기 신고자 인덱스는 필수 입력값 입니다")
    private Long memberIndexVictim;
    @NotNull(message = "후기 신고 사유는 필수 입력값 입니다")
    private String reason;
}
