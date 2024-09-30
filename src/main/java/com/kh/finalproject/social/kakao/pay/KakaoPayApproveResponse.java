package com.kh.finalproject.social.kakao.pay;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Objects;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KakaoPayApproveResponse {
    private String aid;
    private String tid;
    private String cid;
    private String sid;
    private String partner_order_id;
    private String partner_user_id;
    private String payment_method_type;
    @JsonProperty("amount")
    private KakaoPayApproveResponseAmount amount;
    @JsonProperty("card_info")
    private KakaoPayApproveResponseCardInfo cardInfo;
    private Integer quantity;
    private LocalDateTime created_at;
    private LocalDateTime approved_at;
    private String payload;

    @Override
    public String toString() {
        return "KakaoPayApproveResponse{" +
                "aid='" + aid + '\'' +
                ", tid='" + tid + '\'' +
                ", cid='" + cid + '\'' +
                ", sid='" + sid + '\'' +
                ", partner_order_id='" + partner_order_id + '\'' +
                ", partner_user_id='" + partner_user_id + '\'' +
                ", payment_method_type='" + payment_method_type + '\'' +
                ", amount=" + Objects.toString(amount, "amount is NULL") +
                ", cardInfo=" + Objects.toString(cardInfo, "cardInfo is null") +
                ", quantity=" + quantity +
                ", created_at=" + created_at +
                ", approved_at=" + approved_at +
                ", payload='" + payload + '\'' +
                '}';
    }
}
