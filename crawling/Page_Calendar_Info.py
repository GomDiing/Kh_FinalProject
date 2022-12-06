import Constants
import time

from selenium.webdriver.common.by import By
from selenium.common import TimeoutException, NoSuchElementException


# 캘린더 정보 탐색 메서드
def extractCalendarInfo(browser, productDataList):
    # 시간별 배우 정보 존재 확인
    try:
        print('배우 정보 존재 확인' + browser.find_element(By.CSS_SELECTOR, Constants.calendarPossibleActorCss).text)

        productDataList['product_isInfoTimeCasting'] = True
        isExistTimeCastingInfo = True
    except NoSuchElementException:
        print('$$$$$$$$$$ :: 캘린더 > 시간별 배우 정보 없음 $$$$$$$$$$')
        productDataList['product_isInfoTimeCasting'] = False
        isExistTimeCastingInfo = False

    # 다음 달 이동이 불가능 할 때 까지 계속 조회
    while True:
        # 예약 가능 날짜 조회
        mutedAndPossibleDays = extractCalendarOfPossibleDays(browser)

        mutedCount = mutedAndPossibleDays['mutedCount']
        possibleDaysList = mutedAndPossibleDays['possibleDaysList']

        # 현재 캘린더의 날짜 정보 추출 (연/월)
        currentYearMonth = browser.find_element(By.CSS_SELECTOR, Constants.calendarYearMonthCss).text
        print('====================')
        print('현재 연월 : ' + currentYearMonth)
        print('====================')
        print("예약 가능한 날짜 리스트 : " + str(possibleDaysList))

        # 예약 가능한 날짜에서 회차 / 캐스팅 정보 탐색
        extractCalendarOfCasting(possibleDaysList, mutedCount, browser, isExistTimeCastingInfo)

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

        time.sleep(3)


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
def extractCalendarOfCasting(possibleDaysList, mutedCount, browser, isExistTimeCastingInfo):
    # 예약 가능한 날짜 에서 캐스트 정보 조회 #
    for possibleDays in possibleDaysList:

        # 해당 날짜 조회
        print('현재 날짜: ' + str(possibleDays))

        # 현 예약 가능 날짜에 총 muted 숫자 추가
        possibleDaysMuted = int(possibleDays) + mutedCount

        # 메인화면 > 캘린더 > 예약 가능 날짜 경로
        possibleDaysCssPath = Constants.calendarPossibleCssFront + str(possibleDaysMuted) + ')'

        # 메인화면 > 캘린더 > 예약 가능 날짜 접근 클릭
        browser.find_element(By.CSS_SELECTOR, possibleDaysCssPath).click()

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
                findTurn = browser.find_element(By.CSS_SELECTOR, Constants.calendarPossibleTurnOfDayCss + str(count) + ')')

                findTurn.click()

                time.sleep(0.2)

                # 현 공연 회차 배우 정보 출력
                try:
                    openTime = findTurn.find_element(By.CSS_SELECTOR, 'a > span').text.split(':')
                    print('현 회차: ' + str(count) + ', 시간(시): ' + openTime[0] + ', (분): ' + openTime[1])
                    print('------------------------------------------------------------')
                except NoSuchElementException:
                    pass

                if isExistTimeCastingInfo:
                    print('배우 정보 존재 확인' + browser.find_element(By.CSS_SELECTOR, Constants.calendarPossibleActorCss).text)

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
