package com.kh.finalproject.controller;

import com.kh.finalproject.dto.reserve.PaymentReserveDTO;
import com.kh.finalproject.dto.reserve.RefundReserveCancelDTO;
import com.kh.finalproject.dto.reserve.SearchPaymentReserveDTO;
import com.kh.finalproject.dto.reserve.SearchRefundCancelReserveDTO;
import com.kh.finalproject.entity.enumurate.ReserveStatus;
import com.kh.finalproject.response.DefaultResponse;
import com.kh.finalproject.response.DefaultResponseMessage;
import com.kh.finalproject.response.StatusCode;
import com.kh.finalproject.service.ReserveService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;


/**
 * 공연 예매 관련 기능을 처리하는 API 컨트롤러
 * 예매, 환불, 취소 및 예매 내역 조회 기능을 제공
 * 모든 응답은 DefaultResponse 형식으로 반환됨
 *
 * @author GomDiing
 */
@RequiredArgsConstructor
@RestController
@Slf4j
@RequestMapping("/api/reserve")
public class ReserveController {
    private final ReserveService reserveService;

    /**
     * 새로운 공면 예매
     *
     * @param paymentReserveDTO 예매 정보를 담은 DTO
     * @return 예매 처리 결과와 성공 메시지
     */
    @PostMapping("/payment")
    public ResponseEntity<DefaultResponse<Object>> paymentReserve(@Validated @RequestBody PaymentReserveDTO paymentReserveDTO){
        log.info("예매 시작 (/api/reserve/payment)");
        log.info("paymentReserveDTO: {}", paymentReserveDTO.toString());

        //예매 생성
        reserveService.createReserve(paymentReserveDTO);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_RESERVE), HttpStatus.OK);
    }

    /**
     * 예매 건에 대한 환불 처리
     *
     * @param ticket 예매 티켓 번호
     * @param refundAmount 환불 금액
     * @return 환불 처리 결과와 성공 메시지
     */
    @GetMapping("/refund/{ticket}/{refund-amount}")
    public ResponseEntity<DefaultResponse<RefundReserveCancelDTO>> refundReserve(@PathVariable String ticket,
                                                                 @PathVariable("refund-amount") Integer refundAmount){

        //예매 환불
        RefundReserveCancelDTO refund = reserveService.refundCancel(ticket, ReserveStatus.REFUND, refundAmount);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_RESERVE_REFUND, refund), HttpStatus.OK);
    }


    /**
     * 예매 건에 대한 취소 처리
     *
     * @param ticket 예매 티켓 번호
     * @return 취소 처리 결과와 정보
     */
    @GetMapping("/cancel/{ticket}")
    public ResponseEntity<DefaultResponse<RefundReserveCancelDTO>> cancelReserve(@PathVariable String ticket){

        //예매 취소
        RefundReserveCancelDTO cancel = reserveService.refundCancel(ticket, ReserveStatus.CANCEL, 0);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_RESERVE_CANCEL, cancel), HttpStatus.OK);
    }

    /**
     * 특정 회원의 전체 예매 내역 조회
     *
     * @param memberIndex 회원 식별자
     * @return 회원의 전체 예매 내역 목록
     */
    @GetMapping("/list/payment/{index}")
    public ResponseEntity<DefaultResponse<List<SearchPaymentReserveDTO>>> findAllPaymentReserve(@PathVariable("index") Long memberIndex) {

        List<SearchPaymentReserveDTO> reserveDTOList = reserveService.searchAllPayment(memberIndex);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_RESERVE_SEARCH_ALL_RESERVE, reserveDTOList), HttpStatus.OK);
    }

    /**
     * 특정 회원의 전체 취소/환불 내역 조회
     *
     * @param memberIndex 회원 식별자
     * @return 회원의 전체 취소/환불 내역 목록
     */
    @GetMapping("/list/refund-cancel/{index}")
    public ResponseEntity<DefaultResponse<List<SearchRefundCancelReserveDTO>>> findAllRefundCancelReserve(@PathVariable("index") Long memberIndex) {

        List<SearchRefundCancelReserveDTO> reserveDTOList = reserveService.searchAllRefundCancel(memberIndex);

        return new ResponseEntity<>(DefaultResponse.res(StatusCode.OK, DefaultResponseMessage.SUCCESS_RESERVE_SEARCH_ALL_REFUND_CANCEL, reserveDTOList), HttpStatus.OK);
    }
}
