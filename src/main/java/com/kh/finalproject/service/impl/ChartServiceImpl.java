package com.kh.finalproject.service.impl;

import com.kh.finalproject.dto.chart.ChartDTO;
import com.kh.finalproject.entity.Chart;
import com.kh.finalproject.entity.Reserve;
import com.kh.finalproject.entity.enumurate.MemberStatus;
import com.kh.finalproject.exception.CustomErrorCode;
import com.kh.finalproject.exception.CustomException;
import com.kh.finalproject.repository.ChartRepository;
import com.kh.finalproject.repository.MemberRepository;
import com.kh.finalproject.repository.ReserveRepository;
import com.kh.finalproject.service.ChartService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static java.time.temporal.TemporalAdjusters.lastDayOfMonth;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ChartServiceImpl implements ChartService {

    private final ChartRepository chartRepository;

    private final ReserveRepository reserveRepository;

    private final MemberRepository memberRepository;

    @Override
    public List<ChartDTO> searchByIndex() {
        List<ChartDTO> chartDTO = new ArrayList<>();
        List<Chart> chartList = chartRepository.findAll();
        for(Chart e : chartList) {
            ChartDTO chartDTO1 = new ChartDTO().toDTO(e);
            chartDTO.add(chartDTO1);
        }
        return chartDTO;
    }

    /**
     * 관리자 차트 생성 서비스
     * 최대 3달 이전까지 차트 생성
     * 만약 차트가 존재한다면 break
     */
    @Transactional
    @Override
    public void createCharList() {
//        LocalDateTime now = LocalDateTime.now();
//        int nowYear = now.getYear();
//        int nowMonth = now.getDayOfMonth();

        //최근 3개월간 차트 생성 및 저장
        //차트가 있다면 생략
        for (int i = 0; i < 3; i++) {
            LocalDateTime todayTime = LocalDateTime.now();
            LocalDateTime beforeMonthTime = todayTime.minusMonths(i);
            int nowYear = beforeMonthTime.getYear();
            int nowMonth = beforeMonthTime.getMonthValue();
            //마지막 날짜 기준 (월말 마지막 일 : 23:59:59)
            beforeMonthTime = LocalDateTime.of(beforeMonthTime.getYear(), beforeMonthTime.getMonth(), beforeMonthTime.with(lastDayOfMonth()).getDayOfMonth(), 23, 59, 59);

            String charId = nowYear + "/" + nowMonth;

            boolean isChartExist = chartRepository.findById(charId).isPresent();
            if (isChartExist) continue;

            //지난 거래내역 존재하는지 확인
            boolean isReserveExist = reserveRepository.findAllByCreateTimeBefore(beforeMonthTime)
                    .isEmpty();

            //UNREGISTER 상태가 아니고 조회 이전 월 이전 총 회원수 조회
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
    }
}