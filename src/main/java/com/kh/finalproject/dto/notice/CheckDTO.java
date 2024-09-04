package com.kh.finalproject.dto.notice;

import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;

@Getter
@Setter
public class CheckDTO {
    @NotNull(message = "필수값이어야합니다")
    private Long index;
}
