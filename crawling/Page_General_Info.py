import re
import re
import time
from typing import List

from selenium.common import NoSuchElementException, ElementClickInterceptedException
from selenium.webdriver.chrome.webdriver import WebDriver
from selenium.webdriver.common.by import By
from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

import Constants_Rank
import Constants_Selector
from Common import waitUntilElementLocated, print_log, log_error
from DataClass import SeatPriceInfo, ProductInfo, GeneralCategory, DetailLocationInfo, PeriodInfo, AgeInfo


# 일반 정보 추출
def extractGeneralInfo(browser: WebDriver, product_info: ProductInfo) -> None:
    # 아래 요소 추출
    # ******************** #
    # 장소
    # (한정 판매) 공연기간, 공연시간 / (상시 판매) 기간
    # 관람 연령
    # 가격

    # 일반 정보들이 위치한 요소 추출
    print_log('일반 정보 추출')
    general_class_list = browser.find_element(By.CSS_SELECTOR, Constants_Selector.generalInfoCss).find_elements(By.CLASS_NAME, 'infoItem')

    for general_element in general_class_list:
        general_class = general_element.get_attribute('class')
        print_log(general_class)

        # 장소, 공연기간/기간, 공연시간, 관람연령 출력
        if general_class == 'infoItem':
            # print_log('장소, 공연기간/기간, 공연시간, 관람연령 출력')
            general_category = general_element.find_element(By.CLASS_NAME, 'infoLabel').text

            if general_category == GeneralCategory.PLACE.value:
                print_log(f'general_category == {general_category}')
                # 장소와 상제 장소 판단/추출 및 데이터 리스트 추가
                product_info.location = extract_place_info(general_element)
                print_log(f"장소: {product_info.location}")
                # 상세 장소 추출 메서드
                parsing_detail_place(general_element, browser, product_info)

            # 공연기간/기간 판단/추출
            period_list = [GeneralCategory.PERIOD.value, GeneralCategory.PERIOD_V2.value]
            if general_category in period_list:
                print_log(f'general_category == {general_category}')
                # 공연기간/기간 판단/추출 메서드
                extractPeriodInfo(general_element, product_info)

            # 공연시간 판단/추출
            if general_category == GeneralCategory.TIME.value:
                print_log(f'general_category == {general_category}')
                extractPerfTimeInfo(general_element, product_info)

            # 관람연령 출력
            if general_category == '관람연령':
                print_log(f'general_category == {general_category}')
                extractAgeInfo(general_element, product_info)
                print_log(f"나이: {product_info.age_num}, 한국식 나이: {product_info.age_kor}, 나이 타입 : {product_info.age_type}")

        # 가격 요소 출력
        if general_class == 'infoItem infoPrice':
            print_log(f'가격 요소 출력')
            # extractPriceInfo(general_element, browser, seatPriceDataList)
            extractPriceInfo(general_element, browser, product_info)
            print_log(f"좌석/가격 : {product_info.seat_price_info_list}")




# 일반 정보 추출 > 장소 판단 / 추출 메서드
# 장소가 아니면 False, 맞다면 장소 정보를 반환 (단, (자세히)는 제외
def extract_place_info(inform):
    print_log('일반 정보 추출 > 장소 판단/추출 메서드')
    return re.sub('\(자세히\)', '', inform.find_element(By.CLASS_NAME, 'infoDesc').text)


# 일반 정보 추출 > 상세 장소 탐색 메서드
def parsing_detail_place(inform: WebElement, browser: WebDriver, product_info: ProductInfo) -> None:
    try:
        print_log('일반 정보 추출 > 상세 장소 탐색')
        # 상세 장소 팝업 창 열기
        browser.execute_script("arguments[0].click();", inform.find_element(By.CSS_SELECTOR, 'div > a'))

        if browser.current_url != product_info.url:
            print_log(Constants_Rank.error_msg_no_url)
            product_info.detail_location = DetailLocationInfo.NOT_PAGE.value
        # 해당 팝업창 나올 때 까지 대기, 없다면 에러
        waitUntilElementLocated(browser, 10, By.CSS_SELECTOR, Constants_Selector.detailPlacePopupOpenCss)

        # 팝업 창에서 p 태그 리스트 추출
        find_detail_place_list = browser.find_elements(By.CSS_SELECTOR, Constants_Selector.detailPlaceListCss)

        detail_place = ''

        # p 태그 리스트에서 주소 값을 찾아 반환
        for find_detail_place in find_detail_place_list:
            if find_detail_place.text[0:2] == '주소':
                detail_place = find_detail_place.find_element(By.TAG_NAME, 'span').text

        time.sleep(1.0)

        # 상세 정보 위치 팝업창 닫기
        browser.execute_script("arguments[0].click();", browser.find_element(By.CSS_SELECTOR, Constants_Selector.detailPlacePopupCloseCss))

        time.sleep(0.5)

        # 상세 장소 값이 비어 있으면 False, 그렇지 않으면 추출한 상세 장소 추출
        if detail_place != '':
            print_log(f'상세 장소 정보 = {detail_place}')
            product_info.detail_location = detail_place
        else:
            print_log('상세 장소 정보 없음')
    except NoSuchElementException as ne:
        log_error(ne)
    except ElementClickInterceptedException as ecie:
        log_error(ecie)


# 일반 정보 추출 > 공연 기간/기간 판단 / 추출 메서드
# 공연 기간이 아니면 False, 맞다면 공연 기간 정보를 반환
def extractPeriodInfo(inform: WebElement, product_info: ProductInfo) -> None:
    print_log('일반 정보 추출 > 공연 기간/기간 판단 / 추출')
    period_info = inform.find_element(By.CLASS_NAME, 'infoDesc').text
    # 공연 기간이 나뉘어 있는지 판단 / 추출
    isPeriodInfoSplit(period_info, product_info)


# 일반 정보 추출 > 공연 기간 판단/추출 > 공연 기간 시작/끝 판단 메서드
# 공연 기간이 나뉘어 있지 않다면 False
# 나뉘어 있다면 나눠서 시작(start)와 끝(end)를 딕셔너리로 반환
def isPeriodInfoSplit(periodInfo: str, product_info: ProductInfo) -> None:
    print_log(f'일반 정보 추출 > 공연 기간/기간 판단 / 추출 > 공연 기간 시작/끝 판단')
    isTerm = periodInfo.find(' ~')
    if isTerm == -1:
        print_log('공연 기간 나눠 있지 않음')
        product_info.period_start = periodInfo
        product_info.period_end = None
    # 오픈런 유무 판단, 오픈런이면 이전 부분만 포함
    else:
        startPeriod = periodInfo.split(' ~')[0]
        endPeriod = periodInfo.split(' ~')[1]
        if endPeriod == PeriodInfo.OPENRUN.value:
            product_info.period_start = startPeriod
            product_info.period_end = PeriodInfo.OPENRUN.name
        else:
            product_info.period_start = startPeriod
            product_info.period_end = endPeriod
    print_log(f'공연기간 -> 시작: {product_info.period_start} / 종료 : {product_info.period_end}')


# 일반 정보 추출 > 공연 시간 판단/추출 메서드
# 공연 시간이 아니면 False, 맞다면 공연 시간 정보를 반환
def extractPerfTimeInfo(inform: WebElement, product_info: ProductInfo) -> None:
    timeInfo = inform.find_element(By.CLASS_NAME, 'infoDesc').text
    # 휴식 시간 포함되어 있는지 판단 / 추출
    isPerfTimeInfoIncludeBreak(timeInfo, product_info)


# 일반 정보 추출 > 공연 시간 판단/추출 > 휴식 정보 판단/추출 메서드
# 인터미션이 포함되어 있지 않다면 False
# 포함되어 있다면 공연시간(perform)와 휴식시간(break)를 딕셔너리로 반환
def isPerfTimeInfoIncludeBreak(timeInfo: str, product_info: ProductInfo) -> None:
    isBreak = timeInfo.find('인터미션')
    if isBreak == -1:
        product_info.perf_time = int(re.findall(r'[0-9]+', timeInfo)[0])
        print_log(f'공연시간 -> {product_info.perf_time}')
    else:
        timeInfoSplit = re.findall(r'[0-9]+', timeInfo)
        product_info.perf_time = int(timeInfoSplit[0])
        product_info.intermission = int(timeInfoSplit[1])
        print_log(f"공연시간/인터미션: {product_info.perf_time} / {product_info.intermission}")



# 일반 정보 추출 > 관람 연령 판단/추출 메서드
# 관람 연령이 아니면 False, 맞다면 관람 연령 정보를 반환
def extractAgeInfo(inform: WebElement, product_info: ProductInfo) -> None:
    print_log('일반 정보 추출 > 관람 연령 판단/추출')
    # 관람연령 출력
    isAgeDetailInfo(inform.find_element(By.CLASS_NAME, 'infoDesc').text, product_info)


# 일반 정보 추출 > 관람 연령 판단/추출 > 상세 관람 연령 판단/추출 메서드
# 전체 관람가 / 만 or 한국 나이 판단/추출 메서드
def isAgeDetailInfo(ageInfo, product_info: ProductInfo) -> None:
    print_log(f'일반 정보 추출 > 관람 연령 판단/추출 > 상세 관람 연령 판단/추출 : ageInfo = {ageInfo}')
    # 전체 관람가 아니면
    if '전체' in ageInfo:
        product_info.age_type = '한국'
        product_info.age_kor = False
        product_info.age_num = 0

    pattern = r'\d+|미취학아동입장불가|초등학생이상|중학생이상|고등학생이상|-'
    match = re.search(pattern, ageInfo)

    if match:
        ageInfoSearch = match.group(0)
        enum_value = AgeInfo.from_string(ageInfoSearch)

        if enum_value:
            product_info.age_type = enum_value.value[1]
            product_info.age_num = enum_value.value[2]

            if product_info.age_type in [AgeInfo.PRE_SCHOOL.age_desc, AgeInfo.TOTAL.age_desc]:
                product_info.age_kor = False
            else:
                product_info.age_kor = True
            return

        elif ageInfoSearch == AgeInfo.TOTAL.age_desc:
            product_info.age_type = '전체'
            product_info.age_num = AgeInfo.TOTAL.age_num
            product_info.age_kor = False

        elif re.search(r'개월', ageInfo):
            product_info.age_type = '한국'
            product_info.age_num = int(ageInfoSearch)/12
            product_info.age_kor = True

        elif not re.match(r'만', ageInfo):
            product_info.age_type = '한국'
            product_info.age_num = int(ageInfoSearch)
            product_info.age_kor = True
        else:
            product_info.age_type = '만'
            product_info.age_num = int(ageInfoSearch)
            product_info.age_kor = True
    return None




# 가격 정보 출력 메서드
def extractPriceInfo(inform, browser, product_info: ProductInfo):
    print_log('일반 정보 추출 > 좌석/가격 정보 출력')
    infoPriceItemList = inform.find_elements(By.CSS_SELECTOR, Constants_Selector.priceItemListCss)

    # 가격 요소 리스트에 담기, 전체 가격 보기 요소 제외
    addListOfPriceInfoV1(product_info, infoPriceItemList)
    if not product_info.is_seat_price_info:
        addListOfPriceInfoV2(product_info, infoPriceItemList)

    # 좌석 정보에 중복이 있는지 확인
    # 없다면 생략, 있다면 상세 정보 표기
    duplicate_seat_list = check_duplicate_seat(product_info)

    if duplicate_seat_list and not product_info.seat_price_info_list:
        print_log(f"DUPLICATE!!!!!! {duplicate_seat_list}")
    #     상세 좌석/가격 정보 출력 메서드
        addListOfDetailPriceInfo(browser, product_info)
        print_log(f"{product_info.seat_price_info_list}")

    if not product_info.seat_price_info_list or product_info.is_seat_price_info is False:
        raise Exception(Constants_Rank.error_msg_no_seat_price)


def check_duplicate_seat(product_info: ProductInfo) -> List[str]:
    """
    중복 여부를 확인
    :param product_info: 중복 데이터 검증할 데이터
    :return: 없다면 빈 List, 있다면 빈 중복 seat가 있는 str List
    """
    seat_set = set()
    duplicates = []
    for seat_price_info in product_info.seat_price_info_list:
        print_log(f"DEBUG!!! {product_info.seat_price_info_list}")
        if seat_price_info.seat in seat_set:
            duplicates.append(seat_price_info.seat)
        else:
            seat_set.add(seat_price_info.seat)
    return duplicates


# 일반 정보 추출 > 좌석/가격 정보 출력 > 좌석/가격 정보 리스트 추가 메서드 V1
# 좌석, 가격 정보를 순서에 맞게 리스트에 저장하는 메서드 호출, 다른 구조로 정렬 되었다면 False 반환
def addListOfPriceInfoV1(product_info: ProductInfo, info_price_item_list: WebDriver):
    print_log('일반 정보 추출 > 좌석/가격 정보 출력 > 좌석/가격 정보 리스트 추가')
    try:
        index = 0
        for infoPriceItem in info_price_item_list[1:]:
            # span 태그로 정렬 되었을 때 좌석, 가격 요소 추출
            savePriceInfoToListV1(index, infoPriceItem, product_info)
            index = index + 1
        # 다른 구조로 요소가 정렬 되었을 때
    except NoSuchElementException as ne:
        log_error(ne)


# 일반 정보 추출 > 좌석/가격 정보 출력 > 좌석/가격 정보 리스트 추가 메서드 V1 > 좌석/가격 정보 리스트 저장 메서드 V1
# span 태그로 정렬 되었을 때 좌석, 가격 요소 추출 후 리스트에 저장
def savePriceInfoToListV1(index: int, info_price_item: WebElement, product_info:ProductInfo):
    seatInfo = info_price_item.find_element(By.CSS_SELECTOR, 'span.name').text
    priceInfo = info_price_item.find_element(By.CSS_SELECTOR, 'span.price').text

    seat_price = SeatPriceInfo()

    # 예) VIP석, OP석 등 일때 마지막 '석' 제외하고 좌석 정보 리스트에 저장
    seat_price.seat = seatInfo
    # 예) 10,000원, 8,000원 일때 원, 쉼표(,) 제외하고 가격 정보 리스트에 저장
    seat_price.price = re.sub('[원,]', '', priceInfo)
    product_info.seat_price_info_list.insert(index, seat_price)
    product_info.is_seat_price_info = True



# 일반 정보 추출 > 좌석/가격 정보 출력 > 좌석/가격 정보 리스트 추가 메서드 V2
# 좌석, 가격 정보를 순서에 맞게 리스트에 저장하는 메서드 호출, 다른 구조로 정렬 되었다면 False 반환
def addListOfPriceInfoV2(product_info: ProductInfo, info_price_item_list: WebElement) -> None:
    print_log('일반 정보 추출 > 좌석/가격 정보 출력 > 좌석/가격 정보 리스트 추가 메서드 V2')
    try:
        index = 0
        # 첫번째 전체 가격 보기 클릭 요소 뒤에 있는 요소에 접근해서 검색
        prdPriceDetailList = info_price_item_list[1].find_element(By.CLASS_NAME, 'prdPriceDetail').find_elements \
            (By.TAG_NAME, 'li')
        for prdPriceDetail in prdPriceDetailList:
            # li 태그로 정렬 되었을 때 좌석, 가격 요소 추출
            savePriceInfoToListV2(index, prdPriceDetail, product_info)
            index = index + 1
    except NoSuchElementException as ne:
        log_error(ne)
    except IndexError as ie:
        log_error(ie)


# 일반 정보 추출 > 좌석/가격 정보 출력 > 좌석/가격 정보 리스트 추가 메서드 V2 > 좌석/가격 정보 리스트 저장 메서드 V2
# li 태그로 정렬 되었을 때 좌석, 가격 요소 추출 후 리스트에 저장
def savePriceInfoToListV2(index: int, info: WebElement, product_info:ProductInfo) -> None:
    print_log('일반 정보 추출 > 좌석/가격 정보 출력 > 좌석/가격 정보 리스트 추가 메서드 V2 > 좌석/가격 정보 리스트 저장 메서드 V2')
    # 예) VIP석, OP석 등 일때 마지막 '석' 제외하고 좌석 정보 리스트에 저장
    # 예) 10,000원, 8,000원 일때 원, 쉼표(,) 제외하고 가격 정보 리스트에 저장
    priceInfoSplit = info.text.split(' ')[-1]
    seat_price_info = SeatPriceInfo()
    seat_price_info.seat = info.text.replace(priceInfoSplit, '')
    seat_price_info.price = re.sub(r'석|\s+|원|,', '', priceInfoSplit)
    print_log(f"좌석정보(seat_price_info.seat): {seat_price_info.seat}")
    print_log(f"가격정보(seat_price_info.price): {seat_price_info.price}")
    product_info.seat_price_info_list.insert(index, seat_price_info)
    product_info.is_seat_price_info = True




# 일반 정보 추출 > 좌석/가격 정보 출력 > 상세 좌석/가격 정보 출력
def addListOfDetailPriceInfo(browser, product_info:ProductInfo):
    # print_log('일반 정보 추출 > 좌석/가격 정보 출력 > 상세 좌석/가격 정보 출력')
    element = browser.find_element(By.CSS_SELECTOR, Constants_Selector.detailPrciePopupOpenCss)
    browser.execute_script("arguments[0].click();", element)

    seat_prices = {}

    table = WebDriverWait(browser, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "table.popPriceTable"))
    )

    # 모든 행(tr) 요소 찾기
    rows = table.find_elements(By.TAG_NAME, "tr")

    index = 0

    current_seat = None
    for row in rows:
        # 새로운 좌석 유형 확인
        category = row.find_elements(By.CLASS_NAME, "category")
        if category:
            current_seat = category[0].find_element(By.CLASS_NAME, "categoryContents").text.strip()
            continue

        # 가격 정보 찾기
        name_cell = row.find_elements(By.CLASS_NAME, "name")
        price_cell = row.find_elements(By.TAG_NAME, "td")

        if name_cell and price_cell:
            name = name_cell[0].text.strip('\n')[0].strip()
            price = price_cell[-1].text.strip()

            # '일반' 가격, '무료', 또는 첫 번째 가격 옵션 처리
            if name == "일반" or name == "무료" or not seat_prices.get(current_seat):
                price = int(price.replace(',', '').replace('원', '0'))
                seat_prices[current_seat] = price
                # if current_seat != "전석":  # '전석'이 아닌 경우에만 current_seat 초기화
                #     current_seat = None
                seat_price_info = SeatPriceInfo(seat=current_seat, price=price)
                product_info.seat_price_info_list.insert(index, seat_price_info)
                index = index + 1
                product_info.is_seat_price_info = True


    # 상세 좌석/가격 정보 창 닫기
    element = browser.find_element(By.CSS_SELECTOR, Constants_Selector.detailPricePopupCloseCss)
    browser.execute_script("arguments[0].click();", element)

    time.sleep(1)