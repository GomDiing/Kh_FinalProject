package com.kh.finalproject.social.kakao.pay;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
@Slf4j
public class KakaoPayService {

    @Value("${kakao-pay.client-id}")
    private String clientId;

    @Value("${kakao-pay.client-secret}")
    private String clientSecret;

    @Value("${kakao-pay.secret-key}")
    private String secretKey;

    @Value("${kakao-pay.secret-key.dev}")
    private String secretKeyDev;

    @Value("${kakao-pay.cid}")
    private String cid;

    @Value("${kakao-pay.partner-order-id}")
    private String partnerOrderId;

    @Value("${kakao-pay.partner-user-id}")
    private String partnerUserId;

    @Value("${kakao-pay.approval-url}")
    private String approvalUrl;

    @Value("${kakao-pay.fail-url}")
    private String failUrl;

    @Value("${kakao-pay.cancel-url}")
    private String cancelUrl;

    private String tid;

    public KakaoPayReadyResponse ready(KakaoPayReadyRequestDTO readyRequestDTO) {

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "DEV_SECRET_KEY " + secretKeyDev);
        headers.setContentType(MediaType.APPLICATION_JSON);

        KakaoPayReadyRequest readyRequest = KakaoPayReadyRequest.builder()
                .cid(cid)
                .partnerOrderId(partnerOrderId)
                .partnerUserId(partnerUserId)
                .itemName(readyRequestDTO.getItemName())
                .quantity(readyRequestDTO.getQuantity())
                .totalAmount(readyRequestDTO.getTotalAmount())
                .taxFreeAmount(readyRequestDTO.getTaxFreeAmount())
                .approvalUrl(approvalUrl)
                .cancelUrl(cancelUrl)
                .failUrl(failUrl)
                .build();

        log.info("readyRequest = {}", readyRequest.toString());

        // Send reqeust
        HttpEntity<KakaoPayReadyRequest> entityMap = new HttpEntity<>(readyRequest, headers);

        ResponseEntity<KakaoPayReadyResponse> response = new RestTemplate().postForEntity(
                "https://open-api.kakaopay.com/online/v1/payment/ready",
                entityMap,
                KakaoPayReadyResponse.class
        );
        KakaoPayReadyResponse readyResponse = response.getBody();

        assert readyResponse != null;

        log.info("readyResponse = {}", readyResponse.toString());

        this.tid = readyResponse.getTid();

        return readyResponse;
    }

    public KakaoPayApproveResponse approve(KakaoPayApproveRequestDTO approveRequestDTO) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "DEV_SECRET_KEY " + secretKeyDev);
        headers.setContentType(MediaType.APPLICATION_JSON);

        KakaoPayApproveRequest approveRequest = KakaoPayApproveRequest.builder()
                .cid(cid)
                .tid(approveRequestDTO.getTid())
                .partner_order_id(partnerOrderId)
                .partner_user_id(partnerUserId)
                .pg_token(approveRequestDTO.getPg_token())
                .build();

        log.info("approveRequest = {}", approveRequest.toString());

        // Send reqeust
        HttpEntity<KakaoPayApproveRequest> entityMap = new HttpEntity<>(approveRequest, headers);

        ResponseEntity<KakaoPayApproveResponse> response = new RestTemplate().postForEntity(
                "https://open-api.kakaopay.com/online/v1/payment/approve",
                entityMap,
                KakaoPayApproveResponse.class
        );

        KakaoPayApproveResponse approveResponse = response.getBody();

        assert approveResponse != null;

        log.info("approveResponse = {}", approveResponse.toString());

        return approveResponse;
    }
}
