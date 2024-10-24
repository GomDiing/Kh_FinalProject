import datetime

from selenium.webdriver.chrome.webdriver import WebDriver

import Constants_Selector
import time

from selenium.webdriver.common.by import By
from selenium.common import TimeoutException, NoSuchElementException

from Common import print_log, log_error

from DataClass import ProductInfo, CalendarInfo, DetailLocationInfo, DetailCastingTimeInfo, CalendarNextMonth


# 캘린더 정보 탐색 메서드
def extractCalendarInfo(browser: WebDriver, product_info: ProductInfo) -> None:
    # 탐색결과 담을 dict 객체
    print_log("캘린더 정보 탐색")
    print_log('네비 탭 > 정보 탭 -> 캐스팅 정보 존재')

    # 다음 달 이동이 불가능 할 때 까지 계속 조회
    while True:
        print_log(f"캘린더 정보 탐색 -> 월간 정보 탐색")
        calendar_info_element = CalendarInfo()
        calendar_next_month = CalendarNextMonth()

        # 현재 캘린더의 날짜 정보 추출 (연/월)
        currentYearMonth = browser.find_element(By.CSS_SELECTOR, Constants_Selector.calendarYearMonthCss).text
        calendar_info_element.current_year_month = currentYearMonth

        # 예약 가능 날짜 조회
        extractCalendarOfPossibleDays(browser, calendar_info_element)

        # 예약 가능한 날짜 및 현재 연/월 저장
        # 예약 가능한 날짜에서 회차 / 캐스팅 정보 탐색
        extractCalendarOfCasting(calendar_info_element, browser, product_info)

        # 캘린더 다음 달로 이동 하는 메서드 #
        # 다음 달 이동 버튼의 class 값이 disabled 이면 종료, 그렇지 않으면 이동
        isNextMonthMovePossible(browser, calendar_next_month)

        # 다음 달이 이동 버튼 class 값 추출
        # 다음 달 이동이 가능한 요소 선택
        if calendar_next_month.is_next_month_disabled:
            print_log(f"현 월이 마지막 예매")
            browser.quit()
            break
        else:
            # 다음 달 이동이 가능하면 이동 버튼 클릭
            print_log(f"캘린더 다음 달 이동")
            browser.execute_script('arguments[0].click();', calendar_next_month.button_next_month)

        time.sleep(1)


# 캘린더 정보 탐색 > 예약 가능한 날짜 조회 후 List 담기
def extractCalendarOfPossibleDays(browser:WebDriver, calendar_info_element: CalendarInfo) -> None:
    # 예약 가능한 날짜 조회 #
    # 메인화면 > 캘린더 : 날짜 태그 추출 (ul)
    reserveDaysList = browser.find_elements(By.CSS_SELECTOR, Constants_Selector.calendarDaysCss)

    # 예약 가능한 날짜 담을 List 선언
    possibleDaysList = []

    # muted 된 요소 세기
    mutedCount = 0

    # 날짜 리스트 중 예약 가능한 날짜 찾아서 List 배열에 넣기 #
    # <li> 태그를 순회하면서 disabled / muted 이면 제외, picked / 빈 문자열 이면 포함
    # 단, muted 이면 추가, 추후 예약 가능 날짜에 접근할 때 필요
    for reserveDays in reserveDaysList:
        # 해당 태그의 class 정보 추출
        isPossibleDay = reserveDays.get_attribute('class')
        # muted 이면 카운터 갱신
        if isPossibleDay == 'muted':
            mutedCount = mutedCount + 1
        # 빈 문자열 이면 예약 가능 날짜 리스트에 추가
        if isPossibleDay == '':
            possibleDaysList.append(reserveDays.text)
        # picked 이면 예약 가능 날짜 리스트에 추가
        if isPossibleDay == 'picked':
            possibleDaysList.append(reserveDays.text)
    calendar_info_element.muted_count = mutedCount
    calendar_info_element.possible_days_list = possibleDaysList


# 캘린더 정보 탐색 > 예약 가능한 날짜에서 캐스팅 정보 탐색
def extractCalendarOfCasting(calendar_info_element: CalendarInfo, browser: WebDriver, product_info: ProductInfo) -> None:
    print_log(f"캘린더 정보 탐색 > 예약 가능한 날짜서 캐스팅 정보 탐색")
    mutedCount = calendar_info_element.muted_count
    possibleDaysList = calendar_info_element.possible_days_list

    # 예약 가능한 날짜 에서 캐스트 정보 조회 #
    for possibleDays in possibleDaysList:

        # 현 예약 가능 날짜에 총 muted 숫자 추가
        possibleDaysMuted = int(possibleDays) + mutedCount

        # 메인화면 > 캘린더 > 예약 가능 날짜 경로
        possibleDaysCssPath = Constants_Selector.calendarPossibleCssFront + str(possibleDaysMuted) + ')'

        # 메인화면 > 캘린더 > 예약 가능 날짜 접근 클릭
        element = browser.find_element(By.CSS_SELECTOR, possibleDaysCssPath)
        browser.execute_script("arguments[0].click();", element)

        time.sleep(0.5)

        # 주연 정보 접근
        # 메인화면 > 캘린더 > 예약 가능 날짜(클릭) > 공연 회차 : 총 공연가능 회차 조회
        try:
            turnTotalCount = browser.find_elements(By.CSS_SELECTOR, Constants_Selector.calendarPossibleTurnCss)
            print_log(f"{possibleDays}일의 총 회차 수: {str(len(turnTotalCount))}")

            # 각 공연 회차에 접근해 배우 정보 추출 #
            for count in range(1, len(turnTotalCount) + 1):
                # 메인화면 > 캘린더 > 예약 가능 날짜(클릭) > 총 공연 회차 클릭
                findTurn = browser.find_element(By.CSS_SELECTOR,
                                                Constants_Selector.calendarPossibleTurnOfDayCss + str(count) + ')')
                browser.execute_script("arguments[0].click();", findTurn)

                time.sleep(0.2)

                # 예매 시간 / 회차 / 가격 담을 dict 객체
                detail_casting_time_info = DetailCastingTimeInfo()

                # 예매 연도 / 월 분리
                currentYearMonth = calendar_info_element.current_year_month
                detail_casting_time_info.year = currentYearMonth.split('. ')[0]
                detail_casting_time_info.month = currentYearMonth.split('. ')[1]

                # 해당 날짜 조회
                detail_casting_time_info.day = possibleDays

                print_log(f"현재 연도/월/일: {detail_casting_time_info.year}/{detail_casting_time_info.month}/{detail_casting_time_info.day}")

                # 연도/월/일 계산
                detail_casting_time_info.date = detail_casting_time_info.year + '/' + detail_casting_time_info.month + '/' + detail_casting_time_info.day

                detail_casting_time_info.turn = int(count)

                # # 현 공연 회차 배우 정보 출력
                openTime = findTurn.find_element(By.CSS_SELECTOR, 'a > span').text.split(':')

                detail_casting_time_info.hour = str(openTime[0])
                detail_casting_time_info.min = str(openTime[1])

                print_log(f"현 회차: {count}\t시간(시):(분): {openTime[0]}:{openTime[1]}")
                print('------------------------------------------------------------')

                reserveTimeString = detail_casting_time_info.year + '-' + \
                                    detail_casting_time_info.month + '-' + \
                                    detail_casting_time_info.day + ' ' + \
                                    detail_casting_time_info.hour + ':' + \
                                    detail_casting_time_info.min + ':' + '00.000'

                reserveTimeTimeStamp = datetime.datetime.strptime(reserveTimeString, '%Y-%m-%d %H:%M:%S.%f')

                # 타임존 설정 (대한민국 시간인 UTC +09:00)
                timezone_kst = datetime.timezone(datetime.timedelta(hours=9))
                reserveTimeUTC = reserveTimeTimeStamp.replace(tzinfo=timezone_kst)
                detail_casting_time_info.time_datetime = reserveTimeUTC

                print_log(f"예매시간 : {detail_casting_time_info.time_datetime}")

                product_info.detail_casting_time_info_list.append(detail_casting_time_info)

                time.sleep(0.2)
        except NoSuchElementException as ne:
            log_error(ne)


# 캘린더 정보 탐색 > 다음 달로 이동이 가능한지 판단하는 메서드
def isNextMonthMovePossible(browser:WebDriver, calendar_next_month: CalendarNextMonth) -> None:
    # 메인화면 > 캘린더 > 다음 달 이동 버튼 조회
    nextPageButton = browser.find_element(By.CSS_SELECTOR, Constants_Selector.calendarNextMonthButtonCss)

    # 다음 달 이동 버튼의 class 값이 disabled 인지 확인, group(1)로 판단 가능
    button_classes = nextPageButton.get_attribute('class')
    calendar_next_month.is_next_month_disabled = 'disabled' in button_classes
    calendar_next_month.button_next_month = nextPageButton