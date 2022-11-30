package com.kh.finalproject.entity.status;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ProductCategory {
    MUSICAL("Musical", "뮤지컬 카테고리"),
    DRAMA("Drama", "연극 카테고리"),
    CLASSIC("Classic", "클래식 카테고리"),
    EXHIBITION("Exhibition", "전시 카테고리");

    private final String category;
    private final String description;
}
