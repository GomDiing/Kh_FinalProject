import datetime

import Constants_Rank
import Constants_Selector
import time
import re

from selenium.webdriver.common.by import By
from selenium.common import NoSuchElementException
from Common import init_chrome_browser, waitUntilElementLocated, commit_update_rank_status, log_error, print_log, \
    commitProductDataList, commitCasting, commitSeatPriceDataList, commitStatisticsRecord, commitReserveTimeDataList, \
    commitReserveTimeCasting, commitReserveTimeSeatPrice, isExistInTable

from DataClass import ProductInfo, LimitedAlways, RankStatus, DetailLocationInfo, DetailCastingTimeInfo
from Page_Calendar_Info import extractCalendarInfo
from Page_Compact_Info import parsing_compact_info
from Page_General_Info import extractGeneralInfo
from Page_Navi_Info import extractNaviInfo


# 경고 창 제거 메서드, 없다면 무시
def remove_alert(browser):
    try:
        # browser.find_element(By.CSS_SELECTOR, Constants.removeAlertCss).click()
        element = browser.find_element(By.CSS_SELECTOR, Constants_Selector.removeAlertCss)
        browser.execute_script("arguments[0].click();", element)
    except NoSuchElementException as ne:
        log_error(ne)
        pass


# 인터파크 페이지 크롤링 메서드
def parsing_interpark_page(product_info: ProductInfo) -> None:
    # URL 설정
    product_info.url = Constants_Rank.base_product_url + "/" + product_info.code

    # 크롬 브라우저 옵션 설정 및 실행 메서드
    browser = init_chrome_browser()

    # url 접근
    print_log(f"다음 URL 접근 : {product_info.url}")
    browser.get(product_info.url)

    # 가격 테이블 요쇼가 표시될 때 까지 대기
    is_browser_searchable = waitUntilElementLocated(browser, 10, By.CLASS_NAME, Constants_Selector.initBrowserWaitClass)

    if is_browser_searchable is False:
        print_log(Constants_Rank.error_msg_no_search_price_table)
        return

    # 경고 창 제거, 없다면 무시
    remove_alert(browser)
    time.sleep(1)

    # 간략 정보 추출
    parsing_compact_info(browser, product_info)

    # 판매 상태 갱신
    update_rank_status(product_info)

    # 일반 정보 추출
    extractGeneralInfo(browser, product_info)

    # # 상세 가격 페이지가 다른 페이지로 이동하는 경우 => 종료
    if product_info.detail_location == DetailLocationInfo.NOT_PAGE.value:
        print_log('NOT PAGE')
        return

    extractNaviInfo(browser, product_info)

    # # 캘린더 정보 탐색 : 오른쪽 사이드에 위치한 월/일별로 탐색
    # # 단, 한정 상품이고 정보탭 > 캐스팅 정보가 없을 경우에만 조회
    if product_info.limited_always == LimitedAlways.LIMITED.status_name and not product_info.detail_casting_time_info_list:
        print_log("캘린더 데이터 탐색 : (조건) 한정 상품 && 정보탭 -> 캐스팅탭에 캐스팅 정보 없을 경우")
        extractCalendarInfo(browser, product_info)
        print_log(f"예매 정보: {product_info.detail_casting_time_info_list}")

    product_info.is_casting = True if product_info.casting_info_list else False
    print_log(f"DEBUG product_info.detail_casting_time_info_list = {product_info.detail_casting_time_info_list}")
    product_info.is_detail_casting = True if product_info.detail_casting_time_info_list else False
    print_log(f"Product 테이블 커밋 준비, 데이터 : \n{product_info}")

    commitProductDataList(product_info)

    # 네비탭 > 정보탭 > 캐스팅 정보가 존재한다면 Commit
    if product_info.is_casting:
        print_log(f"네비 탭 > 정보 탭 -> 캐스팅 정보 존재 : 커밋 준비")
        commitCasting(product_info)

    # SeatPrice 테이블 데이터 Commit
    if product_info.is_seat_price_info:
        commitSeatPriceDataList(product_info)

    # Statistics 테이블 데이터 Commit
    commitStatisticsRecord(product_info)

    # 네비탭 > 캐스팅 정보가 존재할 경우
    # ReserveTime / ReserveTimeCasting 테이블 데이터 Commit
    if product_info.is_detail_casting:
        print_log(f"네비탭 > 캐스팅 정보 존재")
        print_log(f"product_isInfoCasting : {product_info.is_detail_casting}")
        commitReserveTimeDataList(product_info)
        commitReserveTimeCasting(product_info)

    # 상시 상품일 경우 정해진 예매 정보 생성
    if product_info.limited_always == LimitedAlways.ALWAYS.status_name:
        print_log(f"상시 상품일 경우")
        createAlwaysReserveTimeData(product_info)
        commitReserveTimeDataList(product_info)

    # 예매시간 좌석 가격 테이블 갱신
    commitReserveTimeSeatPrice(product_info)

    # 이미 상품 / 예매 시간 / 좌석 테이블에 정보가 존재한다면 생략
    if isExistInTable(product_info.code):
        print_log(f"{product_info.code}의 Product / ReserveTime / SeatPrice 정보 존재 -> 완료 전환")
        commit_update_rank_status(product_info, RankStatus.COMPLETE)

    del product_info


# 상품 상태 갱신 메서드
def update_rank_status(product_info: ProductInfo) -> None:
    if product_info.limited_always == LimitedAlways.CLOSE.status_name:
        commit_update_rank_status(product_info, RankStatus.END)

    if product_info.limited_always in (LimitedAlways.RELEASE.status_name, LimitedAlways.NOTIFY_TICKET.status_name):
        commit_update_rank_status(product_info, RankStatus.SCHEDULED)


# 인터파크 메인 페이지의 메인 배너 주소 추출 메서드
def crawlingMainBanner():
    url = 'http://ticket.interpark.com/'

    # 크롬 브라우저 옵션 설정 및 실행 메서드
    browser = init_chrome_browser()

    # url 접근
    browser.get(url)

    # 가격 테이블 요쇼가 표시될 때 까지 대기
    waitUntilElementLocated(browser, 10, By.CLASS_NAME, 'popPriceTable')

    print(browser.page_source)

    sizeOfMainBanner = len(browser.find_elements(By.CSS_SELECTOR, '#tpl_mainvisual > li'))

    for count in range(1, sizeOfMainBanner + 1):
        print(count)
        browser.find_element(By.CSS_SELECTOR, '#tpl_mainvisual > li:nth-child(' + str(count) + ') > a').click()
        mainBannerUrlWithStyle = browser.find_element(By.CSS_SELECTOR, '#wrapGNB > div.mainVisual > div').get_attribute(
            'style')
        print(re.search(r'\(\"(.*?)\"\)', mainBannerUrlWithStyle).group(1))
        time.sleep(0.5)


def createAlwaysReserveTimeData(product_info: ProductInfo) -> None:
    detail_casting_time_info = DetailCastingTimeInfo()
    detail_casting_time_info.date = '9999/12/31'

    # 예약 날짜 계산 (TimeStamp)
    reserveTimeString = '9999-12-31 23:59:59.000'

    # String 을 TimeStamp 변환
    reserveTimeTimeStamp = datetime.datetime.strptime(reserveTimeString, '%Y-%m-%d %H:%M:%S.%f')

    # 타임존 설정 (대한민국 시간인 UTC +09:00)
    timezone_kst = datetime.timezone(datetime.timedelta(hours=9))
    reserveTimeUTC = reserveTimeTimeStamp.replace(tzinfo=timezone_kst)

    detail_casting_time_info.time_datetime = reserveTimeUTC

    detail_casting_time_info.hour = 23
    detail_casting_time_info.min = 59
    detail_casting_time_info.turn = 0

    product_info.detail_casting_time_info_list.append(detail_casting_time_info)