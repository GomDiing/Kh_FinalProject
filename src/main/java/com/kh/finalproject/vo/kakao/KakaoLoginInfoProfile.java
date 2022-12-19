package com.kh.finalproject.vo.kakao;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;

@Getter
public class KakaoLoginInfoProfile {
    private Long id;
    private String nickname;
//    private LocalDateTime connected_at;
    private String connected_at;
//    private Boolean name_needs_agreement;
//    private Boolean age_range_needs_agreement;
//    private String age_range;
//    private Boolean birthyear_needs_agreement;
//    private Boolean birthday_needs_agreement;
//    private String birthday;
//    private String birth_type;
//    private Boolean gender_needs_agreement;
//    private String gender;
//    private Boolean phone_number_needs_agreement;
//    private String phone_number;
//    private Boolean ci_needs_agreement;
//    private String ci;
//    private LocalDateTime ci_authenticated_at;
//    private String ci_authenticated_at;
    @JsonProperty("properties")
    private KakaoLoginInfoProperties properties;
    @JsonProperty("kakao_account")
    private KakaoLoginInfoAccount kakao_account;

}
