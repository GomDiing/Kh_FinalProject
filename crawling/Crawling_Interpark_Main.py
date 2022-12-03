import datetime
import re
import time
import traceback

from selenium import webdriver
from selenium.common import TimeoutException, NoSuchElementException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
import sqlalchemy
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import MetaData, Table, insert, select
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import IntegrityError
import Constants
import configparser
import Crawling_Interpark_data_ver2 as CI_V2


# 설정값 읽기
config = configparser.ConfigParser()
config.read('config.ini')

SQLALCHEMY_DB_URL = config['DEFAULT']['SQLALCHEMY_DB_URL']

# DB와 연결
engine = sqlalchemy.create_engine(SQLALCHEMY_DB_URL, echo=False)

# Session 생성
metadata_obj = MetaData(bind=engine)
SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()

Base = declarative_base()


def createEngine():
    Base.metadata.create_all(engine)
    print('테이블 생성 성공')


# Statement를 Commit하는 메서드
def commit_db(stmt):
    try:
        db.execute(stmt)
        db.commit()
    # 오류 발생하면 롤백하고 생략
    # 혹시 멈출때를 대비해서 계속 요청하도록 설정
    except IntegrityError as e:
        db.rollback()
        errorDict = extract_error_code(e)
        # 오류 코드가 1062이면 생략
        if errorDict['errorCode'] == 1062:
            pass
        pass
    # 오류 발생하면 생략
    except Exception as ex:
        pass
    # DB와의 연결 끊기
    finally:
        db.close()


# 에러 코드 추출하는 메서드
def extract_error_code(e):
    # 딕셔너리 생성
    errorDict = {}
    # Statement Error 정보 추출
    errorInfo = e.orig
    # 공백을 기준으로 나누고 앞의 숫자 추출
    errorCode = int(str(errorInfo).split(' ')[0])
    # 1062이면 영화 중복 에러
    if errorCode == 1062:
        errorMessage = 'PK 중복 에러 입니다'

    # 딕셔너리 타입으로 반환
    errorDict["errorCode"] = errorCode
    errorDict["errorMessage"] = errorMessage

    return errorDict


# 크롬 브라우저 옵션 설정 및 실행 메서드
def initChromBrowser():
    # <<< 크롬 옵션 설정 >>> #
    chromeOptions = webdriver.ChromeOptions()
    # chromeOptions.add_argument('--headless')
    chromeOptions.add_argument('--window-size=1280,720')
    chromeOptions.add_argument('--no-sandbox')

    # <<< 크롬 브라우저 실행 >>> #
    browser = webdriver.Chrome('./chromedriver', chrome_options=chromeOptions)

    return browser


# 경고 창 제거 메서드, 없다면 무시
def removeAlert(browser):
    try:
        browser.find_element(By.CSS_SELECTOR, Constants.removeAlertCss).click()
    except NoSuchElementException:
        pass


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


# 일반 정보 추출 > 장소 판단 / 추출 메서드
# 장소가 아니면 False, 맞다면 장소 정보를 반환 (단, (자세히)는 제외
def isPlaceInfo(inform):
    isPlace = inform.find_element(By.CLASS_NAME, 'infoLabel').text

    if isPlace == '장소':
        return re.sub('\(자세히\)', '', inform.find_element(By.CLASS_NAME, 'infoDesc').text)
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


# 일반 정보 추출 > 시간 판단/추출 메서드
# 시간이 아니면 False, 맞다면 시간 정보를 반환
def isTimeInfo(inform):
    timeInfo = inform.find_element(By.CLASS_NAME, 'infoLabel').text
    if timeInfo == '기간':
        return inform.find_element(By.CLASS_NAME, 'infoDesc').text
    else:
        return False


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


# 일반 정보 추출
def extractGeneralInfo(browser):
    # 아래 요소 추출
    # ******************** #
    # 장소
    # (한정 판매) 공연기간, 공연시간 / (상시 판매) 기간
    # 관람 연령
    # 가격

    # 일반 정보들이 위치한 요소 추출
    informList = browser.find_element(By.CSS_SELECTOR, Constants.generalInfoCss).find_elements(By.CLASS_NAME, 'infoItem')

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


# 공연정보 / 이용정보 탭 > 공연 상세 이미지 탐색 메서드
def extractNaviTabOfDetailAboutPoster(browser):
    # 이미지 상세 정보가 표시될 때 까지 대기
    WebDriverWait(browser, 5).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, Constants.contentImgDescCss)))

    # 상세 정보 이미지 링크
    contentImagePathList = browser.find_element(By.CSS_SELECTOR, Constants.contentImgDescCss).find_elements(
        By.CSS_SELECTOR, Constants.detailImgStrucV1Css)

    index = 0

    print('<-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*->')
    # 구조가 첫번째와 같은 경우 (이미지가 1 이상 존재할 경우)
    if len(contentImagePathList) != 0:
        # 상세 이미지 주소, 상세 캐스팅 이미지 주소 2개 추출
        for contentImagePath in contentImagePathList[:2]:
            index = index + 1
            print(str(index) + '번째 상세 정보 이미지 링크: ' + contentImagePath.get_attribute('src'))
    else:
        # 구조가 첫번째와 다를 경우 (이미지가 1 이상 존재하지 않은 경우)
        # 상세 이미지 주소, 상세 캐스팅 이미지 주소 2개 추출
        contentSingeImagePath = browser.find_element(By.CSS_SELECTOR, Constants.contentImgDescCss).find_element(
            By.CSS_SELECTOR, Constants.detailImgStrucV2Css)
        print('단독 상세 정보 이미지 링크: ' + contentSingeImagePath.get_attribute('src'))


# 공연정보 / 이용정보 탭 > 예매자 통계 탐색 메서드
def extractNaviTabOfDetailAboutStatics(browser):
    # 예매자 공통 경로
    statusInfo = browser.find_element(By.CSS_SELECTOR, Constants.commonStatisticsCss)
    # 예매자 > 성별 경로
    statOfGenderList = statusInfo.find_elements(By.CSS_SELECTOR, Constants.genderStatisticsCss)
    # 예매자 > 나이 경로
    statOfAgeList = statusInfo.find_elements(By.CSS_SELECTOR, Constants.ageStatisticsCss)

    # 예매자 > 성별 > 남성/여성 통계 조회
    for statOfGender in statOfGenderList:
        isGender = statOfGender.find_element(By.CLASS_NAME, 'statGenderName').text
        isValue = statOfGender.find_element(By.CLASS_NAME, 'statGenderValue').text
        if isGender == '남자':
            print('예매자 통계 > 남자 : ' + isValue)
        else:
            print('예매자 통계 > 여자 : ' + isValue)

    # 예매자 > 성별 > 나이대 별 통계 조회
    for statOfAge in statOfAgeList:
        ageName = re.sub('대', '', statOfAge.find_element(By.CLASS_NAME, 'statAgeName').text)
        agePercent = re.sub('%', '', statOfAge.find_element(By.CLASS_NAME, 'statAgePercent').text)
        print(ageName + '(대) 예약율 : ' + agePercent + '(% 단위)')


# 네비게이션 메뉴 탐색 > 캐스팅 탭 > 캐스팅 테이블 > 극 중 역 탐색 메서드
def addListOfTableAboutCharacter(rowList, actingCharacterList):
    # 헤더의 배역 정보가 있는 행(row)의 속성 값(column) 선택
    headerList = rowList.find_elements(By.CSS_SELECTOR, 'th')
    # 속성 값 중 앞에 두 행(관람일/시간) 을 제외한 배역 정보만 추출
    for count in range(2, len(headerList)):
        # 배역 캐릭터 추출
        actingCharacter = headerList[count].text
        print('*** ' + str(count - 1) + '번째 작중 역: ' + actingCharacter)
        # 작중 역 리스트에 배역 캐릭터 추가
        actingCharacterList.append(actingCharacter)

    return actingCharacterList


# 네비게이션 메뉴 탐색 > 캐스팅 탭 > 캐스팅 테이블 > 공연 시간, 배우 탐색 메서드
def addListOfTableAboutDateTimeActor(rowList, actingCharacterList):
    # 관람일과 시간, 그 외 배역 정보를 나누기 위한 인덱스
    index = 0
    # 해당 행(row)의 모든 속성 값(column) 선택
    recordList = rowList.find_elements(By.CSS_SELECTOR, 'td')
    print('=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=')
    for record in recordList:
        index = index + 1
        # 관람일 정보 추출
        if index == 1:
            # 관람일은 |월 / 일(요일)| 구성
            # 현재 시간을 서울 시간 기준으로 계산 (utc)
            now = datetime.datetime.utcnow() + datetime.timedelta(hours=9)

            # 월과 일(요일) 로 분리
            isYear = record.text.split('/')

            # 월 데이터 추출
            month = re.search(r'\d+', isYear[0]).group(0)
            # 일 데이터 추출
            day = re.search(r'\d+', isYear[1]).group(0)
            # 요일 데이터 추출
            dayOfWeek = re.search(r'\((.*?)\)', record.text).group(1)

            # 표시된 월 데이터가 현재 월 데이터보다 낮은 경우 다음 해 데이터로 인식
            if int(month) < now.month:
                year = now.year + 1
            else:
                year = now.year
            print(str(year) + '년 ' + month + '월 ' + day + '일 ' + dayOfWeek + '요일')

        # 상영시간 추출
        if index == 2:
            # 상연 시간은 |00:00| 구성
            openTime = record.text.split(':')
            print('상영 시간(시): ' + openTime[0])
            print('상영 시간(분): ' + openTime[1])
        # 배역 정보일 경우
        if index > 2:
            print(actingCharacterList[index - 3] + '역은 ' + record.text)


# 네비게이션 메뉴 탐색 > 캐스팅 탭 탐색 메서드
def extractNaviTabOfCasting(naviItem, browser):
    print('==**==**==**==**==**==**==**==**==**==')

    naviItem.find_element(By.CSS_SELECTOR, 'a').click()

    time.sleep(0.5)

    # 캐스팅 상세 테이블 정보가 표시될 때 까지 대기
    WebDriverWait(browser, 5).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, Constants.castingDetailTableCss)))

    # 캐스팅 테이블 경로
    castingDetailTable = browser.find_element(By.CSS_SELECTOR, Constants.castingDetailTableCss)

    # 캐스팅 테이블 > 모든 행(row) 선택
    elementList = castingDetailTable.find_elements(By.CSS_SELECTOR, 'tr')

    # 작 중 역 정보 담을 리스트
    actingCharacterList = []

    # 배역 정보가 몇 개가 있는지 확인하는 인덱스
    countRecordList = 0

    # 캐스팅 테이블 정보 추출
    # 캐스팅 테이블 > 모든 행(row)의 행 1개씩 순회
    for rowList in elementList:
        countRecordList = countRecordList + 1
        # 테이블 헤더 부분(첫줄)과 그 외 부분을 나누는 분기점
        # 테이블 헤더의 배역 정보만 추출
        if countRecordList == 1:
            actingCharacterList = addListOfTableAboutCharacter(rowList, actingCharacterList)

        # 헤더 배역 정보 제외한 정보 추출 (공연 시간, 배우 탐색 메서드)
        else:
            addListOfTableAboutDateTimeActor(rowList, actingCharacterList)


# 네비게이션 메뉴 탐색 > 정보 탭 일 경우 탐색 메서드
def extractNaviTabOfDetail(naviItem, browser):
    # 정보 탭 클릭
    naviItem.find_element(By.CSS_SELECTOR, 'a').click()

    # 정보 탭 내 캐스팅 정보 추출 메서드
    castingInfoTotalList = extractNaviTabOfDetailAboutCasting(browser)

    # 정보 탭 내 캐스팅 정보가 있을 경우
    if castingInfoTotalList is not False:
        for castingInfoList in castingInfoTotalList:
            index = 0
            print('*=&*=&*=&*=&*=&*=&*=&*=&*')
            for castingInfo in castingInfoList:
                if index == 0:
                    print('캐스팅 역: ' + castingInfo)
                if index == 1:
                    print('캐스팅 배우: ' + castingInfo)
                if index == 2:
                    print('캐스팅 상세 정보 링크: ' + castingInfo)
                if index == 3:
                    print('캐스팅 이미지 링크: ' + castingInfo)
                index = index + 1

    # 정보 탭 내 공연 상세 이미지 탐색 메서드
    extractNaviTabOfDetailAboutPoster(browser)

    # 정보 탭 내 예매자 통계
    extractNaviTabOfDetailAboutStatics(browser)


    time.sleep(1)


# 공연정보 / 이용정보 탭 > 캐스팅 정보 추출 메서드
# 캐스팅 정보가 있다면 전체 캐스팅 정보가 담긴 리스트 반환, 없다면 False 반환
def extractNaviTabOfDetailAboutCasting(browser):
    # 캐스팅 정보 리스트를 담을 전체 리스트
    castingInfoTotalList = []

    time.sleep(0.5)

    # 더보기 버튼 클릭, 없다면 생략
    try:
        browser.find_element(By.CSS_SELECTOR, Constants.clickMoreInfoOfCastingCss).click()
        time.sleep(1)
    except NoSuchElementException:
        pass

    # 캐스팅 정보 선택, 없다면 False
    try:
        # 캐스팅 정보 선택
        castingList = browser.find_element(By.CSS_SELECTOR, Constants.castingContentCss).find_elements(By.CSS_SELECTOR, Constants.castingListCss)

        # 캐스팅 정보를 리스트에 담고 해당 리스트를 통합 리스트에 담는다
        for casting in castingList:
            # 캐스팅 정보 담을 리스트
            castingInfoList = []

            # 캐스팅 정보 저장 메서드
            saveNaviTabOfDetailAboutCasting(castingInfoList, casting)

            # 저장된 캐스팅 정보를 캐스팅 정보 전체 리스트에 저장
            castingInfoTotalList.append(castingInfoList)

        return castingInfoTotalList

    except NoSuchElementException:
        return False


# 공연정보 / 이용정보 탭 > 캐스팅 정보 추출 > 캐스팅 정보 저장 메서드
def saveNaviTabOfDetailAboutCasting(castingInfoList, casting):
    # 캐스팅 역
    castingActor = casting.find_element(By.CSS_SELECTOR, Constants.castingActorCss).text
    castingInfoList.insert(0, castingActor)

    # 캐스팅 배우 이름
    castingName = casting.find_element(By.CSS_SELECTOR, Constants.castingNameCss).text
    castingInfoList.insert(1, castingName)

    # 캐스팅 상세 정보 링크
    castingInfoUrl = casting.find_element(By.CSS_SELECTOR, Constants.castingInfoUrlCss).get_attribute('href')
    castingInfoList.insert(2, castingInfoUrl)

    # 캐스팅 이미지 링크
    castingImgUrl = casting.find_element(By.CSS_SELECTOR, Constants.castingImgUrl).get_attribute('src')
    castingInfoList.insert(3, castingImgUrl)


# 네비게이션 메뉴 탐색 메서드
def extractNaviData(browser):
    # 네비게이션 메뉴 선택
    naviItemList = browser.find_element(By.CLASS_NAME, 'navList').find_elements(By.CSS_SELECTOR, 'li')

    # 정보 탭
    navLinkOfDetailList = ['공연정보', '이용정보']

    # 네비게이션 메뉴 순회
    for naviItem in naviItemList:

        # 현 네비 탭 이름이 정보 탭 리스트에 존재할 경우
        if navLinkOfDetailList.count(naviItem.text) != 0:
            extractNaviTabOfDetail(naviItem, browser)

        # 현 네비 탭 이름이 캐스팅 정보인 경우
        if naviItem.text == '캐스팅정보':
            # 캐스팅 테이블 정보 탐색 메서드
            extractNaviTabOfCasting(naviItem, browser)

            time.sleep(1)


def extractCalendarOfPossibleDays(browser):
    # 예약 가능한 날짜 조회 #
    # 메인화면 > 캘린더 : 날짜 태그 추출 (ul)
    # reserveDaysList = soup_page.find('ul', {'data-view': 'days'})
    reserveDaysList = browser.find_elements(By.CSS_SELECTOR, Constants.calendarDaysCss)

    # 예약 가능한 날짜 담을 List 선언
    possibleDaysList = []

    # muted 된 요소 세기
    mutedCount = 0

    # 날짜 리스트 중 예약 가능한 날짜 찾아서 List 배열에 넣기 #
    # <li> 태그를 순회하면서 disabled / muted 이면 제외, picked / 빈 문자열 이면 포함
    # 단, muted 이면 추가, 추후 예약 가능 날짜에 접근할 때 필요
    for reserveDays in reserveDaysList:
        # 해당 태그의 class 정보 추출
        isPossibleDay = reserveDays.get_attribute('class')
        # muted 이면 카운터 갱신
        if isPossibleDay == 'muted':
            mutedCount = mutedCount + 1
        # 빈 문자열 이면 예약 가능 날짜 리스트에 추가
        if isPossibleDay == '':
            possibleDaysList.append(reserveDays.text)
        # picked 이면 예약 가능 날짜 리스트에 추가
        if isPossibleDay == 'picked':
            possibleDaysList.append(reserveDays.text)

    return {'mutedCount': mutedCount, 'possibleDaysList': possibleDaysList}


# 캘린더 정보 탐색 > 예약 가능한 날짜에서 캐스팅 정보 탐색
def extractCalendarOfCasting(possibleDaysList, mutedCount, browser):
    # 예약 가능한 날짜 에서 캐스트 정보 조회 #
    for possibleDays in possibleDaysList:

        # 해당 날짜 조회
        print('현재 날짜: ' + str(possibleDays))

        # 현 예약 가능 날짜에 총 muted 숫자 추가
        possibleDaysMuted = int(possibleDays) + mutedCount

        # 메인화면 > 캘린더 > 예약 가능 날짜 경로
        possibleDaysCssPath = Constants.calendarPossibleCssFront + str(possibleDaysMuted) + ')'

        # 메인화면 > 캘린더 > 예약 가능 날짜 접근 클릭
        browser.find_element(By.CSS_SELECTOR, possibleDaysCssPath).click()

        time.sleep(0.5)

        # 주연 정보 접근
        # 메인화면 > 캘린더 > 예약 가능 날짜(클릭) > 공연 회차 : 총 공연가능 회차 조회
        try:
            turnTotalCount = browser.find_elements(By.CSS_SELECTOR, Constants.calendarPossibleTurnCss)

            print(possibleDays + '일의 총 회차 수: ' + str(len(turnTotalCount)))
            print('==========**********==========**********==========**********==========')

            # 각 공연 회차에 접근해 배우 정보 추출 #
            for count in range(1, len(turnTotalCount) + 1):
                # 메인화면 > 캘린더 > 예약 가능 날짜(클릭) > 총 공연 회차 클릭
                findTurn = browser.find_element(By.CSS_SELECTOR, Constants.calendarPossibleTurnOfDayCss + str(count) + ')')

                findTurn.click()

                time.sleep(0.2)

                # 현 공연 회차 배우 정보 출력
                try:
                    openTime = findTurn.find_element(By.CSS_SELECTOR, 'a > span').text.split(':')
                    print('현 회차: ' + str(count) + ', 시간(시): ' + openTime[0] + ', (분): ' + openTime[1])
                    print('배우 정보 :' + browser.find_element(By.CSS_SELECTOR, Constants.calendarPossibleActorCss).text)
                    print('------------------------------------------------------------')
                except NoSuchElementException:
                    pass

                time.sleep(0.2)
        except NoSuchElementException:
            pass


# 캘린더 정보 탐색 > 다음 달로 이동이 가능한지 판단하는 메서드
def isNextMonthMovePossible(browser):
    # 메인화면 > 캘린더 > 다음 달 이동 버튼 조회
    nextPageButton = browser.find_element(By.CSS_SELECTOR, Constants.calendarNextMonthButtonCss)

    # 다음 달 이동 버튼의 class 값이 disabled 인지 확인, group(1)로 판단 가능
    isNextMonthDisabled = nextPageButton.get_attribute('class')

    return {'nextPageButton': nextPageButton, 'isNextMonthDisabled': isNextMonthDisabled}


# 캘린더 정보 탐색 메서드
def extractCalendarData(browser):
    # 다음 달 이동이 불가능 할 때 까지 계속 조회
    while True:
        # 예약 가능 날짜 조회
        mutedAndPossibleDays = extractCalendarOfPossibleDays(browser)

        mutedCount = mutedAndPossibleDays['mutedCount']
        possibleDaysList = mutedAndPossibleDays['possibleDaysList']

        # 현재 캘린더의 날짜 정보 추출 (연/월)
        currentYearMonth = browser.find_element(By.CSS_SELECTOR, Constants.calendarYearMonthCss).text
        print('====================')
        print('현재 연월 : ' + currentYearMonth)
        print('====================')
        print("예약 가능한 날짜 리스트 : " + str(possibleDaysList))

        # 예약 가능한 날짜에서 캐스팅 정보 탐색
        extractCalendarOfCasting(possibleDaysList, mutedCount, browser)

        # 캘린더 다음 달로 이동 하는 메서드 #
        # 다음 달 이동 버튼의 class 값이 disabled 이면 종료, 그렇지 않으면 이동
        isNexMonthResult = isNextMonthMovePossible(browser)

        # 다음 달이 이동 버튼 class 값 추출
        isNextMonthDisabled = isNexMonthResult['isNextMonthDisabled']
        # 다음 달 이동이 가능한 요소 선택
        nextPageButton = isNexMonthResult['nextPageButton']

        # class 속성 값이 disabled 이면 종료
        if isNextMonthDisabled == 'disabled':
            browser.quit()
            break
        else:
            # 다음 달 이동 버튼이 disabled 이면 이동 클릭
            browser.execute_script('arguments[0].click();', nextPageButton)

        time.sleep(3)


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


# 주어진 요소가 발생할 때 까지 대기하는 메서드
def waitUntilElementLocated(browser, waitTime, byKey, byPath):
    # byList = ['css selector', 'class name', 'id', 'tag name', 'xpath', 'name', 'link text', 'partial link text']
    if not isinstance(waitTime, int):
        print('time이 올바른 값이 아닙니다')
    if not isinstance(byKey, str):
        print('byKey가 올바른 값이 아닙니다')
        return
    if not isinstance(byPath, str):
        print('byPath가 올바른 값이 아닙니다')
        return
    else:
        # 해당 태그가 나타날 때 까지 대기
        try:
            WebDriverWait(browser, 10).until(EC.presence_of_element_located((byKey, byPath)))
        except TimeoutException as te:
            print('Error!!! TimeOutException!!!')
            print('byKey: ' + byKey)
            print('byPath: ' + byPath)
            browser.quit()
            # break
            return
        except Exception as e:
            print('Error!!! Exception!!!')
            print('byKey: ' + byKey)
            print('byPath: ' + byPath)
            traceback.print_exc()
            browser.quit()
            # break
            return
    return


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

    # 일반 정보 추출
    extractGeneralInfo(browser)

    # 네비게이션 메뉴 탐색
    extractNaviData(browser)

    # 캘린더 정보 탐색
    if limitedOrAlways == 'limited':
        extractCalendarData(browser)


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
    urlList = CI_V2.createUrlOfInterpark()
    # createEngine()

    # crawlingRankingUrlList()

    # crawlingRankingUrlList()

    # crawlingMainBanner()

    for url in urlList:
        # CI_V2.crawlingInterparkBasicInfo(url)
        # CI_V2.crawlingInterparkNavi(url)
        # CI_V2.crawlingInterparkCalendar(url)
        crawlingInterparkPage(url)
