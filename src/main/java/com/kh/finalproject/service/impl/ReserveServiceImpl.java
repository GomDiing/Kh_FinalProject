package com.kh.finalproject.service.impl;

import com.kh.finalproject.dto.reserve.*;
import com.kh.finalproject.entity.*;
import com.kh.finalproject.entity.enumurate.MemberStatus;
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
import java.util.*;

import static java.time.temporal.TemporalAdjusters.lastDayOfMonth;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ReserveServiceImpl implements ReserveService {
    private final MemberRepository memberRepository;
    private final ReserveTimeSeatPriceRepository reserveTimeSeatPriceRepository;
    private final ProductRepository productRepository;
    private final ReserveRepository reserveRepository;
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

        //좌석 정보
        String seatInfo = reserveDetail.getSeatPrice().getSeat();

        //포인트 유효성 확인
        if (reserveMember.getPoint() < paymentReserveDTO.getPoint()) {
            throw new CustomException(CustomErrorCode.ERROR_POINT_INFO);
        }

        //잔여 예매 좌석 유효성 확인 (상시 상품은 제외)
        //한정 상품이고 (총 좌석이 0이 아니고) 남은 좌석이 주문 수량보다 작으면
        if (reserveDetail.getTotalQuantity() != 0 && reserveDetail.getRemainQuantity() < paymentReserveDTO.getQuantity()) {
            throw new CustomException(CustomErrorCode.ERROR_REMAIN_QUANTITY);
        }

        //상세 예매 정보의 잔여 수량 갱신
        reserveDetail.minusQuantity(paymentReserveDTO.getQuantity());

        //관리자 차트 갱신 위한 값
        Long cumuAmount = 0L;
        Long cumuDiscount = 0L;

        String randomIdKey;
        do {
//                String randomIdKey = UUID.randomUUID().toString().substring(0, 5);
            randomIdKey = UUID.randomUUID().toString().replaceAll("-", "").toUpperCase().substring(0, 32);

            //동일한 아이디가 없어야 무한루프 탈출
        } while (reserveRepository.findByTicket(randomIdKey).isPresent());
        //예매 아이디 생성 및 중복 방지
        for (int count = 1; count <= paymentReserveDTO.getQuantity(); count++) {

            cumuAmount += paymentReserveDTO.getAmount();
            cumuDiscount += paymentReserveDTO.getPoint();

            //예매 엔티티 생성 및 저장
            Reserve reserve = new Reserve().toEntity(randomIdKey, count, reserveTime, seatInfo, reserveDetail.getIndex(), paymentReserveDTO, reserveMember);
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
        }

        //관리자 차트 메서드
        int nowYear = LocalDateTime.now().getYear();
        int nowMonth = LocalDateTime.now().getMonthValue();

        //관리자 차트 이름 생성
        String charId;
        if (nowMonth < 10) charId = nowYear + "/0" + nowMonth;
        else charId = nowYear + "/" + nowMonth;

        LocalDateTime todayTime = LocalDateTime.now();
        LocalDateTime beforeMonthTime = todayTime.minusMonths(0);
        beforeMonthTime = LocalDateTime.of(beforeMonthTime.getYear(), beforeMonthTime.getMonth(), beforeMonthTime.with(lastDayOfMonth()).getDayOfMonth(), 23, 59, 59);

        //현재 개월의 차트 존재 유무
        boolean isChartExist = chartRepository.findById(charId).isPresent();

        //현재 월의 차트 정보가 없다면
        if (!isChartExist) {
            //차트 생성
            processCreateChart(charId, beforeMonthTime);
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

    public void processCreateChart(String charId, LocalDateTime beforeMonthTime) {

        //지난 거래내역 존재하는지 확인
        boolean isReserveExist = reserveRepository.findAllByCreateTimeBefore(beforeMonthTime)
                .isEmpty();

        //UNREGISTER 상태가 아니고 조회 이전 월 이전 총 회원수 조회
//        log.info("debug!!! beforMonthTime = {}", beforeMonthTime);
        Integer memberCount = memberRepository.countAllByStatusNotAndCreateTimeBefore(MemberStatus.UNREGISTER, beforeMonthTime);

        //거래내역이 존재하지 않다면
        if (isReserveExist) {
            //현재 회원수만 기록한 관리자 차트 생성 및 저장
            Chart chart = new Chart().toEntity(charId, 0L, 0L, 0L, (long) memberCount, 0L);
            chartRepository.save(chart);
        }
        //거래내역이 존재한다면
        else {
            //이전 모든 거래내역 조회
            List<Reserve> findAllReserveListBefore = reserveRepository.findAllByCreateTimeBefore(beforeMonthTime)
                    .orElseThrow(() -> new CustomException(CustomErrorCode.EMPTY_RESERVE));

            Long cumuAmount = 0L;
            Long cumuDiscount = 0L;
            Long finalAmount = 0L;
            Long totalMember = (long) memberCount;
            Long totalReserve = (long) findAllReserveListBefore.size();

            for (Reserve reserve : findAllReserveListBefore) {
                cumuAmount += reserve.getAmount();
                cumuDiscount += reserve.getDiscount();
                finalAmount += reserve.getAmount() - reserve.getDiscount();
            }

            //차트 생성 및 저장
            Chart chart = new Chart().toEntity(charId, cumuAmount, cumuDiscount, finalAmount, totalMember, totalReserve);
            chartRepository.save(chart);
        }
    }

    @Transactional
    @Override
    public RefundReserveCancelDTO refundCancel(String ticket, ReserveStatus status) {
        //예매ID와 결제 완료된 상태인 예매 조회
        List<Reserve> reserveList = reserveRepository.findAllByTicketAndStatus(ticket, ReserveStatus.PAYMENT)
                .orElseThrow(() -> new CustomException(CustomErrorCode.EMPTY_RESERVE));

        KakaoPay kakaoPay = null;

        Integer cumuAmount = 0;
        Integer cumuDiscount = 0;
        Integer cumuFianlAmount = 0;


        for (Reserve reserve : reserveList) {

            //해당 회원이 예매했던 상세 좌석/가격 정보 조회
            ReserveTimeSeatPrice reserveTimeSeatPrice = reserveTimeSeatPriceRepository.findById(reserve.getReserveTimeSeatPriceIndex())
                    .orElseThrow(() -> new CustomException(CustomErrorCode.ERROR_RESERVE_TIME_SEAT_PRICE));
            //상태 변경 및 환불 시간 갱신
            reserve.updateStatus(status);
            reserve.updateRefundTime(status, LocalDateTime.now());

            //수량 증가 (단일 환불임으로 1만 증가)
            reserveTimeSeatPrice.addQuantity(1);

            //결제 수단이 카카오페이인 경우
            if (reserve.getMethod().equals("KAKAOPAY")) {
                kakaoPay = kakaoPayRepository.findByReserve(reserve)
                        .orElseThrow(() -> new CustomException(CustomErrorCode.EMPTY_KAKAO_TID));

            }
            cumuAmount += reserve.getAmount();
            cumuDiscount += reserve.getDiscount();
            cumuFianlAmount += reserve.getFinalAmount();
        }
        if (Objects.isNull(kakaoPay)) {
            return new RefundReserveCancelDTO().toDTO(cumuAmount, cumuDiscount, cumuFianlAmount, reserveList.get(0).getMethod());

        }
        return new RefundReserveCancelDTO().toDTO(cumuAmount, cumuDiscount, cumuFianlAmount, reserveList.get(0).getMethod(), kakaoPay.getKakaoTID());
    }

    @Transactional
    @Override
    public List<SearchPaymentReserveDTO> searchAllPayment(Long memberIndex) {
        //회원 조회
        Member findMember = memberRepository.findById(memberIndex)
                .orElseThrow(() -> new CustomException(CustomErrorCode.EMPTY_MEMBER));

        //회원이 예매한 내역 리스트
//        List<Reserve> reserveList = findMember.getReserveList();
        List<Reserve> paymentReserveList = reserveRepository.findAllByMemberAndStatus(findMember, ReserveStatus.PAYMENT)
                .orElseThrow(() -> new CustomException(CustomErrorCode.EMPTY_RESERVE));

        //응답 DTO
        List<SearchPaymentReserveDTO> reserveDTOList = new ArrayList<>();
        //중복 확인
        List<String> duplicateList = new ArrayList<>();

        for (Reserve reserve : paymentReserveList) {
            boolean isDuplicate = false;
//            log.info("reserve.getTicket() = {}", reserve.getTicket());
            //티켓 추출
            String ticket = reserve.getTicket();
            //이미 존재한다면 생략
            for (String duplicate : duplicateList) {
                if (duplicate.equals(ticket)) {
//                    log.info("break!!!");
                    isDuplicate = true;
                    break;
                }
            }
            if (!isDuplicate) {
//                log.info("counting!!!");
                //총 예매 개수
                Integer count = reserveRepository.countByTicket(ticket);
                Integer finalAmount = reserveRepository.sumByTicket(ticket);
                reserveDTOList.add(new SearchPaymentReserveDTO().toDTO(reserve, count, finalAmount));
                //중복 확인 리스트 추가
                duplicateList.add(ticket);
            }
        }

        return reserveDTOList;
    }

    @Transactional
    @Override
    public List<SearchRefundCancelReserveDTO> searchAllRefundCancel(Long memberIndex) {
        //회원 조회
        Member findMember = memberRepository.findById(memberIndex)
                .orElseThrow(() -> new CustomException(CustomErrorCode.EMPTY_MEMBER));

        //회원이 예매한 내역 리스트
//        List<Reserve> reserveList = findMember.getReserveList();
        List<Reserve> paymentReserveList = reserveRepository.findAllByMemberAndStatusIn(findMember,
                        new ArrayList<>(Arrays.asList(ReserveStatus.CANCEL, ReserveStatus.REFUND)))
                .orElseThrow(() -> new CustomException(CustomErrorCode.EMPTY_RESERVE));

        //응답 DTO
        List<SearchRefundCancelReserveDTO> reserveDTOList = new ArrayList<>();
        //중복 확인
        List<String> duplicateList = new ArrayList<>();

        for (Reserve reserve : paymentReserveList) {
            boolean isDuplicate = false;
//            log.info("reserve.getTicket() = {}", reserve.getTicket());
            //티켓 추출
            String ticket = reserve.getTicket();
            //이미 존재한다면 생략
            for (String duplicate : duplicateList) {
                if (duplicate.equals(ticket)) {
//                    log.info("break!!!");
                    isDuplicate = true;
                    break;
                }
            }

            if (!isDuplicate) {
//                log.info("counting!!!");
                //총 예매 개수
                Integer count = reserveRepository.countByTicket(ticket);
                Integer finalAmount = reserveRepository.sumByTicket(ticket);
                reserveDTOList.add(new SearchRefundCancelReserveDTO().toDTO(reserve, count));
                //중복 확인 리스트 추가
                duplicateList.add(ticket);
            }
        }

        return reserveDTOList;
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
