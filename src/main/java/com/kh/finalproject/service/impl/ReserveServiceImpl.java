package com.kh.finalproject.service.impl;

import com.kh.finalproject.dto.reserve.*;
import com.kh.finalproject.service.ReserveService;

import java.util.List;

public class ReserveServiceImpl implements ReserveService {

    @Override
    public void payment(PaymentReserveDTO paymentReserveDTO) {

    }

    @Override
    public void refund(RefundReserveDTO refundReserveDTO) {

    }

    @Override
    public void cancel(CancelReserveDTO cancelReserveDTO) {

    }

    @Override
    public ReserveDTO searchByMember(Long memberIndex) {
        return null;
    }

    @Override
    public List<ReserveDTO> searchAll() {
        return null;
    }

    @Override
    public void updateRemain(Long remain) {

    }

    @Override
    public void updateCumuAboutPayment(UpdateCumuAboutPaymentDTO updateCumuAboutPaymentDTO) {

    }

    @Override
    public void updateTotalReserve(Long totalReserve) {

    }
}
