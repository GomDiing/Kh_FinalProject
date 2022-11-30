package com.kh.finalproject.entity.status;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum ReviewCommentStatus {
    ACTIVE("Active", "정상적으로 보여지는 상태"),
    CANCEL("Cancel", "해당 글을 작성한 회원이 탈퇴한 상태"),
    DELETE("Delete", "해당 글을 작성한 회원이 해당 후기/댓글을 삭제한 상태");

    private final String status;
    private final String description;
}
