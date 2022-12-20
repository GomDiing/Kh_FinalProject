package com.kh.finalproject.service.impl;

import com.kh.finalproject.dto.casting.CastingDTO;
import com.kh.finalproject.dto.casting.CastingSimpleDTO;
import com.kh.finalproject.dto.member.PagingMemberDTO;
import com.kh.finalproject.dto.product.*;
import com.kh.finalproject.dto.reserveTimeSeatPrice.ReserveTimeSeatPriceDTO;
import com.kh.finalproject.dto.reservetime.DetailProductReserveTimeDTO;
import com.kh.finalproject.dto.reservetime.DetailProductReserveTimeSetDTO;
import com.kh.finalproject.dto.reservetime.DetailProductReserveTimeCastingDTO;
import com.kh.finalproject.dto.reservetime.SearchReserveList;
import com.kh.finalproject.dto.seatPrice.SeatPriceDTO;
import com.kh.finalproject.dto.statistics.StatisticsDTO;
import com.kh.finalproject.entity.*;
import com.kh.finalproject.exception.CustomErrorCode;
import com.kh.finalproject.exception.CustomException;
import com.kh.finalproject.repository.*;
import com.kh.finalproject.service.ProductService;
import com.kh.finalproject.vo.CalendarReserveInfoVO;
import com.kh.finalproject.vo.CastingInfoVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.util.*;

import static java.time.temporal.TemporalAdjusters.firstDayOfNextMonth;
import static java.time.temporal.TemporalAdjusters.lastDayOfMonth;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final StatisticsRepository statisticsRepository;
    private final CastingRepository castingRepository;
    private final ReserveTimeRepository reserveTimeRepository;
    private final ReserveTimeCastingRepository reserveTimeCastingRepository;
    private final ReserveTimeSeatPriceRepository reserveTimeSeatPriceRepository;
    @Override
    public List<BrowseKeywordDTO> browseByKeyword(String title) {

        List<BrowseKeywordDTO> browseKeywordDTOList = new ArrayList<>();
        // 영어 대소문자 구분 없이, 한글 다 검색 가능
        if(title.matches(".*[a-zA-Z0-9 ㄱ-ㅎㅏ-ㅣ가-힣]+.*")) {
            List<Product> productList = productRepository.findByTitleContaining(title);
            for(Product product : productList) {
                BrowseKeywordDTO browseKeywordDTO = new BrowseKeywordDTO().toDTO(product);
                browseKeywordDTOList.add(browseKeywordDTO);
            }
        } else {
            throw new CustomException(CustomErrorCode.NOT_SEARCH_DATA);
        }
        return browseKeywordDTOList;
    }

    /*관리자 페이지 전시 전체 조회(페이지네이션)*/
    @Override
    public PagingProductDTO searchAll(Pageable pageable) {
        List<ProductDTO> productDTOList = new ArrayList<>();
        Page<Product> pageProductList = productRepository.findAll(pageable);

        List<Product> productList = pageProductList.getContent();
        Integer totalPages = pageProductList.getTotalPages();
        Integer page = pageProductList.getNumber()+1;
        Long totalResults = pageProductList.getTotalElements();

        for (Product e : productList) {
            ProductDTO productDTO = new ProductDTO().toDTO(e);
            productDTOList.add(productDTO);
        }
        PagingProductDTO pagingProductDTO =new PagingProductDTO().toPageDTO(page,totalPages,totalResults,productDTOList);
        return pagingProductDTO;
    }



    @Override
    public DetailProductDTO detailProductPage(String productCode) {
        //상품 조회, 없다면 예외 처리
        Product findProduct = productRepository.findByCode(productCode)
                .orElseThrow(() -> new CustomException(CustomErrorCode.ERROR_EMPTY_PRODUCT_CODE));

        //통계 조회, 없다면 예외 처리
        Statistics findStatic = statisticsRepository.findByProduct(findProduct)
                .orElseThrow(() -> new CustomException(CustomErrorCode.ERROR_EMPTY_STATIC_BY_PRODUCT_CODE));

        //통계 Entity -> DTO
        StatisticsDTO statisticsDTO = new StatisticsDTO().toDTO(findStatic, findProduct);

        //좌석/가격 리스트 조회 및 Entity -> DTO 리스트
        List<SeatPriceDTO> seatPriceDTOList = createSeatPriceDTOList(findProduct);

        //상시 혹은 한정 상품 여부 판단
        Boolean isLimit = isLimitOrAlways(findProduct);

        //예매 가능 리스트, 익월 예매 가능 여부, 예매 시간 담을 VO
        CalendarReserveInfoVO calendarReserveInfoVO;
        //예매 정보 및 달력 로직
        calendarReserveInfoVO = processCalendarReserveInfo(findProduct, isLimit, 0, 0);
        //예매 집합 생성 및 예매 정보 연결
        List<DetailProductReserveTimeSetDTO> reserveTimeSetDTOList
                = createReserveSet(calendarReserveInfoVO.getReserveTimeListFirstList());

        //캐스팅 리스트, 시간별 예매 캐스팅 리스트 담을 VO
        CastingInfoVO castingInfoVO = null;
        //캐스팅 정보 및 시간별 캐스팅 정보 처리 로직
        //캐스팅 정보가 있으면 캐스팅 정보 조회
        if (findProduct.getIsInfoCasting()) {
            castingInfoVO = createCastingInfo(findProduct, calendarReserveInfoVO.getReserveTimeListFirstList());
        }

        //캘린더에 좌석/가격 정보 추가
        processTimeSeatPrice(calendarReserveInfoVO.getReserveTimeListFirstList(), seatPriceDTOList);

        //상세 상품 체크 리스트 생성
        DetailProductCheckList detailProductCheckList = new DetailProductCheckList().toDTO(findProduct, calendarReserveInfoVO, isLimit);

        //상세 상품 간단 정보 생성
        DetailProductCompactDTO detailProductCompactDTO = new DetailProductCompactDTO().toDTO(findProduct);

        //캐스팅 정보가 없는 경우
        if (Objects.isNull(castingInfoVO)) {
            return new DetailProductDTO().toDTO(detailProductCheckList, detailProductCompactDTO, reserveTimeSetDTOList, statisticsDTO, seatPriceDTOList);
        }
        //캐스팅 정보가 있는 경우
        else
            return new DetailProductDTO().toDTO(detailProductCheckList, detailProductCompactDTO, reserveTimeSetDTOList,
                    castingInfoVO.getCastingDTOList(), statisticsDTO, seatPriceDTOList);
    }

    /**
     * 달력 월 단위 이동 서비스
     * @param productCode: 조회 상품 코드
     * @param year: 조회 상품 연도
     * @param month: 조회 상품 월
     * @return 조회한 월 내에 예매 가능 일자 리스트와 첫번째로 예매 가능한 날의 인덱스 및 좌석 정보가 출력
     */
    @Override
    public DetailProductDTO reserveCalendarMonth(String productCode, Integer year, Integer month) {
        //상품 조회, 없다면 예외 처리
        Product findProduct = productRepository.findByCode(productCode)
                .orElseThrow(() -> new CustomException(CustomErrorCode.ERROR_EMPTY_PRODUCT_CODE));

        //좌석/가격 리스트 조회 및 Entity -> DTO 리스트
        List<SeatPriceDTO> seatPriceDTOList = createSeatPriceDTOList(findProduct);

        //상시 혹은 한정 상품 여부 판단
        Boolean isLimit = isLimitOrAlways(findProduct);

        //예매 정보 및 달력 로직
        CalendarReserveInfoVO calendarReserveInfoVO = processCalendarReserveInfo(findProduct, isLimit, year, month);
        //예매 집합 생성 및 예매 정보 연결
        List<DetailProductReserveTimeSetDTO> reserveTimeSetDTOList
                = createReserveSet(calendarReserveInfoVO.getReserveTimeListFirstList());

        processTimeSeatPrice(calendarReserveInfoVO.getReserveTimeListFirstList(), seatPriceDTOList);

        DetailProductCheckList detailProductCheckList = new DetailProductCheckList().toDTO(findProduct, calendarReserveInfoVO, isLimit);

//        return new SearchReserveList().updateReserveTime(reserveTimeSetDTOList, calendarReserveInfoVO.getReserveTimeDayListInMonth());

        return new DetailProductDTO().toDTO(detailProductCheckList, reserveTimeSetDTOList);
    }

    public DetailProductReserveTimeSetDTO reserveCalendarDay(String productCode, Integer year, Integer month, Integer day) {

        //상품 조회, 없다면 예외 처리
        Product findProduct = productRepository.findByCode(productCode)
                .orElseThrow(() -> new CustomException(CustomErrorCode.ERROR_EMPTY_PRODUCT_CODE));

        //좌석/가격 리스트 조회 및 Entity -> DTO 리스트
        List<SeatPriceDTO> seatPriceDTOList = createSeatPriceDTOList(findProduct);
        log.info("seatPriceDTOList = {}", seatPriceDTOList);

        LocalDateTime firstPotionOfDay = LocalDateTime.of(year, month, day, 0, 0);
        LocalDateTime lastPositionOfDay = LocalDateTime.of(year, month, day, 23, 59);

        //첫 예매 날짜 월의 첫 날짜에서 마지막 날짜 사이 예매 정보 조회
        //즉, 월 내 예매 정보 추출
        List<ReserveTime> findReserveTimeWithinDay = reserveTimeRepository.findAllByProductAndTimeBetween(findProduct, firstPotionOfDay, lastPositionOfDay)
                .orElseThrow(() -> new CustomException(CustomErrorCode.EMPTY_RESERVE_TIME));

        //예매 정보 리스트 초기화
        List<DetailProductReserveTimeDTO> detailProductReserveTimeDTOList = new ArrayList<>();

        //월 내 예매 정보 Entity 리스트 -> DTO 리스트
        //첫 예매 가능 월 내 예매 가능 날짜 리스트 추가
        for (ReserveTime reserveTime : findReserveTimeWithinDay) {
            DetailProductReserveTimeDTO reserveTimeDTO = new DetailProductReserveTimeDTO().toDTO(reserveTime);
            detailProductReserveTimeDTOList.add(reserveTimeDTO);
        }

        //캐스팅 리스트, 시간별 예매 캐스팅 리스트 담을 VO
        CastingInfoVO castingInfoVO = null;
        //캐스팅 정보 및 시간별 캐스팅 정보 처리 로직
        //캐스팅 정보가 있으면 캐스팅 정보 조회
        if (findProduct.getIsInfoCasting()) {
            castingInfoVO = createCastingInfo(findProduct, detailProductReserveTimeDTOList);
        }

        //캘린더에 좌석/가격 정보 추가
        processTimeSeatPrice(detailProductReserveTimeDTOList, seatPriceDTOList);

        return new DetailProductReserveTimeSetDTO().toDTO(detailProductReserveTimeDTOList);
    }

    /**
     * 좌석/가격 리스트 조회 및 Entity -> DTO 변환
     * @param findProduct 상품 Entity
     * @return 좌석/가격 DTO 리스트
     */
    private static List<SeatPriceDTO> createSeatPriceDTOList(Product findProduct) {
        List<SeatPriceDTO> seatPriceDTOList = new LinkedList<>();
        for (SeatPrice seatPrice : findProduct.getSeatPrice()) {
            seatPriceDTOList.add(new SeatPriceDTO().toDTO(seatPrice));
        }
        return seatPriceDTOList;
    }

    /**
     * 캐스팅 조회 및 시간별 캐스팅 정보 처리 로직
     * @param findProduct 상품 Entity
     * @param reserveTimeDTOList 예매 시간 정보 리스트
     * @return 캐스팅 정보 VO: 캐스팅 DTO 리스트 / 시간별 예매 캐스팅 DTO 리스트 포함
     */
    private CastingInfoVO createCastingInfo(Product findProduct, List<DetailProductReserveTimeDTO> reserveTimeDTOList) {
        CastingInfoVO castingInfoVO = processCastingInfo(findProduct);
        //시간별 캐스팅 정보가 존재 시 캘린더에 캐스팅 정보 추가
        if (findProduct.getIsInfoTimeCasting()) {
            addCalendarCompactCastingInfo(reserveTimeDTOList, castingInfoVO.getCastingDTOList());
        }
        return castingInfoVO;
    }


    /**
     * 한정 - 상시 상품 여부 판단
     */
    Boolean isLimitOrAlways(Product findProduct) {
        //한정 - 상시 상품 유무 확인
        Boolean isLimit = true;

        //오늘 이후 첫번째 예매 정보 조회
        ReserveTime findFirstReserveTime = reserveTimeRepository.findFirstByProductAndTimeAfter(findProduct, LocalDateTime.now())
                .orElseThrow(() -> new CustomException(CustomErrorCode.EMPTY_RESERVE_TIME));

        //한정 - 상시 상품 판단
        if (findFirstReserveTime.getTurn() == 0) {
            isLimit = false;
        }

        return isLimit;
    }

    /**
     * 예매정보 및 달력 담당 로직
     * 첫 예매 정보 조회
     * 첫 예매 월 내 모든 예매 정보 조회
     * 첫 예매 월 이후 예매 정보 존재 여부 판단
     */
    private CalendarReserveInfoVO processCalendarReserveInfo(Product findProduct, Boolean isLimit, Integer year, Integer month) {
        LocalDateTime nowTime;
        if (year == 0 && month == 0) {
            nowTime = LocalDateTime.now();
        }
        else {
            nowTime = LocalDateTime.of(year, month, 1, 0, 0);
        }
        //첫 예매 정보 조회, 없다면 예외 처리
        ReserveTime findFirstReserveTime = reserveTimeRepository.findFirstByProductAndTimeAfter(findProduct, nowTime)
                .orElseThrow(() -> new CustomException(CustomErrorCode.EMPTY_RESERVE_TIME));

        //첫 예매 정보 Entity -> DTO
        DetailProductReserveTimeDTO reserveTimeFirstDTO = new DetailProductReserveTimeDTO().toDTO(findFirstReserveTime);

        //예매 정보 리스트 초기화
        List<DetailProductReserveTimeDTO> detailProductReserveTimeDTOList = new ArrayList<>();

        //상시 상품일 경우
        if (!isLimit) {
            detailProductReserveTimeDTOList.add(reserveTimeFirstDTO);
            return new CalendarReserveInfoVO().toVO(false, false, reserveTimeFirstDTO, detailProductReserveTimeDTOList);
        }

        //첫 예매 가능 월 내 예매 가능 날짜 리스트
        List<Integer> reserveTimeDayListInMonth = new ArrayList<>();
        //현 날짜
        LocalDateTime now = LocalDateTime.now();
        //첫 예매 날짜
        LocalDateTime firstTime = findFirstReserveTime.getTime();

        // ***** 이번달 예매 정보 추출 로직 *****
        //첫 예매 날짜 월의 예매 가능 첫 날짜
        //첫 예매 날짜의 월이 현재 월의 이후면 시(hour)과 일(minute)을 0으로 설정
        LocalDateTime firstPositionOfMonth = LocalDateTime.of(firstTime.getYear(), firstTime.getMonth(), firstTime.getDayOfMonth(), 0, 0);
        //첫 예매 날짜 월의 예매 가능 마지막 날짜
        LocalDateTime lastPositionOfMonth = LocalDateTime.of(firstTime.getYear(), firstTime.getMonth(), firstTime.with(lastDayOfMonth()).getDayOfMonth(), 23, 59);
        //첫 예매 날짜의 월이 현재 월과 동일하다면 시(hour)과 분(minute)을 현재와 동일하게 설정
        if (firstTime.getYear() == LocalDateTime.now().getYear()) {
            if (firstTime.getMonth() == LocalDateTime.now().getMonth()) {
                firstPositionOfMonth = LocalDateTime.of(now.getYear(), now.getMonth(), now.getDayOfMonth(), now.getHour(), now.getMinute());
            }
        }

        //첫 예매 날짜 월의 첫 날짜에서 마지막 날짜 사이 예매 정보 조회
        //즉, 월 내 예매 정보 추출
        List<ReserveTime> findReserveTimeWithinMonth = reserveTimeRepository.findAllByProductAndTimeBetween(findProduct, firstPositionOfMonth, lastPositionOfMonth)
                .orElseThrow(() -> new CustomException(CustomErrorCode.EMPTY_RESERVE_TIME));

        //월 내 예매 정보 Entity 리스트 -> DTO 리스트
        //첫 예매 가능 월 내 예매 가능 날짜 리스트 추가
        for (ReserveTime reserveTime : findReserveTimeWithinMonth) {
            DetailProductReserveTimeDTO reserveTimeDTO = new DetailProductReserveTimeDTO().toDTO(reserveTime);
            detailProductReserveTimeDTOList.add(reserveTimeDTO);
            //예매 가능 날짜 리스트 추가 및 중복 제외
            if (!reserveTimeDayListInMonth.contains(reserveTimeDTO.getTime().getDayOfMonth())) {
                reserveTimeDayListInMonth.add(reserveTimeDTO.getTime().getDayOfMonth());
            }
        }

        //첫 예매 가능 월의 다음 달 1일 날짜
        LocalDateTime firstPositionOfNextMonth = LocalDateTime.of(firstTime.with(firstDayOfNextMonth()).getYear(), firstTime.with(firstDayOfNextMonth()).getDayOfMonth(), 1, 0, 0);

        //첫 예매 월 이후 예매 정보 존재 여부
        Boolean isNextMonthProductExist = reserveTimeRepository.findAllByProductAndTimeAfter(findProduct, firstPositionOfNextMonth)
                .isPresent();

        // ***** 지난달 예매 날짜 설정 로직 *****
        LocalDateTime firstPositionOfLastMonth = null;

        //지난달 첫번째 날짜 (첫 예매 날짜가 1월이라면)
        if (firstTime.getMonthValue() == 1) firstPositionOfLastMonth = LocalDateTime.of(firstTime.getYear() - 1, 12, 1, 0, 0);
        else firstPositionOfLastMonth = LocalDateTime.of(firstTime.getYear(), firstTime.getMonthValue() - 1, 1, 0, 0);
        LocalDateTime lastPositionOfLastMonth = LocalDateTime.of(firstPositionOfLastMonth.getYear(), firstPositionOfLastMonth.getMonth(), firstPositionOfLastMonth.with(lastDayOfMonth()).getDayOfMonth(), 23, 59);

        Boolean isLastMonthProductExist = reserveTimeRepository.findAllByProductAndTimeBefore(findProduct, lastPositionOfLastMonth).isPresent();

        DetailProductReserveTimeDTO reserveTimeFirstDTOInMonth = detailProductReserveTimeDTOList.get(0);
        List<DetailProductReserveTimeDTO> detailProductReserveTimeFirstDTOList = new ArrayList<>();
        detailProductReserveTimeFirstDTOList.add(reserveTimeFirstDTOInMonth);

//        return new CalendarReserveInfoVO().toVO(reserveTimeDayListInMonth, isNextMonthProductExist, reserveTimeFirstDTOInMonth, detailProductReserveTimeDTOList);
        return new CalendarReserveInfoVO().toVO(reserveTimeDayListInMonth, isNextMonthProductExist, isLastMonthProductExist, reserveTimeFirstDTOInMonth, detailProductReserveTimeFirstDTOList);
    }

    /**
     * 예매 집합 생성 및 예매 정보 연결 로직
     * 공연이 있는 날에 회차별 공연 정보를 내부 리스트로 추가
     * 이때 공연이 있는 날을 예매 집합(Set)
     * 상세 예매 시간 별 집합 리스트 생성
     */
    private List<DetailProductReserveTimeSetDTO> createReserveSet(List<DetailProductReserveTimeDTO> reserveTimeDTOList) {
        List<DetailProductReserveTimeSetDTO> reserveTimeSetDTOList = new ArrayList<>();
        //예매 정보 리스트 순회
        for (DetailProductReserveTimeDTO reserveTimeDTO :reserveTimeDTOList) {
            //예매 정보 DTO -> 예매 집합 DTO 변환
            DetailProductReserveTimeSetDTO detailProductReserveTimeSetDTO = new DetailProductReserveTimeSetDTO().toDTO(reserveTimeDTO);
            //동일한 예매 집합이 존재 여부 확인
            //예매 집합은 중복을 허용하지 않음
            boolean isContainDetailSet = false;
            //예매 집합 리스트 순회
            for (DetailProductReserveTimeSetDTO reserveTimeSetDTO : reserveTimeSetDTOList) {
                //동일한 예매 집합 존재시 true 변환 및 break
                if (reserveTimeSetDTO.getDate().equals(detailProductReserveTimeSetDTO.getDate())) {
                    isContainDetailSet = true;
                    break;
                }
            }
            //동일한 예매 집합이 존재하지 않을 시 해당 예매 집합 생성
            if (!isContainDetailSet) {
                reserveTimeSetDTOList.add(detailProductReserveTimeSetDTO);
            }
            //예매 집합 리스트 순회
            //예매 정보의 시간과 예매 집합의 시간이 일치하면 해당 예매 집합에 예매 정보 추가
            for (DetailProductReserveTimeSetDTO reserveTimeSetDTO : reserveTimeSetDTOList) {
                if (reserveTimeSetDTO.getDate().equals(reserveTimeDTO.getDate())) {
                    reserveTimeSetDTO.getDetailProductReserveTimeDTOList().add(reserveTimeDTO);
                }
            }
        }

        return reserveTimeSetDTOList;
    }

    /**
     * 캐스팅 담당 로직
     * 상품에 속한 모든 캐스팅 정보 리스트 저장
     */
    private CastingInfoVO processCastingInfo(Product findProduct) {
        //해당 상품에 속하는 캐스팅 리스트 조회, Order 순서대로 조회
        List<Casting> findCastingList = castingRepository.findAllByProductOrderByOrder(findProduct)
                .orElseThrow(() -> new CustomException(CustomErrorCode.EMPTY_CASTING));

        //캐스팅 정보 리스트
        List<CastingDTO> castingDTOList = new ArrayList<>();

        //캐스팅 엔티티 리스트 -> 캐스팅 리스트 변환
        for (Casting casting : findCastingList) {
            castingDTOList.add(new CastingDTO().toDTO(casting));
        }

        //캐스팅 정보 VO에 캐스팅 정보 갱신 후 반환
        return new CastingInfoVO().toVO(castingDTOList);
    }

    /**
     * 캘린더에 캐스팅 정보 추가 로직
     * 예매 정보 리스트와 캐스팅 리스트를 인자로 받아
     * 캘린더에 표시할 간단 캐스팅 정보 생성 로직 / 캘린더의 캐스팅 정보 탭 생성 로직
     */
    private void addCalendarCompactCastingInfo(List<DetailProductReserveTimeDTO> reserveTimeDTOList, List<CastingDTO> castingDTOList) {
        for (DetailProductReserveTimeDTO reserveTime : reserveTimeDTOList) {
            //예매 시간별 캐스팅 리스트 조회, 없다면 예외 처리
            List<ReserveTimeCasting> findReserveTimeCastingList = reserveTimeCastingRepository.findAllByReserveTimeIndex(reserveTime.getIndex())
                    .orElseThrow(() -> new CustomException(CustomErrorCode.EMPTY_RESERVE_TIME_CASTING));

            //시간별 캐스팅 리스트 순회하며 캐스팅 고유번호를 캐스팅 고유번호 리스트에 추가
            for (ReserveTimeCasting reserveTimeCasting : findReserveTimeCastingList) {
                String reserveTimeCastingId = reserveTimeCasting.getCasting().getId();
                for (CastingDTO castingDTO : castingDTOList) {
                    if (castingDTO.getId().equals(reserveTimeCastingId)) {
                        //조회한 후 미리 생성한 캐스팅 리스트에 추가
                        reserveTime.addCastingList(castingDTO.getActor());
                    }
                }
            }
        }
    }

    /**
     * 시간별 캐스팅 담당 로직
     * 예매 정보 리스트와 캐스팅 리스트를 인자로 받아
     * 캘린더에 표시할 간단 캐스팅 정보 생성 로직 / 캘린더의 캐스팅 정보 탭 생성 로직
     */
    private List<DetailProductReserveTimeCastingDTO> processTimeCastingInfo(List<DetailProductReserveTimeDTO> reserveTimeWithinMonth, List<CastingDTO> castingDTOList) {
        //시간별 캐스팅 정보 리스트
        List<DetailProductReserveTimeCastingDTO> detailProductReserveTimeCastingDTOList = new ArrayList<>();

        for (DetailProductReserveTimeDTO reserveTime : reserveTimeWithinMonth) {
            //예매 시간별 캐스팅 리스트 조회, 없다면 예외 처리
            List<ReserveTimeCasting> findReserveTimeCastingList = reserveTimeCastingRepository.findAllByReserveTimeIndex(reserveTime.getIndex())
                    .orElseThrow(() -> new CustomException(CustomErrorCode.EMPTY_RESERVE_TIME_CASTING));

            //캐스팅 정보 탭과 캘린더에 표시할 간단 캐스팅 리스트
            List<CastingSimpleDTO> castingSimpleDTOList = new LinkedList<>();

            //시간별 캐스팅 리스트 순회하며 캐스팅 고유번호를 캐스팅 고유번호 리스트에 추가
            for (ReserveTimeCasting reserveTimeCasting : findReserveTimeCastingList) {
                String reserveTimeCastingId = reserveTimeCasting.getCasting().getId();
                for (CastingDTO castingDTO : castingDTOList) {
                    CastingSimpleDTO castingSimpleDTO;
                    if (castingDTO.getId().equals(reserveTimeCastingId)) {
                        //조회한 후 미리 생성한 캐스팅 리스트에 추가
                        castingSimpleDTO = new CastingSimpleDTO().toDTO(castingDTO);
                        castingSimpleDTOList.add(castingSimpleDTO);
                        //캘린더 내 캐스팅 정보 추가
                        reserveTime.addCastingList(castingSimpleDTO.getActor());
                    }
                }

            }
            //요일 설정 : ex) (토) , (일)
            String dayNameKorean = "(" + reserveTime.getTime().getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.KOREAN) + ")";
            //월/일(요일) 설정 : ex) 09/23(토) , 10/21(일)
            String monthDayName = reserveTime.getDate().substring(5) + dayNameKorean;

            //0 -> 00 변환
            String hourOfHourMin = String.valueOf(reserveTime.getHour());
            if (hourOfHourMin.equals("0")) hourOfHourMin = "00";
            String minuteOfHourMin = String.valueOf(reserveTime.getMinute());
            if (minuteOfHourMin.equals("0")) minuteOfHourMin = "00";
            //{시간}:{분} 설정 : ex) 17:30, 00:00
            String hourMin = hourOfHourMin + ":" + minuteOfHourMin;

            //시간별 캐스팅 정보 리스트 추가
            detailProductReserveTimeCastingDTOList.add(new DetailProductReserveTimeCastingDTO().toDTO(monthDayName, hourMin, castingSimpleDTOList));
        }
        return detailProductReserveTimeCastingDTOList;
    }

    /**
     * 시간별 좌석/가격 담당 로직
     * 캘린더 밑에 표시될 좌석/가격 정보 생성 로직
     * @param seatPriceDTOList 예매 리스트
     * @param detailProductReserveTimeDTOList 좌석/가격 리스트
     */
    public void processTimeSeatPrice(List<DetailProductReserveTimeDTO> detailProductReserveTimeDTOList, List<SeatPriceDTO> seatPriceDTOList) {
        //상세 예매 시간 리스트 순회
        for (DetailProductReserveTimeDTO detailProductReserveTimeDTO : detailProductReserveTimeDTOList) {
            //시간별 좌석/가격 리스트 초기화
            List<ReserveTimeSeatPriceDTO> reserveTimeSeatPriceDTOList = new ArrayList<>();
            //좌석 리스트 순회
            for (SeatPriceDTO seatPriceDTO : seatPriceDTOList) {
                ReserveTimeSeatPrice reserveTimeSeatPrice = reserveTimeSeatPriceRepository.findByReserveTimeIndexAndSeatPriceIndex(detailProductReserveTimeDTO.getIndex(), seatPriceDTO.getIndex())
                        .orElseThrow(() -> new IllegalArgumentException("시간별 좌석 정보가 없습니다"));
                //좌석/가격 정보를 캘린더에 저장
                //시간별 좌석/가격 리스트 DTO 변환 및 리스트에 추가
                reserveTimeSeatPriceDTOList.add(new ReserveTimeSeatPriceDTO().toDTO(reserveTimeSeatPrice));
            }
            //캘린더 정보 갱신
            detailProductReserveTimeDTO.updateReserveTimeSeatPrice(reserveTimeSeatPriceDTOList);
        }
    }
}
