package com.kh.finalproject.social.kakao.pay.ready;

import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
public class KakaoPayReadyRequest {
    private String cid;
    private String partnerOrderId;
    private String partnerUserId;
    private String itemName;
    private Integer quantity;
    private Integer totalAmount;
    private Integer taxFreeAmount;
    private String approvalUrl;
    private String cancelUrl;
    private String failUrl;

    @Override
    public String toString() {
        return "KakaoPayReadyRequest{" +
                "cid='" + cid + '\'' +
                ", partnerOrderId='" + partnerOrderId + '\'' +
                ", partnerUserId='" + partnerUserId + '\'' +
                ", itemName='" + itemName + '\'' +
                ", quantity=" + quantity +
                ", totalAmount=" + totalAmount +
                ", taxFreeAmount=" + taxFreeAmount +
                ", approvalUrl='" + approvalUrl + '\'' +
                ", cancelUrl='" + cancelUrl + '\'' +
                ", failUrl='" + failUrl + '\'' +
                '}';
    }
}
