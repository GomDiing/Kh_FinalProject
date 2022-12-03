import Constants

from selenium.webdriver.common.by import By
from selenium.common import TimeoutException, NoSuchElementException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def extractCompactInfo(browser):
    # 상품 타이틀 추출
    title = extractTitle(browser)
    print("\n<<<&=-*$#==---&=-*$#==---&=-*$#==---&=-*$#==---&=-*$#==---&=-*$#==---&=-*$#==---&=-*$#==---&=-*$#==--->>>")
    print("=========================================================================================================")
    print('타이틀: ' + title)

    # 한정 혹은 상시 상품 판단
    limitedOrAlways = isLimitedOrAlways(browser)
    if limitedOrAlways == 'limited':
        print('한정 상품')
    else:
        print('상시 상품')

    # 포스터 주소 추출
    posterUrl = extractPosterUrl(browser)
    print('포스터 주소 URL: ' + posterUrl)

    return limitedOrAlways


# 상품 타이틀 추출 메서드
def extractTitle(browser):
    return browser.find_element(By.CLASS_NAME, Constants.titleClass).text


# 한정 혹은 상시 판매 판단 메서드
def isLimitedOrAlways(browser):
    # 상시 판매일 경우 sideContent, 그렇지 않으면 sideHeader
    isRegularSale = browser.find_element(By.CSS_SELECTOR, Constants.limitedOrAlwaysCss).get_attribute('class')
    if isRegularSale == 'sideContent':
        return 'always'
    else:
        return 'limited'


# 포스터 주소 추출
def extractPosterUrl(browser):
    return browser.find_element(By.CSS_SELECTOR, Constants.posterPathCss).get_attribute('src')