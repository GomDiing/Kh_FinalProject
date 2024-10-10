package com.kh.finalproject.social.kakao.pay.approve;

import lombok.Getter;

@Getter
public class KakaoPayApproveResponseCardInfo {
    private String kakaopay_purchase_corp;
    private String kakaopay_purchase_corp_code;
    private String kakaopay_issuer_corp;
    private String kakaopay_issuer_corp_code;
    private String bin;
    private String card_type;
    private String install_month;
    private String approved_id;
    private String card_mid;
    private String interest_free_install;
    private String installment_type;
    private String card_item_code;

    @Override
    public String toString() {
        return "KakaoPayApproveResponseCardInfo{" +
                "kakaopay_purchase_corp='" + kakaopay_purchase_corp + '\'' +
                ", kakaopay_purchase_corp_code='" + kakaopay_purchase_corp_code + '\'' +
                ", kakaopay_issuer_corp='" + kakaopay_issuer_corp + '\'' +
                ", kakaopay_issuer_corp_code='" + kakaopay_issuer_corp_code + '\'' +
                ", bin='" + bin + '\'' +
                ", card_type='" + card_type + '\'' +
                ", install_month='" + install_month + '\'' +
                ", approved_id='" + approved_id + '\'' +
                ", card_mid='" + card_mid + '\'' +
                ", interest_free_install='" + interest_free_install + '\'' +
                ", installment_type='" + installment_type + '\'' +
                ", card_item_code='" + card_item_code + '\'' +
                '}';
    }
}