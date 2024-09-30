import datetime

import Constants
import time

from selenium.webdriver.common.by import By
from selenium.common import TimeoutException, NoSuchElementException


# 캘린더 정보 탐색 메서드
def extractCalendarInfo(browser, productDataList):
    # 탐색결과 담을 dict 객체
    resultCalendarInfo = {}

    # 공연 시간 / 시간별 배우 정보 담을 리스트
    reserveTimeDataList = []

    # 네비 탭 > 정보 탭 > 캐스팅 정보 존재하는지 판단
    isExistDetailCasting = productDataList['product_isInfoCasting']

    # 캘린더 탭에 배우 정보 존재 여부 확인 변수
    isExistTimeCastingInfo = False

    if isExistDetailCasting is True:
        # 시간별 배우 정보 존재 확인
        try:
            print('배우 정보 존재 확인' + browser.find_element(By.CSS_SELECTOR, Constants.calendarPossibleActorCss).text)

            isExistTimeCastingInfo = True
        except NoSuchElementException:
            print('$$$$$$$$$$ :: 캘린더 > 시간별 배우 정보 없음 $$$$$$$$$$')
            isExistTimeCastingInfo = False

    # $$$ 시간별 캐스팅 데이터 정보 유무 데이터 리스트 추가
    productDataList['product_isInfoTimeCasting'] = isExistTimeCastingInfo

    # 다음 달 이동이 불가능 할 때 까지 계속 조회
    while True:
        # 현재 캘린더의 날짜 정보 추출 (연/월)
        currentYearMonth = browser.find_element(By.CSS_SELECTOR, Constants.calendarYearMonthCss).text

        # 예약 가능 날짜 조회
        mutedPossibleDays = extractCalendarOfPossibleDays(browser)

        # mutedCount = mutedAndPossibleDays['mutedCount']
        possibleDaysList = mutedPossibleDays['possibleDaysList']
        mutedPossibleDays['currentYearMonth'] = currentYearMonth

        print('====================')
        print('현재 연월 : ' + currentYearMonth)
        print('====================')
        print("예약 가능한 날짜 리스트 : " + str(possibleDaysList))

        # 예약 가능한 날짜에서 회차 / 캐스팅 정보 탐색
        extractCalendarOfCasting(mutedPossibleDays, browser, isExistTimeCastingInfo, reserveTimeDataList, productDataList)

        # 캘린더 다음 달로 이동 하는 메서드 #
        # 다음 달 이동 버튼의 class 값이 disabled 이면 종료, 그렇지 않으면 이동
        isNexMonthResult = isNextMonthMovePossible(browser)

        # 다음 달이 이동 버튼 class 값 추출
        isNextMonthDisabled = isNexMonthResult['isNextMonthDisabled']
        # 다음 달 이동이 가능한 요소 선택
        nextPageButton = isNexMonthResult['nextPageButton']

        # class 속성 값이 disabled 이면 종료
        if isNextMonthDisabled == 'disabled':
            browser.quit()
            break
        else:
            # 다음 달 이동 버튼이 disabled 이면 이동 클릭
            browser.execute_script('arguments[0].click();', nextPageButton)

        time.sleep(1)

    resultCalendarInfo['reserveTimeDataList'] = reserveTimeDataList

    return resultCalendarInfo


# 캘린더 정보 탐색 > 예약 가능한 날짜 조회 후 List 담기
def extractCalendarOfPossibleDays(browser):
    # 예약 가능한 날짜 조회 #
    # 메인화면 > 캘린더 : 날짜 태그 추출 (ul)
    # reserveDaysList = soup_page.find('ul', {'data-view': 'days'})
    reserveDaysList = browser.find_elements(By.CSS_SELECTOR, Constants.calendarDaysCss)

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

    return {'mutedCount': mutedCount, 'possibleDaysList': possibleDaysList}


# 캘린더 정보 탐색 > 예약 가능한 날짜에서 캐스팅 정보 탐색
def extractCalendarOfCasting(mutedPossibleDays, browser, isExistTimeCastingInfo, reserveTimeDataList, productDataList):
    mutedCount = mutedPossibleDays['mutedCount']
    possibleDaysList = mutedPossibleDays['possibleDaysList']

    # 예약 가능한 날짜 에서 캐스트 정보 조회 #
    for possibleDays in possibleDaysList:

        # 현 예약 가능 날짜에 총 muted 숫자 추가
        possibleDaysMuted = int(possibleDays) + mutedCount

        # 메인화면 > 캘린더 > 예약 가능 날짜 경로
        possibleDaysCssPath = Constants.calendarPossibleCssFront + str(possibleDaysMuted) + ')'

        # 메인화면 > 캘린더 > 예약 가능 날짜 접근 클릭
        # browser.find_element(By.CSS_SELECTOR, possibleDaysCssPath).click()
        element = browser.find_element(By.CSS_SELECTOR, possibleDaysCssPath)
        browser.execute_script("arguments[0].click();", element)

        time.sleep(0.5)

        # 주연 정보 접근
        # 메인화면 > 캘린더 > 예약 가능 날짜(클릭) > 공연 회차 : 총 공연가능 회차 조회
        try:
            turnTotalCount = browser.find_elements(By.CSS_SELECTOR, Constants.calendarPossibleTurnCss)

            print(possibleDays + '일의 총 회차 수: ' + str(len(turnTotalCount)))
            print('==========**********==========**********==========**********==========')

            # 각 공연 회차에 접근해 배우 정보 추출 #
            for count in range(1, len(turnTotalCount) + 1):
                # 메인화면 > 캘린더 > 예약 가능 날짜(클릭) > 총 공연 회차 클릭
                findTurn = browser.find_element(By.CSS_SELECTOR,
                                                Constants.calendarPossibleTurnOfDayCss + str(count) + ')')
                # findTurn.click()
                browser.execute_script("arguments[0].click();", findTurn)

                time.sleep(0.2)

                # 예매 시간 / 회차 / 가격 담을 dict 객체
                reserveTimeDataRecord = {}

                # 예매 연도 / 월 분리
                currentYearMonth = mutedPossibleDays['currentYearMonth']
                reserveTimeDataRecord['reserve_time_year'] = currentYearMonth.split('. ')[0]
                reserveTimeDataRecord['reserve_time_month'] = currentYearMonth.split('. ')[1]

                print('현재 연도: ' + reserveTimeDataRecord['reserve_time_year'])
                print('현재 월: ' + reserveTimeDataRecord['reserve_time_month'])

                # 해당 날짜 조회
                print('현재 날짜: ' + str(possibleDays))
                reserveTimeDataRecord['reserve_time_day'] = possibleDays

                # 연도/월/일 계산
                reserveTimeDataRecord['reserve_time_date'] = \
                    reserveTimeDataRecord['reserve_time_year'] + '/' + reserveTimeDataRecord[
                        'reserve_time_month'] + '/' + \
                    reserveTimeDataRecord['reserve_time_day']

                reserveTimeDataRecord['reserve_time_turn'] = int(count)

                # # 현 공연 회차 배우 정보 출력
                # try:
                openTime = findTurn.find_element(By.CSS_SELECTOR, 'a > span').text.split(':')

                reserveTimeDataRecord['reserve_time_hour'] = str(openTime[0])
                reserveTimeDataRecord['reserve_time_min'] = str(openTime[1])

                print('현 회차: ' + str(count) + ', 시간(시): ' + openTime[0] + ', (분): ' + openTime[1])
                print('------------------------------------------------------------')

                # 예약 날짜 계산 (TimeStamp)
                reserveTimeString = reserveTimeDataRecord['reserve_time_year'] + '-' + \
                                    reserveTimeDataRecord['reserve_time_month'] + '-' + \
                                    reserveTimeDataRecord['reserve_time_day'] + ' ' + \
                                    reserveTimeDataRecord['reserve_time_hour'] + ':' + \
                                    reserveTimeDataRecord['reserve_time_min'] + ':' + '00.000'

                # except NoSuchElementException:
                #     pass

                # String 을 TimeStamp 변환
                reserveTimeTimeStamp = datetime.datetime.strptime(reserveTimeString, '%Y-%m-%d %H:%M:%S.%f')

                # 타임존 설정 (대한민국 시간인 UTC +09:00)
                timezone_kst = datetime.timezone(datetime.timedelta(hours=9))
                reserveTimeUTC = reserveTimeTimeStamp.replace(tzinfo=timezone_kst)

                reserveTimeDataRecord['reserve_time'] = reserveTimeUTC

                reserveTimeDataList.append(reserveTimeDataRecord)

                if isExistTimeCastingInfo:
                    print(
                        '배우 정보 존재 확인' + browser.find_element(By.CSS_SELECTOR, Constants.calendarPossibleActorCss).text)

                time.sleep(0.2)
        except NoSuchElementException:
            print('$$$$$$$$$$ :: 캘린더 > 공연 회차 정보 없음$$$$$$$$$$')


# 캘린더 정보 탐색 > 다음 달로 이동이 가능한지 판단하는 메서드
def isNextMonthMovePossible(browser):
    # 메인화면 > 캘린더 > 다음 달 이동 버튼 조회
    nextPageButton = browser.find_element(By.CSS_SELECTOR, Constants.calendarNextMonthButtonCss)

    # 다음 달 이동 버튼의 class 값이 disabled 인지 확인, group(1)로 판단 가능
    isNextMonthDisabled = nextPageButton.get_attribute('class')

    return {'nextPageButton': nextPageButton, 'isNextMonthDisabled': isNextMonthDisabled}
