import re
import Constants

from Common import initChromBrowser, waitUntilElementLocated, commitRankingDataList
from selenium.webdriver.common.by import By
from selenium.common import TimeoutException, NoSuchElementException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


# 인터파크 카테고리 랭크 추출 메서드
def crawlingRankingMain():
    for count in range(0, 4):
        crawlingRankingMainDetail(count)


# 인터파크 순위 유형 별 랭크 추출 메서드
def crawlingRankingMainDetail(count):
    # 공통 Url 경로
    allBaseListUrl = 'http://ticket.interpark.com/TPGoodsList.asp'

    # 반환할 데이터 딕셔너리 선언, Url 리스트 / 카테고리 / 순위 유형 를 담을 예정
    rankingDataList = {}

    # 뮤지컬
    if count == 0:
        rankingDataList['product_category'] = 'MUSICAL'
        rankingDataList['ranking_url'] = allBaseListUrl + '?Ca=Mus'
    # 연극
    if count == 1:
        rankingDataList['product_category'] = 'DRAMA'
        rankingDataList['ranking_url'] = allBaseListUrl + '?Ca=Dra'
    # 클래식
    if count == 2:
        rankingDataList['product_category'] = 'CLASSIC'
        rankingDataList['ranking_url'] = allBaseListUrl + '?Ca=Cla&SubCa=ClassicMain'
    # 전시
    if count == 3:
        rankingDataList['product_category'] = 'EXHIBITION'
        rankingDataList['ranking_url'] = allBaseListUrl + '?Ca=Eve&SubCa=Eve_O'

    if count is None:
        raise Exception('No Ranking Data List!!!')

    for index in range(0, 3):
        crawlingRankingUrlList(index, rankingDataList)

# 인터파크 순위 페이지 접근해 순위 url 리스트 획득하는 메서드
def crawlingRankingUrlList(index, rankingDataList):

    rankingFullUrl = None

    # todayRanking = allRankingListUrl + '&Sort=1'
    # sortByNameAsc = allRankingListUrl + '&Sort=4'

    # 주간 랭킹
    if index == 0:
        rankingDataList['product_ranking_category'] = 'Week'
        rankingFullUrl = rankingDataList['ranking_url'] + '&Sort=2'

    # 월간 랭킹
    if index == 1:
        rankingDataList['product_ranking_category'] = 'Month'
        rankingFullUrl = rankingDataList['ranking_url'] + '&Sort=3'

    # 곧 종료 예정 랭킹
    if index == 2:
        rankingDataList['product_ranking_category'] = 'CloseSoon'
        rankingFullUrl = rankingDataList['ranking_url'] + '&Sort=5'

    if rankingFullUrl is None:
        raise Exception('No Ranking Full Url!!!')

    print('<<< Start --- Crawling Interpark >>>')
    print('========================================')

    # 크롬 브라우저 옵션 설정 및 실행 메서드
    browser = initChromBrowser()

    browser.get(rankingFullUrl)

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

    rankingDataList['product_url_list'] = currentUrlKeyList

    commitRankingDataList(rankingDataList)