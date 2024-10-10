import Constants

from selenium.webdriver.common.by import By
from selenium.common import NoSuchElementException
from crawling.Common import print_log


# 간단 정보 추출 메서드
# 타이틀, 한정 / 상시 상품, 썸네일 포스터 주소 추출
def extractCompactInfo(browser, productDataList):
    print_log('간단 정보 추출')
    # 상품 타이틀 추출 및 데이터 리스트 추가
    productDataList['product_title'] = extractTitle(browser)

    print("\n<<<&=-*$#==---&=-*$#==---&=-*$#==---&=-*$#==---&=-*$#==---&=-*$#==---&=-*$#==---&=-*$#==---&=-*$#==--->>>")
    print("=========================================================================================================")
    # print('product_code: ' + productDataList['product_code'])
    # print('타이틀: ' + productDataList['product_title'])
    print_log(f'product_code: {productDataList["product_code"]},\t타이틀: {productDataList["product_title"]}')

    # 한정 혹은 상시 상품 판단 함수
    limitedOrAlways = isLimitedOrAlways(browser)
    if limitedOrAlways == 'limited':
        print_log(f"한정 상품\t\tlimitedOrAlways : {limitedOrAlways}")
    else:
        print_log(f"상시 상품\t\tlimitedOrAlways : {limitedOrAlways}")

    # 포스터 주소 추출 및 데이터 리스트 추가

    # $$$ 썸네일 포스터 url 데이터 리스트 추가
    productDataList['product_thumb_poster_url'] = extractPosterUrl(browser)
    print_log(f'포스터 주소 URL: {productDataList["product_thumb_poster_url"]}')

    return limitedOrAlways


# 상품 타이틀 추출 메서드
def extractTitle(browser):
    return browser.find_element(By.CLASS_NAME, Constants.titleClass).text


# 한정 혹은 상시 판매 구별 메서드
def isLimitedOrAlways(browser):
    print_log('한정/상시 판매 구별')
    # 상시 판매일 경우 sideContent, 그렇지 않으면 sideHeader
    isRegularSale = browser.find_element(By.CSS_SELECTOR, Constants.limitedOrAlwaysCss).get_attribute('class')
    if isRegularSale == 'sideContent':
        try:
            isCloseProduct = browser.find_element(By.CSS_SELECTOR, '#productSide > div > div.sideMain > div > div > div > div > strong').text
            if isCloseProduct == '판매종료':
                print_log(isCloseProduct)
                return 'close'
            if isCloseProduct == '상시상품':
                print_log(isCloseProduct)
                return 'always'
            if isCloseProduct == '판매예정':
                print_log(isCloseProduct)
                return 'not_open'
        except NoSuchElementException:
            isNotOpenProduct = browser.find_element(By.CSS_SELECTOR, '#productSide > div > div.sideMain > div > div > div > div > p').text
            if isNotOpenProduct == '티켓오픈안내':
                print_log(isNotOpenProduct)
                return 'not_open'
    else:
        print_log(isRegularSale)
        return 'limited'


# 포스터 주소 추출
def extractPosterUrl(browser):
    return browser.find_element(By.CSS_SELECTOR, Constants.posterPathCss).get_attribute('src')