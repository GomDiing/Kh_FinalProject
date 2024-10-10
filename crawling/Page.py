import datetime

import Constants
import time
import re

from selenium.webdriver.common.by import By
from selenium.common import TimeoutException, NoSuchElementException, ElementClickInterceptedException
from sqlalchemy import MetaData, Table, insert, select
from Common import initChromBrowser, waitUntilElementLocated, metadata_obj, engine, createEngine, commitProductDataList, \
    commitReserveTimeDataList, commitSeatPriceDataList, isExistInTable, commitStatisticsRecord, commitCasting, \
    commitReserveTimeCasting, commitReserveTimeSeatPrice, commitRankingChangeStatus
from crawling.Common import print_log, log_error
from crawling.Page_Calendar_Info import extractCalendarInfo
from crawling.Page_Compact_Info import extractCompactInfo
from crawling.Page_General_Info import extractGeneralInfo
from crawling.Page_Navi_Info import extractNaviInfo


# 경고 창 제거 메서드, 없다면 무시
def removeAlert(browser):
    try:
        # browser.find_element(By.CSS_SELECTOR, Constants.removeAlertCss).click()
        element = browser.find_element(By.CSS_SELECTOR, Constants.removeAlertCss)
        browser.execute_script("arguments[0].click();", element)
    except NoSuchElementException as ne:
        log_error(ne)
        pass


# 인터파크 페이지 크롤링 메서드
def crawlingInterparkPage(urlCode, product_category):
    # 상품 테이블에 추가할 데이터 리스트 선언 및 초기화
    global resultCalendarInfo
    productDataList = {}

    # 좌석 / 가격 테이블 레코드 담을 리스트
    seatPriceDataList = []

    # 캘린더 속 회차 정보 유무
    isExistTimeCastingInCalendar = False

    # $$$ 캐스팅 정보 유무, 시간별 캐스팅 정보 유무, 시간, 인터미션 데이터 리스트 초기값 설정
    productDataList['product_time_min'] = -1
    productDataList['product_time_break'] = 0
    productDataList['product_isInfoCasting'] = False

    # $$$ url 코드(PK) 테이블 데이터 리스트 추가
    productDataList['product_code'] = str(urlCode)

    # $$$ url 경로 설정 및 데이터 리스트 추가
    productDataList['product_url'] = 'https://tickets.interpark.com/goods' + '/' + str(urlCode)

    # 크롬 브라우저 옵션 설정 및 실행 메서드
    browser = initChromBrowser()

    # url 접근
    print_log(f"다음 URL 접근 : {productDataList['product_url']}")
    browser.get(productDataList['product_url'])

    # 가격 테이블 요쇼가 표시될 때 까지 대기
    isExist = waitUntilElementLocated(browser, 10, By.CLASS_NAME, Constants.initBrowserWaitClass)

    if isExist is False:
        print_log('에러 발생!!!')
        return

    # 경고 창 제거, 없다면 무시
    removeAlert(browser)
    time.sleep(1)

    # 간략 정보 추출
    limitedOrAlways = extractCompactInfo(browser, productDataList)

    # 판매 상태 갱신
    updateStatus(limitedOrAlways, productDataList, product_category)

    # 일반 정보 추출
    extractGeneralInfo(browser, productDataList, seatPriceDataList)

    # 상세 가격 페이지가 다른 페이지로 이동하는 경우 => 종료
    if productDataList['product_detail_location'] == 'NOT PAGE':
        print_log('NOT PAGE')
        return

    try:
        productDataList['product_age']
        productDataList['product_age_isKorean']
    except KeyError as ke:
        productDataList['product_age'] = -1
        productDataList['product_age_isKorean'] = 0

    # 네비게이션 메뉴 탐색
    # resultNaviInfo['isExistTimeCasting] : 네비 탭 > 캐스팅 정보 존재할 경우 True, 그렇지 않으면 False
    # resultNaviInfo['reserveTimeDataList'] : 네비 팁 > 캐스팅 정보가 존재할 경우 내부 정보 리스트가 담긴 리스트
    resultNaviInfo = extractNaviInfo(browser, productDataList)

    # 네비 탭 > 캐스팅 정보 존재하는지 판단
    isExistTimeCasting = resultNaviInfo['isExistTimeCasting']
    print_log(f"네비 탭 > 캐스팅 정보 존재: {isExistTimeCasting}")

    # 캘린더 정보 탐색 : 오른쪽 사이드에 위치한 월/일별로 탐색
    # 단, 한정 상품이고 정보탭 > 캐스팅 정보가 없을 경우에만 조회
    if limitedOrAlways == 'limited' and isExistTimeCasting is False:
        print_log("캘린더 데이터 탐색 (조건) 한정 상품 && 캐스팅 정보 없을 경우")
        resultCalendarInfo = extractCalendarInfo(browser, productDataList)
        isExistTimeCastingInCalendar = True
        print_log(f"예매 정보: {resultCalendarInfo}")
    # 정보탭 > 캐스팅 정보가 존재할 있을 경우 : 오른쪽 사이드 위치한 월/일 탐색 필요 없이 테이블 데이터 파싱
    elif isExistTimeCasting is True:
        print_log("정보탭 > 캐스팅 정보 존재")
        productDataList['product_isInfoTimeCasting'] = True
    # 상시 상품 OR 캐스팅 정보가 없을 경우
    else:
        print_log("상시 상품 || 캐스팅 정보 없음")
        productDataList['product_isInfoTimeCasting'] = False

    # $$$ 카테고리 데이터 리스트 추가
    productDataList['product_category'] = product_category

    # $@$@$@$@$@$@$@$@$@$@$@$@$@$@$@$@$@$@$@$@$@$@$@$@$@$@$@$@$@$@$@$@$@$@$@$@$@$@$@$@$@$@$@$@$@$@$@$@
    # Product 테이블 데이터 Commit
    print_log(f"Product 테이블 커밋 준비, 데이터 : \n{productDataList}")
    commitProductDataList(productDataList)

    # 네비탭 > 정보탭 > 캐스팅 정보가 존재한다면 Commit
    # Casting 테이블 데이터 Commit
    if productDataList['product_isInfoCasting'] is True:
        print_log(f"네비 탭 > 정보 탭 -> 캐스팅 정보 존재 : 커밋 준비")
        commitCasting(productDataList['castingInfoTotalList'], productDataList['product_code'])

    # SeatPrice 테이블 데이터 Commit
    commitSeatPriceDataList(seatPriceDataList, productDataList['product_code'])

    # Statistics 테이블 데이터 Commit
    commitStatisticsRecord(productDataList['statisticsRecord'])

    # 네비탭 > 캐스팅 정보가 존재할 경우
    # ReserveTime / ReserveTimeCasting 테이블 데이터 Commit
    if isExistTimeCasting is True:
        print_log(f"네비탭 > 캐스팅 정보 존재")
        print_log(f"product_isInfoCasting : {productDataList['product_isInfoCasting']}")
        commitReserveTimeDataList(resultNaviInfo['reserveTimeDataList'], productDataList['product_code'], productDataList['product_category'])
        commitReserveTimeCasting(resultNaviInfo['reserveTimeDataList'], productDataList['product_code'])

    # 캘린더에 예매 정보가 있을 경우
    # ReserveTime 테이블 데이터 Commit
    if isExistTimeCastingInCalendar is True:
        print_log(f"캘린더에 예매 정보 존재")
        commitReserveTimeDataList(resultCalendarInfo['reserveTimeDataList'], productDataList['product_code'], productDataList['product_category'])

    # 상시 상품일 경우 정해진 예매 정보 생성
    if limitedOrAlways == 'always':
        print_log(f"상시 상품일 경우")
        commitReserveTimeDataList(createAlwaysReserveTimeData(), productDataList['product_code'], productDataList['product_category'])

    # 예매시간 좌석 가격 테이블 갱신
    commitReserveTimeSeatPrice(productDataList['product_code'])

    # 이미 상품 / 예매 시간 / 좌석 테이블에 정보가 존재한다면 생략
    # #############################################
    if isExistInTable(urlCode):
        # print('================>>> Update column in Product & ReserveTime & SeatPrice  : Product Code is \"'
        #       + str(urlCode) + '\"')
        print_log(f"{urlCode}의 Product / ReserveTime / SeatPrice 정보 존재 -> 완료 전환")
        commitRankingChangeStatus(str(urlCode), product_category, 'COMPLETE')
        return


# 상품 상태 갱신 메서드
def updateStatus(limitedOrAlways, productDataList, product_category):
    if limitedOrAlways == 'close':
        commitRankingChangeStatus(productDataList['product_code'], product_category, 'END')
        return
    if limitedOrAlways == 'not_open':
        commitRankingChangeStatus(productDataList['product_code'], product_category, 'SCHEDULED')
        return


# 인터파크 메인 페이지의 메인 배너 주소 추출 메서드
def crawlingMainBanner():
    url = 'http://ticket.interpark.com/'

    # 크롬 브라우저 옵션 설정 및 실행 메서드
    browser = initChromBrowser()

    # url 접근
    browser.get(url)

    # 가격 테이블 요쇼가 표시될 때 까지 대기
    # waitUntilElementLocated(browser, 10, By.CSS_SELECTOR, '#tpl_mainvisual > li:nth-child(1) > a')
    waitUntilElementLocated(browser, 10, By.CSS_SELECTOR, '#wrapGNB > div.mainVisual > div')

    print(browser.page_source)

    sizeOfMainBanner = len(browser.find_elements(By.CSS_SELECTOR, '#tpl_mainvisual > li'))

    for count in range(1, sizeOfMainBanner + 1):
        print(count)
        browser.find_element(By.CSS_SELECTOR, '#tpl_mainvisual > li:nth-child(' + str(count) + ') > a').click()
        mainBannerUrlWithStyle = browser.find_element(By.CSS_SELECTOR, '#wrapGNB > div.mainVisual > div').get_attribute(
            'style')
        print(re.search(r'\(\"(.*?)\"\)', mainBannerUrlWithStyle).group(1))
        time.sleep(0.5)


def createAlwaysReserveTimeData():
    reserveTimeDataList = []
    reserveTimeDataRecord = {}

    reserveTimeDataRecord['reserve_time_date'] = '9999/12/31'

    # 예약 날짜 계산 (TimeStamp)
    reserveTimeString = '9999-12-31 23:59:59.000'

    # String 을 TimeStamp 변환
    reserveTimeTimeStamp = datetime.datetime.strptime(reserveTimeString, '%Y-%m-%d %H:%M:%S.%f')

    # 타임존 설정 (대한민국 시간인 UTC +09:00)
    timezone_kst = datetime.timezone(datetime.timedelta(hours=9))
    reserveTimeUTC = reserveTimeTimeStamp.replace(tzinfo=timezone_kst)

    reserveTimeDataRecord['reserve_time'] = reserveTimeUTC

    reserveTimeDataRecord['reserve_time_hour'] = 23
    reserveTimeDataRecord['reserve_time_min'] = 59
    reserveTimeDataRecord['reserve_time_turn'] = 0

    reserveTimeDataList.append(reserveTimeDataRecord)

    return reserveTimeDataList