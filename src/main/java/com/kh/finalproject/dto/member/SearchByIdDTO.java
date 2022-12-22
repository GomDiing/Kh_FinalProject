package com.kh.finalproject.dto.member;

import lombok.Getter;

import javax.validation.constraints.NotNull;

@Getter
public class SearchByIdDTO {
    private String id;
    private String email;
    private String providerType;
}
