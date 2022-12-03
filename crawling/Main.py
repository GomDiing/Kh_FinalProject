import re
import time

from selenium.webdriver.common.by import By
from selenium.common import TimeoutException, NoSuchElementException
from sqlalchemy import MetaData, Table, insert, select
import Constants
import Main_General_Info
from Common import initChromBrowser, waitUntilElementLocated, metadata_obj, engine, createEngine
from crawling import Main_Navi_Info
from Debug import debugCreateUrlOfInterpark
from crawling.Main_Calendar_Info import extractCalendarInfo
from crawling.Main_Compact_Info import extractCompactInfo
from crawling.RankUrl import crawlingRankingUrlList


# 경고 창 제거 메서드, 없다면 무시
def removeAlert(browser):
    try:
        browser.find_element(By.CSS_SELECTOR, Constants.removeAlertCss).click()
    except NoSuchElementException:
        pass


# 인터파크 페이지 크롤링 메서드
def crawlingInterparkPage(urlCode):
    url = 'https://tickets.interpark.com/goods' + '/' + str(urlCode)

    t_product = Table('product', metadata_obj, autoload_with=engine)

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
    limitedOrAlways = extractCompactInfo(browser)

    # 일반 정보 추출
    Main_General_Info.extractGeneralInfo(browser)

    # 네비게이션 메뉴 탐색
    Main_Navi_Info.extractNaviInfo(browser)

    # 캘린더 정보 탐색
    if limitedOrAlways == 'limited':
        extractCalendarInfo(browser)


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
        mainBannerUrlWithStyle = browser.find_element(By.CSS_SELECTOR, '#wrapGNB > div.mainVisual > div').get_attribute('style')
        print(re.search(r'\(\"(.*?)\"\)', mainBannerUrlWithStyle).group(1))
        time.sleep(0.5)


if __name__ == '__main__':
    urlList = debugCreateUrlOfInterpark()
    # createEngine()

    # crawlingRankingUrlList()

    # crawlingMainBanner()

    for url in urlList:
        crawlingInterparkPage(url)
