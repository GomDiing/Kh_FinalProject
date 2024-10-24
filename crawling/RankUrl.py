import re

from selenium.webdriver.chrome.webdriver import WebDriver

import Constants_Selector
import Constants_Rank

from Common import init_chrome_browser, waitUntilElementLocated, commit_category_rank_url, bring_code_from_db, \
    print_log
from selenium.webdriver.common.by import By
from DataClass import ProductInfo, Category, CategoryType, RankInfo, ProductInfoList


def make_category_type_url() -> None:
    """
    인터파크 카테고리별 랭킹 정보 수집하고 처리하는 메서드

    각 카테고리(뮤지컬, 연극, 클래식, 전시)와 타입(주간, 월간, 마감임박)별로
    랭킹 페이지를 순회하며 탐색 URL과 카테고리 정보를 파싱합니다.

    사용하는 클래스:
        - Category: 공연/전시 카테고리 정보 (MUSICAL, DRAMA, CLASSIC, EXHIBITION)
        - CategoryType: 랭킹 타입 정보 (WEEK, MONTH, CLOSE_SOON)
        - RankInfo: 파싱된 정보를 저장하는 데이터 클래스

    Raises:
        Exception: 카테고리 URL 또는 상태 URL이 None인 경우 발생
    """
    # 카테고리별 순회, Category 클래스 참조 (MUSICAL, DRAMA, CLASSIC, EXHIBITION)
    for category in Category:

        # 타이별 순회, Category_Type 클래스 참조 (WEEK, MONTH, CLOSE_SOON)
        for category_type in CategoryType:
            # Dataclass 생성
            rank_info = RankInfo()

            # 크롬 브라우저 옵션 설정 및 실행
            browser = init_chrome_browser()

            rank_info.category = category.display_name
            rank_info.category_url = Constants_Rank.base_rank_url + category.url_suffix

            # URL 파싱 못하면 예외 처리
            if rank_info.category_url is None:
                raise Exception(Constants_Rank.error_msg_category_url)

            # rank_info 설정
            rank_info.category_type = category_type.display_name
            rank_info.url = rank_info.category_url + category_type.url_suffix
            rank_info.table_name = category_type.table_name

            # 예외처리
            if rank_info.url is None:
                raise Exception(Constants_Rank.error_msg_status_url)

            # URL 검색 메서드 호출
            search_url_list(rank_info, browser)

            # 변수 제거
            del rank_info


def search_url_list(rank_info: RankInfo, browser: WebDriver) -> None:
    """
    이전 메서드에서 생성한 인터파크 랭킹 URL에서 탐색 URL 수집하고 데이터베이스 저장하는 메서드

    탐색 URL에서 최대 100개 공연/전시 상품 코드를 추출하여
    RankInfo 객체 저장하고 데이터베이스에 커밋합니다.

    처리 과정:
        1. 브라우저로 랭킹 페이지 접속
        2. 전체 URL 목록 로딩 및 대기
        3. 각 상품 GroupCode 파라미터 추출 및 추출 Code RankInfo 객체 저장
        4. 데이터베이스 커밋

    Args:
        rank_info: 카테고리 정보한 추출된 코드를 저장할 RankInfo 객체
        browser: 초기화된 Selenium WebDriver 인스턴스

    Raises:
        Exception: URL 목록 비어있는 경우 발생
        TimeoutException: 페이지 로딩 타임아웃 발생 시
    """
    # 브라우저 실행
    browser.get(rank_info.url)

    # 모든 URL 목록 로딩될때까지 대기
    waitUntilElementLocated(browser, 10, By.CLASS_NAME, Constants_Selector.total_url_list)

    # 해당 페이지에서 조회된 총 URL개수 탐색
    total_url_list = browser.find_element(By.CLASS_NAME, Constants_Selector.total_url_list)
    count_total_url_list = int(re.search(r'\d+', total_url_list.find_element(By.CSS_SELECTOR, 'span').text).group(0))

    count_total_url_list = 100 if count_total_url_list > 100 else count_total_url_list

    # 조회된 URL 없으면 예외처리
    if count_total_url_list == 0:
        raise Exception(Constants_Rank.error_msg_count_total_url_list)


    # 마지막 요소 탐색
    # 해당 요소가 발생할 때까지 대기
    waitUntilElementLocated(browser, 10, By.CSS_SELECTOR,
                            Constants_Selector.ranking_page_last_css + str(count_total_url_list) + ')')

    # 각각 url의 GroupCode= 뒤에 위치한 url_code 추출, 헤더는 제외
    count = 0
    for index in range(1, count_total_url_list + 1):
        # 해당 페이지 URL 추출
        current_element_css_path = Constants_Selector.ranking_page_current_front_css + str(
            index) + Constants_Selector.ranking_page_current_back_css
        current_url = browser.find_element(By.CSS_SELECTOR, current_element_css_path).get_attribute('href')
        # 해당 URL에서 GroupCode= 뒤에 위치한 code 저장
        current_code = re.sub('GroupCode=', '', current_url.split('?')[1])

        # 해당 urlKey를 리스트에 저장
        rank_info.code_list.insert(count, current_code)
        count = count + 1

    print_log(f"총 code 개수: {str(len(rank_info.code_list))}")
    print_log(f"code 조회: {str(rank_info.code_list)}")

    # DB에 커밋 준비
    commit_category_rank_url(rank_info)


def bring_all_codes_from_db() -> ProductInfoList:
    """
    DB에 저장한 Code와 Category 목록을 불러오는 메서드
    ProductInfoList에 DB에서 불러온 데이터를 저장
    """
    for category_type in CategoryType:

        # 페이지 저장할 리스트
        product_info_list = ProductInfoList()

        bring_code_from_db(category_type, product_info_list)

        return product_info_list
