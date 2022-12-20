package com.kh.finalproject.service.impl;

import com.kh.finalproject.dto.reserve.*;
import com.kh.finalproject.entity.*;
import com.kh.finalproject.entity.enumurate.ReserveStatus;
import com.kh.finalproject.exception.CustomErrorCode;
import com.kh.finalproject.exception.CustomException;
import com.kh.finalproject.repository.*;
import com.kh.finalproject.service.ChartService;
import com.kh.finalproject.service.ReserveService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ReserveServiceImpl implements ReserveService {
    private final MemberRepository memberRepository;
    private final ReserveTimeSeatPriceRepository reserveTimeSeatPriceRepository;
    private final ProductRepository productRepository;
    private final ReserveRepository reserveRepository;
    private final MemberReserveRepository memberReserveRepository;
    private final KakaoPayRepository kakaoPayRepository;
    private final ChartRepository chartRepository;
    private final ChartService chartService;

    @Transactional
    @Override
    public void createReserve(PaymentReserveDTO paymentReserveDTO) {
        //예매 회원 조회
        Member reserveMember = memberRepository.findByIndex(paymentReserveDTO.getMemberIndex())
                .orElseThrow(() -> new CustomException(CustomErrorCode.EMPTY_MEMBER));
        //상세 예매 정보 조회
        ReserveTimeSeatPrice reserveDetail = reserveTimeSeatPriceRepository.findById(paymentReserveDTO.getReserveTimeSeatPriceId())
                .orElseThrow(() -> new CustomException(CustomErrorCode.EMPTY_RESERVE_TIME_SEAT_PRICE));

        //예매 정보
        ReserveTime reserveTime = reserveDetail.getReserveTime();

        String seatInfo = reserveDetail.getSeatPrice().getSeat();

        //상품 조회
        Product reserveProduct = productRepository.findByReserveTimeListContaining(reserveTime)
                .orElseThrow(() -> new CustomException(CustomErrorCode.ERROR_EMPTY_PRODUCT_CODE));

        //포인트 유효성 확인
        if (reserveMember.getPoint() < paymentReserveDTO.getPoint()) {
            throw new CustomException(CustomErrorCode.ERROR_POINT_INFO);
        }

        //잔여 예매 좌석 유효성 확인 (상시 상품은 제외)
        if (reserveDetail.getTotalQuantity() != 0 && reserveDetail.getRemainQuantity() < paymentReserveDTO.getQuantity()) {
            throw new CustomException(CustomErrorCode.ERROR_REMAIN_QUANTITY);
        }

        //상세 예매 정보의 잔여 수량 갱신
        reserveDetail.minusQuantity(paymentReserveDTO.getQuantity());

        //관리자 차트 갱신 위한 값
        Long cumuAmount = 0L;
        Long cumuDiscount = 0L;

        for (int i = 1; i <= paymentReserveDTO.getQuantity(); i++) {
            //예매 아이디 생성 및 중복 방지
            String reserveId;
            do {
                String randomIdKey = UUID.randomUUID().toString().substring(0, 5);

                LocalDateTime now = LocalDateTime.now();

                reserveId = reserveProduct.getCode() + "_" + randomIdKey + "_" + now.getYear() + ":" + now.getMonthValue() + ":" +
                        now.getDayOfMonth() + "_" + reserveTime.getTurn() + "_" + reserveDetail.getIndex() + ":" + i;
                //동일한 아이디가 없어야 무한루프 탈출
            } while (reserveRepository.findById(reserveId).isPresent());

            cumuAmount += paymentReserveDTO.getAmount();
            cumuDiscount += paymentReserveDTO.getPoint();

            //예매 엔티티 생성 및 저장
            Reserve reserve = new Reserve().toEntity(reserveId, reserveTime, seatInfo, reserveDetail.getIndex(), paymentReserveDTO);
            reserveRepository.save(reserve);

            //카카오페이일 경우
            if (Objects.equals(paymentReserveDTO.getMethod(), "KAKAOPAY")) {
                //카카오페이인데 TID가 없다면
                if (Objects.isNull(paymentReserveDTO.getKakaoTID())) {
                    throw new CustomException(CustomErrorCode.EMPTY_KAKAO_TID);
                }
                //카카오페이 엔티티 생성 및 저장
                KakaoPay kakaoPay = new KakaoPay().toEntity(paymentReserveDTO.getKakaoTID(), reserveMember, reserve);
                kakaoPayRepository.save(kakaoPay);
            }

            //회원 예매 엔티티 생성 및 저장
            MemberReserve memberReserve = new MemberReserve().toEntity(reserveMember, reserve);
            memberReserveRepository.save(memberReserve);
        }

        //관리자 차트 메서드
        int nowYear = LocalDateTime.now().getYear();
        int nowMonth = LocalDateTime.now().getMonthValue();

        //관리자 차트 이름 생성
        String charId = nowYear + "/" + nowMonth;

        //현재 개월의 차트 존재 유무
        boolean isChartExist = chartRepository.findById(charId).isPresent();

        //현재 월의 차트 정보가 없다면
        if (!isChartExist) {
            chartService.createCharList();
        }

        //현재 월의 차트 정보가 있다면
        else {
            //차트 조회
            Chart chart = chartRepository.findById(charId)
                    .orElseThrow(() -> new CustomException(CustomErrorCode.EMPTY_RESERVE));

            //해당 차트 정보 갱신
            chart.updateChart(cumuAmount, cumuDiscount, (long) paymentReserveDTO.getQuantity());
        }
    }

    @Override
    public RefundReserveDTO refund(String reserveId) {
        //예매ID와 결제 완료된 상태인 예매 조회
        Reserve reserve = reserveRepository.findByIdAndStatus(reserveId, ReserveStatus.PAYMENT)
                .orElseThrow(() -> new CustomException(CustomErrorCode.EMPTY_RESERVE));

        //해당 회원이 예매했던 상세 좌석/가격 정보 조회
        ReserveTimeSeatPrice reserveTimeSeatPrice = reserveTimeSeatPriceRepository.findById(reserve.getReserveTimeSeatPriceIndex())
                .orElseThrow(() -> new CustomException(CustomErrorCode.ERROR_RESERVE_TIME_SEAT_PRICE));

        //상태 변경 및 환불 시간 갱신
        reserve.updateStatus(ReserveStatus.REFUND);
        reserve.updateRefundTime(LocalDateTime.now());

        //수량 증가 (단일 환불임으로 1만 증가)
        reserveTimeSeatPrice.addQuantity(1);

        //결제 수단이 카카오페이인 경우
        if (reserve.getMethod().equals("KAKAOPAY")) {
            KakaoPay kakaoPay = kakaoPayRepository.findByReserve(reserve)
                    .orElseThrow(() -> new CustomException(CustomErrorCode.EMPTY_KAKAO_TID));

            return new RefundReserveDTO().toDTO(reserve.getAmount(), reserve.getDiscount(), reserve.getFinalAmount(), reserve.getMethod(), kakaoPay.getKakaoTID());
        }

        return new RefundReserveDTO().toDTO(reserve.getAmount(), reserve.getDiscount(), reserve.getFinalAmount(), reserve.getMethod());
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
