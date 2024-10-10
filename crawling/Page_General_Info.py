import copy
import re
import time

from crawling import Constants
from selenium.webdriver.common.by import By
from selenium.common import TimeoutException, NoSuchElementException, ElementClickInterceptedException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from crawling.Common import waitUntilElementLocated, initChromBrowser, print_log, log_error


# 일반 정보 추출
def extractGeneralInfo(browser, productDataList, seatPriceDataList):
    # 아래 요소 추출
    # ******************** #
    # 장소
    # (한정 판매) 공연기간, 공연시간 / (상시 판매) 기간
    # 관람 연령
    # 가격

    # 일반 정보들이 위치한 요소 추출
    print_log('일반 정보 추출')
    informList = browser.find_element(By.CSS_SELECTOR, Constants.generalInfoCss).find_elements(By.CLASS_NAME, 'infoItem')

    for inform in informList:
        attribute = inform.get_attribute('class')
        print_log(attribute)

        # 장소, 공연기간/기간, 공연시간, 관람연령 출력
        if attribute == 'infoItem':
            # print_log('장소, 공연기간/기간, 공연시간, 관람연령 출력')
            elementName = inform.find_element(By.CLASS_NAME, 'infoLabel').text

            if elementName == '장소':
                print_log(f'elementName == {elementName}')
                # 장소와 상제 장소 판단/추출 및 데이터 리스트 추가
                productDataList['product_location'] = extractPlaceInfo(inform)
                print_log(f"장소: {productDataList['product_location']}")
                # 상세 장소 추출 메서드
                detailPlaceInfo = extractDetailPlace(inform, browser, productDataList)
                if detailPlaceInfo == 'NOT PAGE':
                    productDataList['product_detail_location'] = 'NOT PAGE'
                    print_log(f'상세 장소: {productDataList["product_detail_location"]}')
                    return
                if detailPlaceInfo is not False:
                    # $$$ 상세 장소 데이터 추가
                    productDataList['product_detail_location'] = detailPlaceInfo
                    print_log(f'상세 장소: {productDataList["product_detail_location"]}')
                else:
                    # $$$ 상세 장소 데이터 추가
                    productDataList['product_detail_location'] = None
                    print_log(f'상세 장소: {productDataList["product_detail_location"]}')

            # 공연기간/기간 판단/추출
            perfPeriodList = ['공연기간', '기간']
            if elementName in perfPeriodList:
                print_log(f'elementName == {elementName}')
                # 공연기간/기간 판단/추출 메서드
                perfPeriodInfo = extractPeriodInfo(inform)
                if isinstance(perfPeriodInfo, str):
                    # print('공연기간: ' + perfPeriodInfo)
                    # $$$ 기간 데이터 리스트 추가
                    productDataList['product_period_start'] = perfPeriodInfo
                    productDataList['product_period_end'] = None
                    print_log(f'공연기간 -> {elementName} : {perfPeriodInfo}')
                else:
                    # $$$ 시작 기간 데이터 리스트 추가
                    productDataList['product_period_start'] = perfPeriodInfo['start']
                    print_log(f"공연기간 -> (시작) {elementName} : {perfPeriodInfo['start']}")
                    # $$$ 종료 기간 데이터 리스트 추가
                    productDataList['product_period_end'] = perfPeriodInfo['end']
                    print_log(f"공연기간 -> (종료) {elementName} : {perfPeriodInfo['end']}")

            # 공연시간 판단/추출
            if elementName == '공연시간':
                print_log(f'elementName == {elementName}')
                perfTimeInfo = extractPerfTimeInfo(inform)
                if isinstance(perfTimeInfo, str):
                    # $$$ 공연시간 데이터 리스트 추가
                    productDataList['product_time_min'] = int(perfTimeInfo)
                    print_log(f'공연시간 -> {perfTimeInfo}')
                else:
                    # $$$ 공연시간 데이터 리스트 추가
                    productDataList['product_time_min'] = int(perfTimeInfo['perform'])
                    print_log(f"공연시간: {perfTimeInfo['perform']}")
                    # $$$ 인터미션 데이터 리스트 추가
                    productDataList['product_time_break'] = int(perfTimeInfo['break'])
                    print_log(f"인터미션: {perfTimeInfo['break']}")

            # 관람연령 출력
            if elementName == '관람연령':
                print_log(f'elementName == {elementName}')
                ageInfo = extractAgeInfo(inform)
                # 나이 분류
                # str 타입이면 전체 관람가
                # 그 외엔 dict 타입
                if isinstance(ageInfo, str):
                    # $$$ 연령 데이터 리스트 추가
                    productDataList['product_age'] = 0
                    productDataList['product_age_isKorean'] = False
                    print_log(f"전체: {str(productDataList['product_age'])}")
                else:
                    if ageInfo['type'] == '한국':
                        # $$$ 연령 데이터 리스트 추가
                        productDataList['product_age'] = ageInfo['age']
                        productDataList['product_age_isKorean'] = True
                        print_log(f"한국식 나이: {str(ageInfo['age'])}")
                    elif ageInfo['type'] == '만':
                        productDataList['product_age'] = ageInfo['age']
                        productDataList['product_age_isKorean'] = False
                        print_log(f"만 나이: {str(ageInfo['age'])}")
                    elif ageInfo['type'] == '미취학아동입장불가':
                        productDataList['product_age'] = ageInfo['age']
                        productDataList['product_age_isKorean'] = True
                        print_log(f"미취학아동입장불가: {str(ageInfo['age'])}")
                    elif ageInfo['type'] == '전체':
                        productDataList['product_age'] = ageInfo['age']
                        productDataList['product_age_isKorean'] = False
                        print_log(f"전체: {str(ageInfo['age'])}")

        # 가격 요소 출력
        if attribute == 'infoItem infoPrice':
            print_log(f'가격 요소 출력')
            extractPriceInfo(inform, browser, seatPriceDataList)


# 일반 정보 추출 > 장소 판단 / 추출 메서드
# 장소가 아니면 False, 맞다면 장소 정보를 반환 (단, (자세히)는 제외
def extractPlaceInfo(inform):
    print_log('일반 정보 추출 > 장소 판단/추출 메서드')
    return re.sub('\(자세히\)', '', inform.find_element(By.CLASS_NAME, 'infoDesc').text)


# 일반 정보 추출 > 상세 장소 탐색 메서드
def extractDetailPlace(inform, browser, productDataList):
    try:
        print_log('일반 정보 추출 > 상세 장소 탐색')
        # 상세 장소 팝업 창 열기
        # inform.find_element(By.CSS_SELECTOR, 'div > a')
        browser.execute_script("arguments[0].click();", inform.find_element(By.CSS_SELECTOR, 'div > a'))

        if browser.current_url != productDataList['product_url']:
            print_log('url 불일치')
            return 'NOT PAGE'
        # 해당 팝업창 나올 때 까지 대기, 없다면 에러
        waitUntilElementLocated(browser, 10, By.CSS_SELECTOR, Constants.detailPlacePopupOpenCss)

        # 팝업 창에서 p 태그 리스트 추출
        detailPlaceList = browser.find_elements(By.CSS_SELECTOR, Constants.detailPlaceListCss)

        findDetailPlace = ''

        # p 태그 리스트에서 주소 값을 찾아 반환
        for detailPlace in detailPlaceList:
            if detailPlace.text[0:2] == '주소':
                findDetailPlace = detailPlace.find_element(By.TAG_NAME, 'span').text

        time.sleep(1.0)

        # 상세 정보 위치 팝업창 닫기
        # browser.find_element(By.CSS_SELECTOR, Constants.detailPlacePopupCloseCss)
        browser.execute_script("arguments[0].click();", browser.find_element(By.CSS_SELECTOR, Constants.detailPlacePopupCloseCss))

        time.sleep(0.5)

        # 상세 장소 값이 비어 있으면 False, 그렇지 않으면 추출한 상세 장소 추출
        if findDetailPlace != '':
            print_log(f'상세 장소 정보 = {findDetailPlace}')
            return findDetailPlace
        else:
            print_log('상세 장소 정보 없음')
            return False
    except NoSuchElementException as ne:
        log_error(ne)
        return False
    except ElementClickInterceptedException as ecie:
        log_error(ecie)
        return False


# 일반 정보 추출 > 공연 기간/기간 판단 / 추출 메서드
# 공연 기간이 아니면 False, 맞다면 공연 기간 정보를 반환
def extractPeriodInfo(inform):
    print_log('일반 정보 추출 > 공연 기간/기간 판단 / 추출')
    periodInfo = inform.find_element(By.CLASS_NAME, 'infoDesc').text
    # 공연 기간이 나뉘어 있는지 판단 / 추출
    isPeriodSplit = isPeriodInfoSplit(periodInfo)
    # 나뉘어 있지 않다면 str 타입 출력
    if isPeriodSplit is False:
        print_log(f'공연 기간 분리 여부 -> 냐뉘지 않음 : {periodInfo}')
        return periodInfo
    # 공연 정보가 나뉘어 있다면
    # str 혹은 dict 타입 {'start': *, 'end': *} 로 출력
    else:
        print_log(f'공연 기간 분리 여부 -> 나뉨 : {isPeriodSplit}')
        return isPeriodSplit


# 일반 정보 추출 > 공연 기간 판단/추출 > 공연 기간 시작/끝 판단 메서드
# 공연 기간이 나뉘어 있지 않다면 False
# 나뉘어 있다면 나눠서 시작(start)와 끝(end)를 딕셔너리로 반환
def isPeriodInfoSplit(periodInfo):
    print_log(f'일반 정보 추출 > 공연 기간/기간 판단 / 추출 > 공연 기간 시작/끝 판단')
    isTerm = periodInfo.find(' ~')
    if isTerm == -1:
        print_log('공연 기간 나눠 있지 않음')
        return False
    # 오픈런 유무 판단, 오픈런이면 이전 부분만 포함
    else:
        # return {'start': periodInfo.split(' ~')[0], 'end': periodInfo.split(' ~')[1]}
        startPeriod = periodInfo.split(' ~')[0]
        endPeriod = periodInfo.split(' ~')[1]
        if endPeriod == '오픈런':
            print_log(f'startPeriod == {startPeriod} endPeriod == 오픈런')
            return {'start': startPeriod, 'end': 'OPENRUN'}
        else:
            print_log(f'startPeriod == {startPeriod} endPeriod == {endPeriod}')
            return {'start': startPeriod, 'end': endPeriod}


# 일반 정보 추출 > 공연 시간 판단/추출 메서드
# 공연 시간이 아니면 False, 맞다면 공연 시간 정보를 반환
def extractPerfTimeInfo(inform):
    timeInfo = inform.find_element(By.CLASS_NAME, 'infoDesc').text
    # 휴식 시간 포함되어 있는지 판단 / 추출
    isIncludeBreak = isPerfTimeInfoIncludeBreak(timeInfo)
    # 포함되어 있지 않다면 str 타입 출력
    if isIncludeBreak is False:
        return re.findall(r'[0-9]+', timeInfo)[0]
    # 휴식 시간이 포함되어 있다면 dict 타입 {'perform': *, 'break': *} 로 출력
    else:
        return isIncludeBreak


# 일반 정보 추출 > 공연 시간 판단/추출 > 휴식 정보 판단/추출 메서드
# 인터미션이 포함되어 있지 않다면 False
# 포함되어 있다면 공연시간(perform)와 휴식시간(break)를 딕셔너리로 반환
def isPerfTimeInfoIncludeBreak(timeInfo):
    isBreak = timeInfo.find('인터미션')
    if isBreak == -1:
        return False
    else:
        timeInfoSplit = re.findall(r'[0-9]+', timeInfo)
        return {'perform': timeInfoSplit[0], 'break': timeInfoSplit[1]}


# 일반 정보 추출 > 관람 연령 판단/추출 메서드
# 관람 연령이 아니면 False, 맞다면 관람 연령 정보를 반환
def extractAgeInfo(inform):
    print_log('일반 정보 추출 > 관람 연령 판단/추출')
    # 관람연령 출력
    isAgeDetail = isAgeDetailInfo(inform.find_element(By.CLASS_NAME, 'infoDesc').text)
    # 상세 관람 연령 판단/추출 메서드
    # 전체 관람가 이면 str 타입 전체 / 만 or 한국 나이면 dict 타입 {'type': *, 'age': '*'} 반환
    return isAgeDetail


# 일반 정보 추출 > 관람 연령 판단/추출 > 상세 관람 연령 판단/추출 메서드
# 전체 관람가 / 만 or 한국 나이 판단/추출 메서드
def isAgeDetailInfo(ageInfo):
    print_log(f'일반 정보 추출 > 관람 연령 판단/추출 > 상세 관람 연령 판단/추출 : ageInfo = {ageInfo}')
    # 전체 관람가 아니면
    if ageInfo.find('전체') == -1:
        # 만 / 한국식 나이일 경우 dict 타입 {'type': *, 'age': *} 로 출력
        ageInfoSearch = re.search(r'\d+|미취학아동입장불가|초등학생이상|중학생이상|고등학생이상|-', ageInfo).group(0)
        # 한국식 나이면 type = 한국학
        if ageInfoSearch == '미취학아동입장불가':
            return {'type': '미취학아동입장불가', 'age': 6}
        if ageInfoSearch == '초등학생이상':
            return {'type': '한국', 'age': 8}
        if ageInfoSearch == '중학생이상':
            return {'type': '한국', 'age': 14}
        if ageInfoSearch == '고등학생이상':
            return {'type': '한국', 'age': 17}
        # if ageInfoSearch == '전체관람가':
        #     return {'type': '전체', 'age': 0}
        if ageInfoSearch == '-':
            return {'type': '전체', 'age': 0}
        if re.search(r'개월', ageInfo):
            return {'type': '한국', 'age': int(ageInfoSearch)/12}
        if re.match(r'만', ageInfo) is None:
            return {'type': '한국', 'age': int(ageInfoSearch)}
        # 만 나이면 type = 만
        else:
            return {'type': '만', 'age': int(ageInfoSearch)}
    # 전체 관람가 이면 '전체' 반환
    else:
        return '전체'


# 가격 정보 출력 메서드
def extractPriceInfo(inform, browser, seatPriceDataList):
    print_log('일반 정보 추출 > 좌석/가격 정보 출력')
    infoPriceItemList = inform.find_elements(By.CSS_SELECTOR, Constants.priceItemListCss)
    # 가격 요소 인덱스 확인용
    # index = 0
    # 좌석이 모두 동일할 경우
    seatInfoList = []
    priceInfoList = []

    # 가격 요소 리스트에 담기, 전체 가격 보기 요소 제외
    # for infoPriceItem in infoPriceItemList[1:]:
    isPriceInfoValidFirst = addListOfPriceInfoV1(seatInfoList, priceInfoList, infoPriceItemList)
    print_log(f'isPriceInfoValidFirst: {str(isPriceInfoValidFirst)}')
    if isPriceInfoValidFirst is False:
        addListOfPriceInfoV2(seatInfoList, priceInfoList, infoPriceItemList)
        # index = index + 1

    # 좌석 정보에 중복이 있는지 확인
    # 없다면 생략, 있다면 상세 정보 표기
    if len(seatInfoList) == len(set(seatInfoList)) and len(seatInfoList) != 0:
        # pass
        for count in range(0, len(seatInfoList)):
            seatPriceDataRecord = {}
            seatPriceDataRecord['seat'] = seatInfoList[count]
            seatPriceDataRecord['price'] = priceInfoList[count].replace(',', '')
            print_log(f"{str(count + 1)} 번 좌석 정보 {seatPriceDataRecord['seat']} {seatPriceDataRecord['price']}")

            seatPriceDataList.append(seatPriceDataRecord)

    else:
        # 상세 좌석/가격 정보 출력 메서드
        addListOfDetailPriceInfo(seatInfoList, priceInfoList, browser)
        for count in range(0, len(seatInfoList)):
            seatPriceDataRecord = {}
            print_log(f"상세: {str(count + 1)} 번 좌석 정보 {seatInfoList[count]}")
            print_log(f"상세: {str(count + 1)} 번 가격 정보 {priceInfoList[count].replace(',', '')}")
            seatPriceDataRecord['seat'] = seatInfoList[count]
            seatPriceDataRecord['price'] = priceInfoList[count]

            seatPriceDataList.append(seatPriceDataRecord)

    print_log(f'seatPriceDataList : {seatPriceDataList}')
    return seatPriceDataList


# 일반 정보 추출 > 좌석/가격 정보 출력 > 좌석/가격 정보 리스트 추가 메서드 V1
# 좌석, 가격 정보를 순서에 맞게 리스트에 저장하는 메서드 호출, 다른 구조로 정렬 되었다면 False 반환
def addListOfPriceInfoV1(seatInfoList, priceInfoList, infoPriceItemList):
    print_log('일반 정보 추출 > 좌석/가격 정보 출력 > 좌석/가격 정보 리스트 추가')
    priceInfoList.clear()
    seatInfoList.clear()
    try:
        index = 0
        for infoPriceItem in infoPriceItemList[1:]:
            # span 태그로 정렬 되었을 때 좌석, 가격 요소 추출
            savePriceInfoToListV1(index, seatInfoList, priceInfoList, infoPriceItem)
            index = index + 1
        # 다른 구조로 요소가 정렬 되었을 때
    except NoSuchElementException as ne:
        log_error(ne)
        return False
    return True


# 일반 정보 추출 > 좌석/가격 정보 출력 > 좌석/가격 정보 리스트 추가 메서드 V1 > 좌석/가격 정보 리스트 저장 메서드 V1
# span 태그로 정렬 되었을 때 좌석, 가격 요소 추출 후 리스트에 저장
def savePriceInfoToListV1(index, seatInfoList, priceInfoList, infoPriceItem):
    seatInfo = infoPriceItem.find_element(By.CSS_SELECTOR, 'span.name').text
    priceInfo = infoPriceItem.find_element(By.CSS_SELECTOR, 'span.price').text
    # print_log(f"일반 정보 추출 > 좌석/가격 정보 출력 > 좌석/가격 정보 리스트 추가 메서드 V1 > 좌석/가격 정보 리스트 저장 메서드 V1: seatInfo={seatInfo} priceInfo={priceInfo}")
    # 예) VIP석, OP석 등 일때 마지막 '석' 제외하고 좌석 정보 리스트에 저장
    # seatInfoList.insert(index, re.sub(r'석$', '', seatInfo))
    seatInfoList.insert(index, seatInfo)
    # 예) 10,000원, 8,000원 일때 원, 쉼표(,) 제외하고 가격 정보 리스트에 저장
    priceInfoList.insert(index, re.sub('[원,]', '', priceInfo))


# 일반 정보 추출 > 좌석/가격 정보 출력 > 좌석/가격 정보 리스트 추가 메서드 V2
# 좌석, 가격 정보를 순서에 맞게 리스트에 저장하는 메서드 호출, 다른 구조로 정렬 되었다면 False 반환
def addListOfPriceInfoV2(seatInfoList, priceInfoList, infoPriceItemList):
    print_log('일반 정보 추출 > 좌석/가격 정보 출력 > 좌석/가격 정보 리스트 추가 메서드 V2')
    seatInfoList.clear()
    priceInfoList.clear()
    try:
        index = 0
        # 첫번째 전체 가격 보기 클릭 요소 뒤에 있는 요소에 접근해서 검색
        prdPriceDetailList = infoPriceItemList[1].find_element(By.CLASS_NAME, 'prdPriceDetail').find_elements \
            (By.TAG_NAME, 'li')
        for prdPriceDetail in prdPriceDetailList:
            # li 태그로 정렬 되었을 때 좌석, 가격 요소 추출
            savePriceInfoToListV2(index, seatInfoList, priceInfoList, prdPriceDetail)
            index = index + 1
    except NoSuchElementException as ne:
        log_error(ne)
        return False
    return True


# 일반 정보 추출 > 좌석/가격 정보 출력 > 좌석/가격 정보 리스트 추가 메서드 V2 > 좌석/가격 정보 리스트 저장 메서드 V2
# li 태그로 정렬 되었을 때 좌석, 가격 요소 추출 후 리스트에 저장
def savePriceInfoToListV2(index, seatInfoList, priceInfoList, prdPriceDetail):
    print_log('일반 정보 추출 > 좌석/가격 정보 출력 > 좌석/가격 정보 리스트 추가 메서드 V2 > 좌석/가격 정보 리스트 저장 메서드 V2')
    # 예) VIP석, OP석 등 일때 마지막 '석' 제외하고 좌석 정보 리스트에 저장
    # 예) 10,000원, 8,000원 일때 원, 쉼표(,) 제외하고 가격 정보 리스트에 저장
    priceInfoSplit = prdPriceDetail.text.split(' ')[-1]
    priceInfo = re.sub(r'석|\s+|원|,', '', priceInfoSplit)
    priceInfoList.insert(index, priceInfo)

    seatInfo = prdPriceDetail.text.replace(priceInfoSplit, '')
    seatInfoList.insert(index, seatInfo)
    print('prdPriceDetail: ' + prdPriceDetail.text)
    print('seatInfo: ' + seatInfo)
    print('priceInfoSpace: ' + priceInfoSplit)
    print('priceInfo: ' + priceInfo)


# 일반 정보 추출 > 좌석/가격 정보 출력 > 상세 좌석/가격 정보 출력
def addListOfDetailPriceInfo(seatInfoList, priceInfoList, browser):
    print_log('일반 정보 추출 > 좌석/가격 정보 출력 > 상세 좌석/가격 정보 출력')
    seatInfoList.clear()
    priceInfoList.clear()

    # 상세 좌석/가격 정보 창 열기
    # browser.find_element(By.CSS_SELECTOR, Constants.detailPrciePopupOpenCss).click()
    element = browser.find_element(By.CSS_SELECTOR, Constants.detailPrciePopupOpenCss)
    browser.execute_script("arguments[0].click();", element)
    browser.execute_script("arguments[0].click();", element)

    # 해당 팝업 창 나올 때 까지 대기, 없다면 에러
    waitUntilElementLocated(browser, 10, By.CSS_SELECTOR, Constants.detailPriceTableCss)

    time.sleep(0.5)

    # 상세 좌석/가격 정보 선택
    detailInfoList = browser.find_element(By.CSS_SELECTOR, Constants.detailPriceTableCss).find_elements(By.CSS_SELECTOR, 'tr')

    totalTdCount = 0
    for detailInfo in detailInfoList:
        tdCount = 0
        try:
            # detailInfo.find_element(By.CLASS_NAME, 'category').text
            tdList = detailInfo.find_elements(By.CSS_SELECTOR, 'td')
            for tdRecord in tdList:
                tdCount = tdCount + 1
                # print(str(tdCount))
            totalTdCount = copy.deepcopy(tdCount)
        except NoSuchElementException as ne:
            log_error(ne)
            pass
    if totalTdCount > 1:
        print_log(f'V1 tdCount is {str(totalTdCount)}')
        # detailInfoText = detailInfo.text
        v1Count = 0
        try:
            for detailInfo in detailInfoList:
                detailInfoText = detailInfo.text
                # print_log(f'detailInfoText: ${detailInfoText}')
                categoryInfoText = detailInfo.find_element(By.CLASS_NAME, 'category').text

                infoText = re.sub(categoryInfoText + ' ', '', detailInfoText)
                categoryInfoPrice = infoText.split(' ')[-1]

                categoryInfoPriceText = re.sub(r'[원,]', '', categoryInfoPrice)

                seatInfoList.insert(v1Count, categoryInfoText)
                priceInfoList.insert(v1Count, categoryInfoPriceText)

                # print_log(f'categoryInfoText: {categoryInfoText}')
                # print_log(f'categoryInfoPriceText: {categoryInfoPriceText}')

                v1Count = v1Count + 1
        except NoSuchElementException as ne:
            log_error(ne)
            pass

    elif totalTdCount == 1:
        print_log(f'V2 tdCount is {str(totalTdCount)}')
        v2Count = 0
        categoryDataList = []
        categoryIndex = []
        for detailInfo in detailInfoList:
            try:
                detailInfoText = detailInfo.text
                categoryInfoText = detailInfo.find_element(By.CLASS_NAME, 'category').text
                # categoryRecord = {'category': categoryInfoText, 'count': v2Count}
                categoryDataList.append(categoryInfoText)
                categoryIndex.append(v2Count + 1)
            except NoSuchElementException as ne:
                log_error(ne)
                pass
            v2Count = v2Count + 1
        # categoryIndex.sort(reverse=True)
        v2CountRetry = 0
        categoryIndexCount = 0
        # print_log(f'categoryIndex: + {str(categoryIndex)}')
        for detailInfo in detailInfoList:
            detailInfoText = detailInfo.text
            try:
                if v2CountRetry == categoryIndex[0]:
                    categoryInfoPrice = detailInfoText.split(' ')[-1]
                    categoryInfoPriceText = re.sub(r'[원,]', '', categoryInfoPrice)
                    seatInfoList.append(categoryDataList[0])
                    priceInfoList.append(categoryInfoPriceText)
                    del(categoryIndex[0])
                    del(categoryDataList[0])

                v2CountRetry = v2CountRetry + 1
                print_log(f'{str(v2CountRetry)}')
            except IndexError as ie:
                log_error(ie)
                continue




    # for categoryInfoRecord in categoryInfoList:
    #     categoryInfoTr = detailInfoList[categoryInfoRecord['index']]
    #     categoryInfoTr.get


    # try:
    #     # 카테고리 영역이 있다면 제외
    #     categoryInfo = detailInfo.find_element(By.CLASS_NAME, 'category').text
    #     detailInfoText = re.sub(categoryInfo + ' ', '', detailInfoText)
    # except NoSuchElementException:
    #     pass
    #
    # try:
    #     # 좌석/가격 정보 추출, 이때 좌석은 석, 가격은 원, ',' 제거
    #     print('detailInfoText: ' + detailInfoText)
    #     detailPriceInfo = detailInfoText.split(' ')[-1]
    #     detailSeatInfo = detailInfoText.replace(detailPriceInfo, '')
    #     if detailSeatInfo == '':
    #         continue
    #     print('detailSeatInfo: ' + str(detailSeatInfo))
    #     print('detailPriceInfo: ' + str(detailPriceInfo))
    #     # 추출한 정보는 리스트에 저장
    #     # seatInfoList.insert(count, re.sub(r'석$', '', detailSeatInfo))
    #     seatInfoList.insert(count, detailSeatInfo)
    #     priceInfoList.insert(count, re.sub(r'[원,]', '', detailPriceInfo))
    # except IndexError:
    #     pass
    #
    # count = count + 1

    # 상세 좌석/가격 정보 창 닫기
    # browser.find_element(By.CSS_SELECTOR, Constants.detailPricePopupCloseCss).click()
    element = browser.find_element(By.CSS_SELECTOR, Constants.detailPricePopupCloseCss)
    browser.execute_script("arguments[0].click();", element)

    time.sleep(1)