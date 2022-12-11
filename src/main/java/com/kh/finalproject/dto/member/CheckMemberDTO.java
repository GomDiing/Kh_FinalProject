package com.kh.finalproject.dto.member;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;

@Getter
@Setter
public class CheckMemberDTO {
    @NotNull(message = "필수값이어야합니다")
    private Long index;
}
