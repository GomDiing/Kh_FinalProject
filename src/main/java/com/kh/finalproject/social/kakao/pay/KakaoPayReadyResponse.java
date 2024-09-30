package com.kh.finalproject.social.kakao.pay;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KakaoPayReadyResponse {
    private String tid;
    private Boolean tms_result;
    private String created_at;
    private String next_redirect_pc_url;
    private String next_redirect_mobile_url;
    private String next_redirect_app_url;
    private String android_app_scheme;
    private String ios_app_scheme;

    @Override
    public String toString() {
        return "KakaoPayReadyResponse{" +
                "tid='" + tid + '\'' +
                ", tms_result=" + tms_result +
                ", created_at='" + created_at + '\'' +
                ", next_redirect_pc_url='" + next_redirect_pc_url + '\'' +
                ", next_redirect_mobile_url='" + next_redirect_mobile_url + '\'' +
                ", next_redirect_app_url='" + next_redirect_app_url + '\'' +
                ", android_app_scheme='" + android_app_scheme + '\'' +
                ", ios_app_scheme='" + ios_app_scheme + '\'' +
                '}';
    }
}
