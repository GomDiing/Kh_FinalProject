package com.kh.finalproject.service;

import com.kh.finalproject.dto.reserve.*;
import com.kh.finalproject.entity.enumurate.ReserveStatus;

import java.util.List;

/**
 * 예매 서비스 인터페이스
 */
public interface ReserveService {
    /**
     * 예매 결제 메서드
     */
    void createReserve(PaymentReserveDTO paymentReserveDTO);

    /**
     * 예매 환불/취소 메서드
     * 적절한 처리 후 상태 변경
     */
    RefundReserveCancelDTO refundCancel(String reserveId, ReserveStatus status, Integer totalRefundAmount);

    /**
     * 예매 취소 메서드
     * 적절한 처리 후 상태 변경
     */
//    RefundReserveDTO cancel(String reserveId);

//    void cancel(CancelReserveDTO cancelReserveDTO);

    /**
     * 회원 인덱스로 예매 조회 메서드
     */
    List<SearchPaymentReserveDTO> searchAllPayment(Long memberIndex);

    List<SearchRefundCancelReserveDTO> searchAllRefundCancel(Long memberIndex);

    /**
     * 예매 전체 조회 메서드
     */
    List<ReserveDTO> searchAll();

    /**
     * [좌식/가격]테이블 잔여 수량 갱신 메서드
     * 결제 시 잔여 수량 감소
     * 취소/환불 시 잔여 수량 증가
     */
    void updateRemain(Long remain);

    /**
     * [관리자 차트] 누적 결제/할인/최종 금액 갱신 메서드
     */
    void updateCumuAboutPayment(UpdateCumuAboutPaymentDTO updateCumuAboutPaymentDTO);

    /**
     * [관리자 차트] 총 예매수 갱신 메서드
     */
    void updateTotalReserve(Long totalReserve);
}
