import re
import time

from crawling import Constants
from selenium.webdriver.common.by import By
from selenium.common import TimeoutException, NoSuchElementException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from crawling.Common import waitUntilElementLocated


# 일반 정보 추출
def extractGeneralInfo(browser):
    # 아래 요소 추출
    # ******************** #
    # 장소
    # (한정 판매) 공연기간, 공연시간 / (상시 판매) 기간
    # 관람 연령
    # 가격

    # 일반 정보들이 위치한 요소 추출
    informList = browser.find_element(By.CSS_SELECTOR, Constants.generalInfoCss).find_elements(By.CLASS_NAME,
                                                                                               'infoItem')

    for inform in informList:
        attribute = inform.get_attribute('class')

        # 장소, 공연기간/기간, 공연시간, 관람연령 출력
        if attribute == 'infoItem':

            # 장소와 상제 장소 판단/추출, (자세히)는 제외
            placeInfo = isPlaceInfo(inform)
            if placeInfo is not False:
                print('==========')
                print('장소: ' + placeInfo)
                detailPlaceInfo = extractDetailPlace(inform, browser)
                if detailPlaceInfo is not False:
                    print('상세 장소: ' + detailPlaceInfo)

            # 공연기간/기간 판단/추출
            periodName = inform.find_element(By.CLASS_NAME, 'infoLabel').text
            perfPeriodInfo = isPerfPeriodInfo(periodName, inform)
            if perfPeriodInfo is not False:
                print('==========')
                if isinstance(perfPeriodInfo, str):
                    # print('공연기간: ' + perfPeriodInfo)
                    print(periodName + ": " + perfPeriodInfo)
                else:
                    # print('(시작) 공연기간: ' + perfPeriodInfo['start'])
                    print('(시작) ' + periodName + ': ' + perfPeriodInfo['start'])
                    # print('(끝) 공연기간: ' + perfPeriodInfo['end'])
                    print('(종료) ' + periodName + ': ' + perfPeriodInfo['end'])

            # 공연시간 판단/추출
            perfTimeInfo = isPerfTimeInfo(inform)
            if perfTimeInfo is not False:
                print('==========')
                if isinstance(perfTimeInfo, str):
                    print('공연시간: ' + perfTimeInfo)
                else:
                    print('공연시간: ' + perfTimeInfo['perform'])
                    print('인터미션: ' + perfTimeInfo['break'])

            # 관람연령 출력
            ageInfo = isAgeInfo(inform)
            if ageInfo is not False:
                print('==========')
                # 나이 분류
                if ageInfo == '한국':
                    print('한국식 나이: ' + ageInfo)
                elif ageInfo == '만':
                    print('만 나이: ' + ageInfo)
                elif ageInfo == '성인':
                    print('성인: ' + ageInfo)
                elif ageInfo == '전체':
                    print('전체: ' + ageInfo)
                else:
                    raise Exception('관람연령 에러 발생')

        # 가격 요소 출력
        if attribute == 'infoItem infoPrice':
            extractPriceInfo(inform, browser)


# 일반 정보 추출 > 장소 판단 / 추출 메서드
# 장소가 아니면 False, 맞다면 장소 정보를 반환 (단, (자세히)는 제외
def isPlaceInfo(inform):
    isPlace = inform.find_element(By.CLASS_NAME, 'infoLabel').text

    if isPlace == '장소':
        return re.sub('\(자세히\)', '', inform.find_element(By.CLASS_NAME, 'infoDesc').text)
    else:
        return False


# 일반 정보 추출 > 상세 장소 탐색 메서드
def extractDetailPlace(inform, browser):
    # 상세 장소 팝업 창 열기
    inform.find_element(By.CSS_SELECTOR, 'div > a').click()

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
    browser.find_element(By.CSS_SELECTOR, Constants.detailPlacePopupCloseCss).click()

    time.sleep(0.5)

    # 상세 장소 값이 비어 있으면 False, 그렇지 않으면 추출한 상세 장소 추출
    if findDetailPlace != '':
        return findDetailPlace
    else:
        return False


# 일반 정보 추출 > 공연 기간/기간 판단 / 추출 메서드
# 공연 기간이 아니면 False, 맞다면 공연 기간 정보를 반환
def isPerfPeriodInfo(isPeriod, inform):
    isPeriodList = ["공연기간", "기간"]

    # isPeriod = inform.find_element(By.CLASS_NAME, 'infoLabel').text
    if isPeriodList.count(isPeriod) != 0:
        periodInfo = inform.find_element(By.CLASS_NAME, 'infoDesc').text
        # 공연 기간이 나뉘어 있는지 판단 / 추출
        isPeriodSplit = isPeriodInfoSplit(periodInfo)
        # 나뉘어 있지 않다면 str 타입 출력
        if isPeriodSplit is False:
            return periodInfo
        # 공연 정보가 나뉘어 있다면 dict 타입 {'start': *, 'end': *} 로 출력
        else:
            return isPeriodSplit
    else:
        return False


# 일반 정보 추출 > 공연 기간 판단/추출 > 공연 기간 시작/끝 판단 메서드
# 공연 기간이 나뉘어 있지 않다면 False
# 나뉘어 있다면 나눠서 시작(start)와 끝(end)를 딕셔너리로 반환
def isPeriodInfoSplit(periodInfo):
    isTerm = periodInfo.find(' ~')
    if isTerm == -1:
        return False
    else:
        return {'start': periodInfo.split(' ~')[0], 'end': periodInfo.split(' ~')[1]}


# 일반 정보 추출 > 공연 시간 판단/추출 메서드
# 공연 시간이 아니면 False, 맞다면 공연 시간 정보를 반환
def isPerfTimeInfo(inform):
    isTime = inform.find_element(By.CLASS_NAME, 'infoLabel').text
    if isTime == '공연시간':
        timeInfo = inform.find_element(By.CLASS_NAME, 'infoDesc').text
        # 휴식 시간 포함되어 있는지 판단 / 추출
        isIncludeBreak = isPerfTimeInfoIncludeBreak(timeInfo)
        # 포함되어 있지 않다면 str 타입 출력
        if isIncludeBreak is False:
            return timeInfo
        # 휴식 시간이 포함되어 있다면 dict 타입 {'perform': *, 'break': *} 로 출력
        else:
            return isIncludeBreak
    else:
        return False


# 일반 정보 추출 > 공연 시간 판단/추출 > 휴식 정보 판단/추출 메서드
# 인터미션이 포함되어 있지 않다면 False
# 포함되어 있다면 공연시간(perform)와 휴식시간(break)를 딕셔너리로 반환
def isPerfTimeInfoIncludeBreak(timeInfo):
    isBreak = timeInfo.find('인터미션')
    if isBreak == -1:
        return False
    else:
        timeInfoSplit = re.findall(r'[0-9]+분', timeInfo)
        return {'perform': timeInfoSplit[0], 'break': timeInfoSplit[1]}


# 일반 정보 추출 > 관람 연령 판단/추출 메서드
# 관람 연령이 아니면 False, 맞다면 관람 연령 정보를 반환
def isAgeInfo(inform):
    # 관람연령 출력
    isAge = inform.find_element(By.CLASS_NAME, 'infoLabel').text
    if isAge == '관람연령':
        isAgeDetail = isAgeDetailInfo(inform.find_element(By.CLASS_NAME, 'infoDesc').text)
        # 상세 관람 연령 판단/추출 메서드
        # 전체 관람가 이면 str 타입 전체 / 만 or 한국 나이면 dict 타입 {'type': *, 'age': '*'} 반환
        return isAgeDetail
    else:
        return False


# 일반 정보 추출 > 관람 연령 판단/추출 > 상세 관람 연령 판단/추출 메서드
# 전체 관람가 / 만 or 한국 나이 판단/추출 메서드
def isAgeDetailInfo(ageInfo):
    # 전체 관람가 아니면
    if ageInfo.find('전체') == -1:
        # 만 / 한국식 나이일 경우 dict 타입 {'type': *, 'age': *} 로 출력
        ageInfoSearch = re.search(r'\d+세|미취학아동입장불가', ageInfo).group(0)
        # 한국식 나이면 type = 한국학
        if ageInfoSearch == '미취학아동입장불가':
            return {'type': '성인', 'age': ageInfoSearch}
        if ageInfoSearch == '전체관람가':
            return {'type': '전체', 'age': ageInfoSearch}
        if re.match(r'만', ageInfo) is None:
            return {'type': '한국', 'age': ageInfoSearch}
        # 만 나이면 type = 만
        else:
            return {'type': '만', 'age': ageInfoSearch}
    # 전체 관람가 이면 '전체' 반환
    else:
        return '전체'


# 가격 정보 출력 메서드
def extractPriceInfo(inform, browser):
    infoPriceItemList = inform.find_elements(By.CSS_SELECTOR, Constants.priceItemListCss)
    # 가격 요소 인덱스 확인용
    # index = 0
    # 좌석이 모두 동일할 경우
    seatInfoList = []
    priceInfoList = []

    # 가격 요소 리스트에 담기, 전체 가격 보기 요소 제외
    # for infoPriceItem in infoPriceItemList[1:]:
    isPriceInfoValidFirst = addListOfPriceInfoV1(seatInfoList, priceInfoList, infoPriceItemList)
    if isPriceInfoValidFirst is False:
        addListOfPriceInfoV2(seatInfoList, priceInfoList, infoPriceItemList)
        # index = index + 1

    # 좌석 정보에 중복이 있는지 확인
    # 없다면 생략, 있다면 상세 정보 표기
    if len(seatInfoList) == len(set(seatInfoList)):
        # pass
        print('==========')
        for count in range(0, len(seatInfoList)):
            print(str(count + 1) + '번 좌석 정보 ' + seatInfoList[count])
            print(str(count + 1) + '번 가격 정보 ' + priceInfoList[count])
    else:
        # 상세 좌석/가격 정보 출력 메서드
        addListOfDetailPriceInfo(seatInfoList, priceInfoList, browser)
        print('==========')
        for count in range(0, len(seatInfoList)):
            print('*** 상세: ' + str(count + 1) + '번 좌석 정보 ' + seatInfoList[count])
            print('*** 상세: ' + str(count + 1) + '번 가격 정보 ' + priceInfoList[count])


# 일반 정보 추출 > 좌석/가격 정보 출력 > 좌석/가격 정보 리스트 추가 메서드 V1
# 좌석, 가격 정보를 순서에 맞게 리스트에 저장하는 메서드 호출, 다른 구조로 정렬 되었다면 False 반환
def addListOfPriceInfoV1(seatInfoList, priceInfoList, infoPriceItemList):
    seatInfoList.clear()
    priceInfoList.clear()
    try:
        index = 0
        for infoPriceItem in infoPriceItemList[1:]:
            # span 태그로 정렬 되었을 때 좌석, 가격 요소 추출
            savePriceInfoToListV1(index, seatInfoList, priceInfoList, infoPriceItem)
            index = index + 1
        # 다른 구조로 요소가 정렬 되었을 때
    except NoSuchElementException:
        return False
    return True


# 일반 정보 추출 > 좌석/가격 정보 출력 > 좌석/가격 정보 리스트 추가 메서드 V1 > 좌석/가격 정보 리스트 저장 메서드 V1
# span 태그로 정렬 되었을 때 좌석, 가격 요소 추출 후 리스트에 저장
def savePriceInfoToListV1(index, seatInfoList, priceInfoList, infoPriceItem):
    seatInfo = infoPriceItem.find_element(By.CSS_SELECTOR, 'span.name').text
    priceInfo = infoPriceItem.find_element(By.CSS_SELECTOR, 'span.price').text
    # 예) VIP석, OP석 등 일때 마지막 '석' 제외하고 좌석 정보 리스트에 저장
    seatInfoList.insert(index, re.sub(r'석$', '', seatInfo))
    # 예) 10,000원, 8,000원 일때 원, 쉼표(,) 제외하고 가격 정보 리스트에 저장
    priceInfoList.insert(index, re.sub('[원,]', '', priceInfo))


# 일반 정보 추출 > 좌석/가격 정보 출력 > 좌석/가격 정보 리스트 추가 메서드 V2
# 좌석, 가격 정보를 순서에 맞게 리스트에 저장하는 메서드 호출, 다른 구조로 정렬 되었다면 False 반환
def addListOfPriceInfoV2(seatInfoList, priceInfoList, infoPriceItemList):
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
    except NoSuchElementException:
        return False
    return True


# 일반 정보 추출 > 좌석/가격 정보 출력 > 좌석/가격 정보 리스트 추가 메서드 V1 > 좌석/가격 정보 리스트 저장 메서드 V1
# li 태그로 정렬 되었을 때 좌석, 가격 요소 추출 후 리스트에 저장
def savePriceInfoToListV2(index, seatInfoList, priceInfoList, prdPriceDetail):
    # 예) VIP석, OP석 등 일때 마지막 '석' 제외하고 좌석 정보 리스트에 저장
    seatInfo = re.search(r'(.*?)석', prdPriceDetail.text).group(1)
    seatInfoList.insert(index, seatInfo)
    priceInfoSpace = re.sub(seatInfo, '', prdPriceDetail.text)
    # 예) 10,000원, 8,000원 일때 원, 쉼표(,) 제외하고 가격 정보 리스트에 저장
    priceInfoList.insert(index, re.sub(r'석|\s+|원', '', priceInfoSpace))


# 일반 정보 추출 > 좌석/가격 정보 출력 > 상세 좌석/가격 정보 출력 메서드
def addListOfDetailPriceInfo(seatInfoList, priceInfoList, browser):
    seatInfoList.clear()
    priceInfoList.clear()

    # 상세 좌석/가격 정보 창 열기
    browser.find_element(By.CSS_SELECTOR, Constants.detailPrciePopupOpenCss).click()

    # 해당 팝업 창 나올 때 까지 대기, 없다면 에러
    waitUntilElementLocated(browser, 10, By.CSS_SELECTOR, Constants.detailPriceTableCss)

    # 상세 좌석/가격 정보 선택
    detailInfoList = browser.find_element(By.CSS_SELECTOR, Constants.detailPriceTableCss).find_elements(By.CSS_SELECTOR, 'tr')

    count = 0
    for detailInfo in detailInfoList:
        detailInfoText = detailInfo.text
        try:
            # 카테고리 영역이 있다면 제외
            categoryInfo = detailInfo.find_element(By.CLASS_NAME, 'category').text
            detailInfoText = re.sub(categoryInfo + ' ', '', detailInfoText)
        except NoSuchElementException:
            pass

        # 좌석/가격 정보 추출, 이때 좌석은 석, 가격은 원, ',' 제거
        detailSeatInfo = detailInfoText.split(' ')[0]
        detailPriceInfo = detailInfoText.split(' ')[1]
        # 추출한 정보는 리스트에 저장
        seatInfoList.insert(count, re.sub(r'석$', '', detailSeatInfo))
        priceInfoList.insert(count, re.sub(r'[원,]', '', detailPriceInfo))

        count = count + 1

    # 상세 좌석/가격 정보 창 닫기
    browser.find_element(By.CSS_SELECTOR, Constants.detailPricePopupCloseCss).click()

    time.sleep(1)