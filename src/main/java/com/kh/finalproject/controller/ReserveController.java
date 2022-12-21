package com.kh.finalproject.controller;

import com.kh.finalproject.dto.reserve.PaymentReserveDTO;
import com.kh.finalproject.dto.reserve.RefundReserveCancelDTO;
import com.kh.finalproject.dto.reserve.SearchPaymentReserveDTO;
import com.kh.finalproject.dto.reserve.SearchRefundCancelReserveDTO;
import com.kh.finalproject.entity.enumurate.ReserveStatus;
import com.kh.finalproject.response.DefaultResponse;
import com.kh.finalproject.response.StatusCode;
import com.kh.finalproject.service.ReserveService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@Slf4j
@RequestMapping("/api/reserve")
@CrossOrigin(origins = "http://localhost:3000")
public class ReserveController {
    private final ReserveService reserveService;

    /**
     * 예매 컨트롤러
     */
    @PostMapping("/payment")
    public ResponseEntity<DefaultResponse<Object>> paymentReserve(@RequestBody PaymentReserveDTO paymentReserveDTO){

        //예매 생성
        reserveService.createReserve(paymentReserveDTO);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, "디버깅 중"), HttpStatus.OK);
    }

    /**
     * 환불 진행 컨트롤러
     */
    @GetMapping("/refund/{ticket}")
    public ResponseEntity<DefaultResponse<Object>> refundReserve(@PathVariable String ticket){

        //예매 환불
        RefundReserveCancelDTO refund = reserveService.refundCancel(ticket, ReserveStatus.REFUND);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, "디버깅 중", refund), HttpStatus.OK);
    }

    /**
     * 취소 진행 컨트롤러
     */
    @GetMapping("/cancel/{ticket}")
    public ResponseEntity<DefaultResponse<Object>> cancelReserve(@PathVariable String ticket){

        //예매 취소
        RefundReserveCancelDTO cancel = reserveService.refundCancel(ticket, ReserveStatus.CANCEL);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, "디버깅 중", cancel), HttpStatus.OK);
    }

    /**
     * 회원 전체 예매 내역 조회 컨트롤러
     */
    @GetMapping("/list/payment/{index}")
    public ResponseEntity<DefaultResponse<Object>> findAllPaymentReserve(@PathVariable("index") Long memberIndex) {

        List<SearchPaymentReserveDTO> reserveDTOList = reserveService.searchAllPayment(memberIndex);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, "디버깅 중", reserveDTOList), HttpStatus.OK);
    }

    /**
     * 회원 전체 취소/환불 내역 조회 컨트롤러
     */
    @GetMapping("/list/refund-cancel/{index}")
    public ResponseEntity<DefaultResponse<Object>> findAllRefundCancelReserve(@PathVariable("index") Long memberIndex) {

        List<SearchRefundCancelReserveDTO> reserveDTOList = reserveService.searchAllRefundCancel(memberIndex);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, "디버깅 중", reserveDTOList), HttpStatus.OK);
    }
}
