package com.kh.finalproject.dto.member;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;

@Getter
@Setter
public class CheckMemberDTO {
    @NotNull(message = "회원 인덱스는 필수값 입나다")
    private Long index;
}
