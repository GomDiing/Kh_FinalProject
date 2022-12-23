package com.kh.finalproject.dto.reviewComment;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.kh.finalproject.entity.Member;
import com.kh.finalproject.entity.ReviewComment;
import com.kh.finalproject.entity.enumurate.MemberProviderType;
import lombok.Getter;

import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Getter
public class ChildCommentDTO {
    //댓글 인덱스
    private Long index;
    //회원 인덱스
    private Long memberIndex;
    //회원 아이디
    private String memberId;
    //내용
    private String content;
    //그룹
    private Long group;
    //레이어
    private Integer layer;
    //순서
    private Integer order;
    //리뷰 상태
    private String reviewCommentStatus;
    //신고 횟수
    private Integer accuseCount;
    //상품 코드
    private String productCode;
    //생성 일자
    private String createTime;

    @JsonProperty("provider_type")
    private String providerType;
    //썸네일
    @JsonProperty("thumb_poster_url")
    private String thumbPosterUrl;


    /*관리자페이지 Dashboard에서 리뷰 조회용*/
    public ChildCommentDTO toDTO(ReviewComment reviewComment){
        this.index = reviewComment.getIndex();
        this.memberIndex = reviewComment.getMember().getIndex();
        //홈 회원이면 ID, 소셜 회원이면 이메일 노출
        if (reviewComment.getMember().getProviderType() == MemberProviderType.HOME) this.memberId = reviewComment.getMember().getId();
        this.content = reviewComment.getContent();
        this.group = reviewComment.getGroup();
        this.layer = reviewComment.getLayer();
        this.order = reviewComment.getOrder();
        this.reviewCommentStatus = reviewComment.getStatus().name();
        this.accuseCount = reviewComment.getAccuseCount();
        this.productCode = reviewComment.getProduct().getCode();
        this.createTime = reviewComment.getCreateTime().format(DateTimeFormatter.ofPattern("yyyy.MM.dd"));
        this.thumbPosterUrl = reviewComment.getProduct().getThumbPosterUrl();
        this.providerType = reviewComment.getMember().getProviderType().name();

        return  this;
    }

}
