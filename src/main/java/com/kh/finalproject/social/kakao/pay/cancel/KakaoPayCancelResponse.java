package com.kh.finalproject.social.kakao.pay.cancel;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KakaoPayCancelResponse {
    private String aid;
    private String tid;
    private String cid;
    private String status;
    @JsonProperty(value = "partner_order_id")
    private String partnerOrderId;
    @JsonProperty(value = "partner_user_id")
    private String partnerUserId;
    @JsonProperty(value = "payment_method_type")
    private String paymentMethodType;
    private KakaoPayCancelResponseAmount amount;
    @JsonProperty(value = "approved_cancel_amount")
    private KakaoPayCancelResponseApprovedCancelAmount approvedCancelAmount;
    @JsonProperty(value = "canceled_amount")
    private KakaoPayCancelResponseCanceldAmount canceledAmount;
    @JsonProperty(value = "cancel_available_amount")
    private KakaoPayCancelResponseCancelAvailableAmount cancelAvailableAmount;
    @JsonProperty(value = "item_name")
    private String itemName;
    @JsonProperty(value = "item_code")
    private String itemCode;
    private Integer quantity;
    @JsonProperty(value = "created_at")
    private LocalDateTime createdAt;
    @JsonProperty(value = "approved_at")
    private LocalDateTime approvedAt;
    @JsonProperty(value = "canceled_at")
    private LocalDateTime canceledAt;
    private String payload;

    @Override
    public String toString() {
        return "KakaoPayCancelResponse{" +
                "aid='" + aid + '\'' +
                ", tid='" + tid + '\'' +
                ", cid='" + cid + '\'' +
                ", status='" + status + '\'' +
                ", partnerOrderId='" + partnerOrderId + '\'' +
                ", partnerUserId='" + partnerUserId + '\'' +
                ", paymentMethodType='" + paymentMethodType + '\'' +
                ", amount=" + amount +
                ", approvedCancelAmount=" + approvedCancelAmount +
                ", canceledAmount=" + canceledAmount +
                ", cancelAvailableAmount=" + cancelAvailableAmount +
                ", itemName='" + itemName + '\'' +
                ", itemCode='" + itemCode + '\'' +
                ", quantity=" + quantity +
                ", createdAt=" + createdAt +
                ", approvedAt=" + approvedAt +
                ", canceledAt=" + canceledAt +
                ", payload='" + payload + '\'' +
                '}';
    }
}
