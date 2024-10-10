package com.kh.finalproject.social.kakao.pay.approve;

import lombok.Getter;

@Getter
public class KakaoPayApproveResponseAmount {
    private Integer total;
    private Integer tax_free;
    private Integer vat;
    private Integer point;
    private Integer discount;
    private Integer green_deposit;

    @Override
    public String toString() {
        return "KakaoPayApproveResponseAmount{" +
                "total=" + total +
                ", tax_free=" + tax_free +
                ", vat=" + vat +
                ", point=" + point +
                ", discount=" + discount +
                ", green_deposit=" + green_deposit +
                '}';
    }
}
