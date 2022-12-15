package com.kh.finalproject.dto.member;

import lombok.Getter;

import javax.validation.constraints.NotNull;

@Getter
public class SearchByIdDTO {

    @NotNull(message = "아이디는 필수 입력 값")
    private String id;
}
