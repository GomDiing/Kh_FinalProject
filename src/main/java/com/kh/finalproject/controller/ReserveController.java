package com.kh.finalproject.controller;

import com.kh.finalproject.dto.reserve.PaymentReserveDTO;
import com.kh.finalproject.dto.reserve.RefundReserveCancelDTO;
import com.kh.finalproject.dto.reserve.ReserveDTO;
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
    @GetMapping("/payment")
    public ResponseEntity<DefaultResponse<Object>> paymentReserve(@RequestBody PaymentReserveDTO paymentReserveDTO){

        //예매 생성
        reserveService.createReserve(paymentReserveDTO);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, "디버깅 중"), HttpStatus.OK);
    }

    /**
     * 환불 컨트롤러
     */
    @GetMapping("/refund/{id}")
    public ResponseEntity<DefaultResponse<Object>> refundReserve(@PathVariable("id") String reserveId){

        //예매 환불
        RefundReserveCancelDTO refund = reserveService.refundCancel(reserveId, ReserveStatus.REFUND);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, "디버깅 중", refund), HttpStatus.OK);
    }

    /**
     * 취소 컨트롤러
     */
    @GetMapping("/cancel/{id}")
    public ResponseEntity<DefaultResponse<Object>> cancelReserve(@PathVariable("id") String reserveId){

        //예매 취소
        RefundReserveCancelDTO cancel = reserveService.refundCancel(reserveId, ReserveStatus.CANCEL);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, "디버깅 중", cancel), HttpStatus.OK);
    }

    /**
     * 회원 인덱스로 전체 조회 컨트롤러
     */
    @GetMapping("/list/{index}")
    public ResponseEntity<DefaultResponse<Object>> findAllReserveByMemberIndex(@PathVariable("index") Long memberIndex) {

        List<ReserveDTO> reserveDTOList = reserveService.searchAllByMember(memberIndex);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, "디버깅 중", reserveDTOList), HttpStatus.OK);
    }
}
