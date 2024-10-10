package com.kh.finalproject.social.kakao.pay.cancel;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
public class KakaoPayCancelRequest {
    private String cid;
    private String tid;
    private Integer cancel_amount;
    private Integer cancel_tax_free_amount;

    @Override
    public String toString() {
        return "KakaoPayCancelRequest{" +
                "cid='" + cid + '\'' +
                ", tid='" + tid + '\'' +
                ", cancel_amount='" + cancel_amount + '\'' +
                ", cancel_tax_free_amount='" + cancel_tax_free_amount + '\'' +
                '}';
    }
}
