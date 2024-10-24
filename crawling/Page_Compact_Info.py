from selenium.webdriver.chrome.webdriver import WebDriver

import Constants_Selector

from selenium.webdriver.common.by import By
from selenium.common import NoSuchElementException
from Common import print_log

from Common import log_error
from DataClass import ProductInfo, LimitedAlways


# 간단 정보 추출 메서드
# 타이틀, 한정 / 상시 상품, 썸네일 포스터 주소 추출
def parsing_compact_info(browser: WebDriver, product_info: ProductInfo) -> None:
    """
    간단 정보 파싱
    상품 타이틀, 한정 혹은 상시, 썸네일 URL
    :param browser: 실행중인 크롬 브라우저
    :param product_info: 파싱 데이터 저장
    :return: None
    """
    print_log('간단 정보 추출')
    # 상품 타이틀 추출 및 데이터 리스트 추가
    product_info.title = extract_title(browser)

    print("\n<<<&=-*$#==---&=-*$#==---&=-*$#==---&=-*$#==---&=-*$#==---&=-*$#==---&=-*$#==---&=-*$#==---&=-*$#==--->>>")
    print_log(f'title: {product_info.title}')

    # 한정 혹은 상시 상품 판단 함수
    parsing_limited_always_desc(browser, product_info)
    if product_info.limited_always == LimitedAlways.LIMITED.status_name:
        print_log(f"한정 상품\t\tlimited_always : {product_info.limited_always}")
    else:
        print_log(f"상시 상품\t\tlimited_always : {product_info.limited_always}")

    # 포스터 주소 추출 및 데이터 리스트 추가

    # $$$ 썸네일 포스터 url 데이터 리스트 추가
    product_info.thumbnail_url = parsing_poster_url(browser)
    print_log(f'포스터 주소 URL: {product_info.thumbnail_url}')

# 상품 타이틀 추출 메서드
def extract_title(browser):
    return browser.find_element(By.CLASS_NAME, Constants_Selector.titleClass).text


# 한정 혹은 상시 판매 구별 메서드
def parsing_limited_always_desc(browser: WebDriver, product_info: ProductInfo) -> None:
    print_log('한정/상시 판매 구별')
    # 상시 판매일 경우 sideContent, 그렇지 않으면 sideHeader
    is_regular_sale = browser.find_element(By.CSS_SELECTOR, Constants_Selector.limitedOrAlwaysCss).get_attribute('class')
    if is_regular_sale == 'sideContent':
        try:
            is_close_product = browser.find_element(By.CSS_SELECTOR, Constants_Selector.descProductAlways).text
            for limited_always in LimitedAlways:
                if is_close_product == limited_always.status_desc:
                    print_log(is_close_product)
                    product_info.limited_always = limited_always.status_name

        except NoSuchElementException as ne:
            is_not_open_product = browser.find_element(By.CSS_SELECTOR, Constants_Selector.descProductRegularTicketOpen).text
            if is_not_open_product == LimitedAlways.NOTIFY_TICKET.status_desc:
                print_log(is_not_open_product)
                product_info.limited_always = LimitedAlways.NOTIFY_TICKET.status_name
            else:
                log_error(ne)
    else:
        print_log(is_regular_sale)
        product_info.limited_always = LimitedAlways.LIMITED.status_name


# 포스터 주소 추출
def parsing_poster_url(browser):
    return browser.find_element(By.CSS_SELECTOR, Constants_Selector.posterPathCss).get_attribute('src')