import Constants
import time
import re

from selenium.webdriver.common.by import By
from selenium.common import TimeoutException, NoSuchElementException
from sqlalchemy import MetaData, Table, insert, select
from Common import initChromBrowser, waitUntilElementLocated, metadata_obj, engine, createEngine, commitProductDataList
from Debug import debugCreateUrlOfInterpark
from crawling.Page_Calendar_Info import extractCalendarInfo
from crawling.Page_Compact_Info import extractCompactInfo
from crawling.Page_General_Info import extractGeneralInfo
from crawling.Page_Navi_Info import extractNaviInfo


# 경고 창 제거 메서드, 없다면 무시
def removeAlert(browser):
    try:
        browser.find_element(By.CSS_SELECTOR, Constants.removeAlertCss).click()
    except NoSuchElementException:
        pass


# 인터파크 페이지 크롤링 메서드
def crawlingInterparkPage(urlCode):
    # 상품 테이블에 삽입될 데이터 리스트 선언 및 초기화
    productDataList = {}

    # $$$ 캐스팅 정보 유무, 시간별 캐스팅 정보 유무, 시간, 인터미션 데이터 리스트 초기값 설정
    # productDataList['product_isInfoTimeCasting'] = False
    # productDataList['product_isInfoCasting'] = False
    productDataList['product_time_min'] = -1
    productDataList['product_time_break'] = 0

    # $$$ url 코드(PK) 테이블 데이터 리스트 추가
    productDataList['product_code'] = str(urlCode)

    # url 경로 설정
    url = 'https://tickets.interpark.com/goods' + '/' + str(urlCode)
    # $$$ url 테이블 데이터 리스트 추가
    productDataList['product_url'] = url

    # 크롬 브라우저 옵션 설정 및 실행 메서드
    browser = initChromBrowser()

    # url 접근
    browser.get(url)

    # 가격 테이블 요쇼가 표시될 때 까지 대기
    waitUntilElementLocated(browser, 10, By.CLASS_NAME, Constants.initBrowserWaitClass)

    # 경고 창 제거, 없다면 무시
    removeAlert(browser)

    time.sleep(1)

    # 간략 정보 추출
    limitedOrAlways = extractCompactInfo(browser, productDataList)

    # 일반 정보 추출
    extractGeneralInfo(browser, productDataList)

    # 네비게이션 메뉴 탐색
    isExistTimeCasting = extractNaviInfo(browser, productDataList)

    # print('limitOrAlways: ' + limitedOrAlways)
    # print('isExistTimeCasting: ' + str(isExistTimeCasting))

    # 캘린더 정보 탐색
    # 단, 한정 상품이고 정보탭 > 캐스팅 정보가 없을 경우에만 조회
    if limitedOrAlways == 'limited' and isExistTimeCasting is False:
        extractCalendarInfo(browser, productDataList)
    # 정보탭 > 캐스팅 정보가 존재할 있을 경우
    elif isExistTimeCasting is True:
        productDataList['product_isInfoTimeCasting'] = True
    # 상시 상품이거나 캐스팅 정보가 없을 경우
    else:
        productDataList['product_isInfoTimeCasting'] = False

    # $$$ (디버그) 카테고리 데이터 리스트 추가
    productDataList['product_category'] = 'Test'

    commitProductDataList(productDataList)


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
