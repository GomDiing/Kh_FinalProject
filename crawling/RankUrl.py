import re
import Constants

from Common import initChromBrowser, waitUntilElementLocated
from selenium.webdriver.common.by import By
from selenium.common import TimeoutException, NoSuchElementException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


# 인터파크 장르별 랭크 추출 메서드
def crawlingRankingUrlList():
    allBaseListUrl = 'http://ticket.interpark.com/TPGoodsList.asp'

    # 뮤지컬
    # allRankingListUrl = allBaseListUrl + '?Ca=Mus'
    # 연극
    # allRankingListUrl = allBaseListUrl + '?Ca=Dra'
    # 클래식
    allRankingListUrl = allBaseListUrl + '?Ca=Cla&SubCa=ClassicMain'
    # 전시
    # allRankingListUrl = allBaseListUrl + '?Ca=Eve&SubCa=Eve_O'

    todayRanking = allRankingListUrl + '&Sort=1'
    weekRanking = allRankingListUrl + '&Sort=2'
    monthRanking = allRankingListUrl + '&Sort=3'
    sortByNameAsc = allRankingListUrl + '&Sort=4'
    closeSoonAsc = allRankingListUrl + '&Sort=5'

    print('<<< Start --- Crawling Interpark >>>')
    print('========================================')

    # 크롬 브라우저 옵션 설정 및 실행 메서드
    browser = initChromBrowser()

    browser.get(closeSoonAsc)

    # 해당 요소가 발생할 때까지 대기
    waitUntilElementLocated(browser, 10, By.CLASS_NAME, 'RK_total2')

    # 해당 페이지에서 조회된 총 페이지 수 탐색
    totalCountElement = browser.find_element(By.CLASS_NAME, 'RK_total2')
    totalCount = re.search(r'\d+', totalCountElement.find_element(By.CSS_SELECTOR, 'span').text).group(0)

    # 마지막 요소 탐색
    lastElement = Constants.rankingPageLastCss + str(totalCount) + ')'

    # 해당 요소가 발생할 때까지 대기
    waitUntilElementLocated(browser, 10, By.CSS_SELECTOR, lastElement)

    # 페이지의 url을 저장할 리스트 선언
    currentUrlKeyList = []

    # 각각 url을 추출하여 GroupCode= 뒤에 위치한 urlKey 추출
    # 헤더를 제외한 부분부터 순회 추출 시작
    for index in range(1, int(totalCount) + 1):
        # 해당 페이지 접근해서 링크 추출
        currentElementCSSPath = Constants.rankingPageCurrentFrontCss + str(index) + Constants.rankingPageCurrentBackCss
        currentElementUrl = browser.find_element(By.CSS_SELECTOR, currentElementCSSPath).get_attribute('href')
        # 해당 url에서 GroupCode= 뒤에 위치한 urlKey 추출
        currentUrlKey = re.sub('GroupCode=', '', currentElementUrl.split('?')[1])

        # 해당 urlKey를 리스트에 저장
        currentUrlKeyList.append(currentUrlKey)

    print('총 key 수: ' + str(len(currentUrlKeyList)))
    print('key 조회 :' + str(currentUrlKeyList))