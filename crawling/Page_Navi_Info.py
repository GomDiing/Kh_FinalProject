import time
from datetime import timezone

from selenium.webdriver.chrome.webdriver import WebDriver
from selenium.webdriver.remote.webelement import WebElement

import Constants_Selector
import datetime
import re

from selenium.webdriver.common.by import By
from selenium.common import TimeoutException, NoSuchElementException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from Common import log_error, print_log
from DataClass import ProductInfo, NaviTab, CastingInfo, StatisticsInfo, DetailCastingTimeInfo, DetailCastingActingInfo, \
    DetailCastingCharOnlyInfo


# 네비게이션 메뉴 탐색 메서드
def extractNaviInfo(browser: WebDriver, product_info: ProductInfo) -> None:
    print_log('네비게이션 메뉴 탐색')
    # 네비게이션 메뉴 선택
    naviItemList = browser.find_element(By.CLASS_NAME, 'navList').find_elements(By.CSS_SELECTOR, 'li')

    # 네비게이션 메뉴 순회
    for naviItem in naviItemList:
        print_log(f'네비게이션 메뉴 순회: {naviItem.text}')

        # 정보 탭
        naviTabInfoList = [NaviTab.INFO.value, NaviTab.INFO_V2.value]
        # 현 네비 탭 이름이 정보 탭 리스트에 존재할 경우
        if naviItem.text in naviTabInfoList:
            extractNaviTabOfDetail(naviItem, browser, product_info)

        # 현 네비 탭 이름이 캐스팅 정보인 경우
        if naviItem.text == NaviTab.CASTING.value:
            print_log(f'네비게이션 메뉴 순회: {naviItem.text}')
            extractNaviTabOfCasting(naviItem, browser, product_info)

    time.sleep(1)


# 공연정보 / 이용정보 탭 > 공연 상세 이미지 탐색 메서드
def test_extractNaviTabOfDetailAboutPoster(browser: WebDriver, product_info: ProductInfo) -> None:
    print_log(f'네비게이션 메뉴 탐색 > 정보 탭 탐색 -> 공연 상세 이미지 탐색')

    try:
        # 이미지 상세 정보가 표시될 때 까지 대기
        WebDriverWait(browser, 5).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".content.description")))
    except TimeoutException as te:
        product_info.desc_poster_url = 'null'
        product_info.casting_poster_url = None
        log_error(te)
        return

    # 상세 정보 이미지 링크
    time.sleep(1)
    contentImagePathList = browser.find_elements(By.CSS_SELECTOR, "#productMainBody > div > div > div.content.description > div.contentDetail > p")

    img_sources = []

    for content in contentImagePathList:
        try:
            img_tag = content.find_element(By.TAG_NAME, "img")
            img_src = img_tag.get_attribute("src")
            img_sources.append(img_src)
        except Exception as e:
            log_error(e)
    for img_url in img_sources:
        print_log(f"상세 이미지 : {img_url}")
    if len(img_sources) >= 2:
        print_log(f"상세 이미지 2개 이상 존재")
        product_info.casting_poster_url = img_sources[len(img_sources)-1]
        product_info.desc_poster_url = img_sources[len(img_sources)-2]
    if len(img_sources) == 1:
        print_log(f"상세 이미지 1개 존재")
        product_info.desc_poster_url = img_sources[len(img_sources) - 1]
    if not len(img_sources):
        print_log(f"상세 이미지 존재 하지 않음")


# 공연정보 / 이용정보 탭 > 공연 상세 이미지 탐색 메서드
def extractNaviTabOfDetailAboutPoster(browser, productDataList):
    # $$$ 상세 정보 포스터 및 캐스팅 정보 포스터 URL 데이터 리스트 초기화
    print('접근: extractNaviTabOfDetailAboutPoster')
    productDataList['product_detail_poster_url'] = None
    productDataList['product_casting_poster_url'] = None

    try:
        # 이미지 상세 정보가 표시될 때 까지 대기
        WebDriverWait(browser, 5).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, Constants_Selector.contentImgDescCss)))
    except TimeoutException:
        productDataList['product_detail_poster_url'] = 'null'
        productDataList['product_casting_poster_url'] = None
        print('공연 상세 이미지 탐색 실패')
        return

    # 상세 정보 이미지 링크
    contentImagePathList = (browser.find_element(By.CSS_SELECTOR, Constants_Selector.contentImgDescCss)
                            .find_elements(By.CSS_SELECTOR, Constants_Selector.detailImgStrucV1Css))

    index = 0

    print('<-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*->')
    # 이미지 파싱 시작
    # 단, 이미지가 존재하지 않으면 다른 경로로 파싱
    if len(contentImagePathList) != 0:
        # 상세 이미지 주소, 상세 캐스팅 이미지 주소 2개 추출
        for contentImagePath in contentImagePathList[:2]:
            index = index + 1
            # $$$ 상세 정보 포스터 및 캐스팅 정보 포스터 URL 데이터 리스트 추가
            if index == 1:
                productDataList['product_detail_poster_url'] = contentImagePath.get_attribute('src')
            if index == 2:
                productDataList['product_casting_poster_url'] = contentImagePath.get_attribute('src')
            print(str(index) + '번째 상세 정보 이미지 링크: ' + contentImagePath.get_attribute('src'))
    else:
        try:
            # 구조가 첫번째와 다를 경우 (이미지가 1 이상 존재하지 않은 경우)
            # 상세 이미지 주소, 상세 캐스팅 이미지 주소 2개 추출
            contentSingeImagePath = browser.find_element(By.CSS_SELECTOR, Constants_Selector.contentImgDescCss).find_element(
                By.CSS_SELECTOR, Constants_Selector.detailImgStrucV2Css)
            # $$$ 상세 정보 포스터 URL 데이터 리스트 추가
            productDataList['product_detail_poster_url'] = contentSingeImagePath.get_attribute('src')
            productDataList['product_casting_poster_url'] = None
            print('단독 상세 정보 이미지 링크: ' + contentSingeImagePath.get_attribute('src'))
        except NoSuchElementException:
            try:
                contentSingeImagePath = browser.find_element(By.CSS_SELECTOR, Constants_Selector.contentImgDescCss).find_element(
                    By.CSS_SELECTOR, Constants_Selector.detailImgStrucV3Css)
                # $$$ 상세 정보 포스터 URL 데이터 리스트 추가
                productDataList['product_detail_poster_url'] = contentSingeImagePath.get_attribute('src')
                productDataList['product_casting_poster_url'] = None
                print('단독 상세 정보 이미지 링크: ' + contentSingeImagePath.get_attribute('src'))
            except NoSuchElementException:
                productDataList['product_detail_poster_url'] = 'null'
                productDataList['product_casting_poster_url'] = None
                print('$$$$$ 단독 상세 정보 이미지 링크가 존재하지 않습니다 $$$$$')


# 네비게이션 메뉴 탐색 > 정보 탭 일 경우 탐색 메서드
def extractNaviTabOfDetail(naviItem, browser: WebDriver, product_info: ProductInfo):
    print_log(f'네비게이션 메뉴 탐색 > 정보 탭 탐색')
    # 정보 탭 클릭
    element = browser.find_element(By.CSS_SELECTOR, 'a')
    browser.execute_script("arguments[0].click();", element)

    # 정보 탭 내 캐스팅 정보 추출 메서드
    extractNaviTabOfDetailAboutCasting(browser, product_info)

    # 정보 탭 내 공연 상세 이미지 탐색 메서드
    test_extractNaviTabOfDetailAboutPoster(browser, product_info)

    # 정보 탭 내 예매자 통계
    extractNaviTabOfDetailAboutStatics(browser, product_info)

    time.sleep(1)


# 공연정보 / 이용정보 탭 > 캐스팅 정보 추출 메서드
# 캐스팅 정보가 있다면 전체 캐스팅 정보가 담긴 리스트 반환, 없다면 False 반환
def extractNaviTabOfDetailAboutCasting(browser: WebDriver, product_info: ProductInfo) -> None:
    print_log(f'네비게이션 메뉴 탐색 > 정보 탭 탐색 -> 캐스팅 정보')

    time.sleep(0.5)

    # 더보기 버튼 클릭, 없다면 생략
    try:
        browser.execute_script("arguments[0].click();", browser.find_element(By.CSS_SELECTOR, Constants_Selector.clickMoreInfoOfCastingCss))
        time.sleep(1)
    except NoSuchElementException as ne:
        log_error(ne)
        pass

    # 캐스팅 정보 선택, 없다면 False
    try:
        # 캐스팅 정보 확인 유무
        browser.find_element(By.CSS_SELECTOR, Constants_Selector.existCastingContentCss)

        # 캐스팅 정보 선택
        castingList = browser.find_elements(By.CSS_SELECTOR, Constants_Selector.castingListCss)

        # 캐스팅 정보를 리스트에 담고 해당 리스트를 통합 리스트에 담는다
        for casting in castingList:
            # 캐스팅 정보 저장 메서드
            saveNaviTabOfDetailAboutCasting(casting, product_info)

    except NoSuchElementException as nsee:
        log_error(nsee)


# 공연정보 / 이용정보 탭 > 캐스팅 정보 추출 > 캐스팅 정보 저장 메서드
def saveNaviTabOfDetailAboutCasting(casting: WebElement, product_info: ProductInfo):
    # 캐스팅 역
    casting_info = CastingInfo()
    castingCharacter = casting.find_element(By.CSS_SELECTOR, Constants_Selector.castingActorCss).text
    casting_info.character = castingCharacter

    # 캐스팅 배우 이름
    castingActor = casting.find_element(By.CSS_SELECTOR, Constants_Selector.castingNameCss).text
    casting_info.actor = castingActor

    # 캐스팅 상세 정보 링크
    castingInfoUrl = casting.find_element(By.CSS_SELECTOR, Constants_Selector.castingInfoUrlCss).get_attribute('href')
    casting_info.info_url = castingInfoUrl

    # 캐스팅 이미지 링크
    castingImgUrl = casting.find_element(By.CSS_SELECTOR, Constants_Selector.castingImgUrl).get_attribute('src')
    casting_info.img_url = castingImgUrl

    print_log(f"네비게이션 메뉴 탐색 > 정보 탭 탐색 -> 캐스팅 정보 > 캐스팅 정보 저장\t"
              f"casting_actor: {casting_info.character}\t"
              f"casting_name: {casting_info.actor}\t"
              f"casting_url: {casting_info.info_url}"
              f"casting_img_url: {casting_info.img_url}")
    product_info.casting_info_list.append(casting_info)


# 네비게이션 메뉴 탐색 > 캐스팅 탭 탐색 메서드
def extractNaviTabOfCasting(naviItem, browser: WebDriver, product_info: ProductInfo) -> None:
    print_log(f'네비게이션 메뉴 탐색 > 정보 탭 탐색 -> 캐스팅 탭')
    try:
        element = browser.find_element(By.CSS_SELECTOR, 'a.navLink[data-target="CASTING"]')
        browser.execute_script("arguments[0].click();", element)

        time.sleep(0.5)
        # 캐스팅 상세 테이블 정보가 표시될 때 까지 대기
        WebDriverWait(browser, 5).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, Constants_Selector.castingDetailTableCss)))
    except TimeoutException as te:
        log_error(te)

    # 캐스팅 테이블 경로
    castingDetailTable = browser.find_element(By.CSS_SELECTOR, Constants_Selector.castingDetailTableCss)

    # 캐스팅 테이블 > 모든 행(row) 선택
    elementList = castingDetailTable.find_elements(By.CSS_SELECTOR, 'tr')

    # 배역 정보가 몇 개가 있는지 확인하는 인덱스
    countRecordIndex = 0

    # 캐스팅 테이블 정보 추출
    # 캐스팅 테이블 > 모든 행(row)의 행 1개씩 순회
    print_log('네비게이션 메뉴 탐색 > 정보 탭 탐색 -> 캐스팅 탭 -> 캐스팅 테이블 > 모든 행(row)의 행 1개씩 순회')
    for rowList in elementList:
        countRecordIndex = countRecordIndex + 1
        # 테이블 헤더 부분(첫줄)과 그 외 부분을 나누는 분기점
        # 테이블 헤더의 배역 정보만 추출
        if countRecordIndex == 1:
            addListOfTableAboutCharacter(rowList, product_info)

        # 헤더 배역 정보 제외한 정보 추출 (공연 시간, 배우 탐색 메서드)
        else:
            addListOfTableAboutDateTimeActor(rowList, product_info)


# 네비게이션 메뉴 탐색 > 캐스팅 탭 > 캐스팅 테이블 > 극 중 역 탐색 메서드
def addListOfTableAboutCharacter(rowList: WebElement, product_info:ProductInfo):
    print_log(f'네비게이션 메뉴 탐색 > 정보 탭 탐색 -> 캐스팅 테이블 -> 극 중 역 탐색 (헤더 정보만)')
    # 헤더의 배역 정보가 있는 행(row)의 속성 값(column) 선택
    headerList = rowList.find_elements(By.CSS_SELECTOR, 'th')
    # 속성 값 중 앞에 두 행(관람일/시간) 을 제외한 배역 정보만 추출
    index = 0
    for count in range(2, len(headerList)):
        detail_casting_char_only_info = DetailCastingCharOnlyInfo()
        # 배역 캐릭터 추출
        actingCharacter = headerList[count].text
        print_log(f"{str(count - 1)}번째 작중 역: {actingCharacter}")
        # 작중 역 리스트에 배역 캐릭터 추가
        detail_casting_char_only_info.character = actingCharacter
        product_info.detail_casting_char_only_info_list.insert(index, detail_casting_char_only_info)
        print_log(f"index: {index}, product_info.detail_casting_char_only_info_list: {product_info.detail_casting_char_only_info_list}")
        index = index + 1


# 네비게이션 메뉴 탐색 > 캐스팅 탭 > 캐스팅 테이블 > 공연 시간, 배우 탐색 메서드
def addListOfTableAboutDateTimeActor(rowList: WebElement, product_info: ProductInfo) -> None:
    print_log(f'네비게이션 메뉴 탐색 > 정보 탭 탐색 -> 캐스팅 테이블 -> 공연 시간, 배우 탐색 (헤더 제외)')
    # 관람일과 시간, 그 외 배역 정보를 나누기 위한 인덱스
    index = 0
    # 해당 행(row)의 모든 속성 값(column) 선택
    recordList = rowList.find_elements(By.CSS_SELECTOR, 'td')


    detail_casting_time_info = DetailCastingTimeInfo()
    for record in recordList:
        index = index + 1
        # 관람일 정보 추출
        detail_casting_acting_info = DetailCastingActingInfo()
        if index == 1:
            print_log('관람날짜')
            # 관람일은 |월 / 일(요일)| 구성
            # 현재 시간을 서울 시간 기준으로 계산 (utc)
            # now = datetime.datetime.utcnow() + datetime.timedelta(hours=9)
            KST = timezone(datetime.timedelta(hours=8))
            now = datetime.datetime.now(KST)

            # 월과 일(요일) 로 분리
            isYear = record.text.split('/')

            # 월 데이터 추출
            month = re.search(r'\d+', isYear[0]).group(0)
            # reserveTimeDataRecord['reserve_time_month'] = str(month)
            detail_casting_time_info.month = str(month)

            # 일 데이터 추출
            day = re.search(r'\d+', isYear[1]).group(0)
            detail_casting_time_info.day = str(day)
            # 요일 데이터 추출
            dayOfWeek = re.search(r'\((.*?)\)', record.text).group(1)

            # 표시된 월 데이터가 현재 월 데이터보다 낮은 경우 다음 해 데이터로 인식
            if int(month) < now.month:
                year = now.year + 1
                detail_casting_time_info.year = str(year)
            else:
                year = now.year
                detail_casting_time_info.year = str(year)
            print_log(f"{year}년 {month}월 {day}일 {dayOfWeek}요일")

            # 연도/월/일 계산
            timeDate = detail_casting_time_info.year + '/' + detail_casting_time_info.month + '/' + detail_casting_time_info.day

            detail_casting_time_info.date = timeDate

            # 해당 회차 정보 리스트에 추가
            turn = 1
            for time_info in product_info.detail_casting_time_info_list:
                if time_info.date == detail_casting_time_info.date:
                    turn = turn + 1

            # 회차 계산, 리스트 내 중복 개수 계산
            # 중복개수 + 1 하여 회차 계산
            detail_casting_time_info.turn = turn
            print_log(f"연도/월/일 : {detail_casting_time_info.date}")
            print_log(f"회차 : {detail_casting_time_info.turn}")

        # 상영시간 추출
        if index == 2:
            print_log('상연시간')
            # 상연 시간은 |00:00| 구성
            openTime = record.text.split(':')
            detail_casting_time_info.hour = int(openTime[0])
            detail_casting_time_info.min = int(openTime[1])
            print_log(f"상연 시간(시/분) : {detail_casting_time_info.hour}/{detail_casting_time_info.min}")
        # 배역 정보일 경우
        if index > 2:
            print_log('극중 배역')
            detail_casting_acting_info.character = product_info.detail_casting_char_only_info_list[index - 3].character
            detail_casting_acting_info.actor = record.text
            detail_casting_time_info.detail_casting_acting_info_list.append(detail_casting_acting_info)
            print_log(f"캐릭터 : {detail_casting_acting_info.character} / 배우 : {detail_casting_acting_info.actor}")

    # 예약 날짜 계산 (TimeStamp)
    reserveTimeString = detail_casting_time_info.year + '-' + detail_casting_time_info.month + '-' + detail_casting_time_info.day + ' ' + str(detail_casting_time_info.hour) + ':' + str(detail_casting_time_info.min) + ':' + '00.000'

    # String 을 TimeStamp 변환
    reserveTimeTimeStamp = datetime.datetime.strptime(reserveTimeString, '%Y-%m-%d %H:%M:%S.%f')

    # 타임존 설정 (대한민국 시간인 UTC +09:00)
    timezone_kst = datetime.timezone(datetime.timedelta(hours=9))
    reserveTimeUTC = reserveTimeTimeStamp.replace(tzinfo=timezone_kst)

    detail_casting_time_info.time_datetime = reserveTimeUTC
    product_info.detail_casting_time_info_list.append(detail_casting_time_info)


# 공연정보 / 이용정보 탭 > 예매자 통계 탐색 메서드
def extractNaviTabOfDetailAboutStatics(browser: WebDriver, product_info: ProductInfo):
    print_log(f'네비게이션 메뉴 탐색 > 정보 탭 탐색 -> 예매자 통계 탐색')
    # 예매 정보 담을 dict 객체 생성
    static_info = StatisticsInfo()

    try:
        # 예매자 공통 경로
        statusInfo = browser.find_element(By.CSS_SELECTOR, Constants_Selector.commonStatisticsCss)
        # 예매자 > 성별 경로
        statOfGenderList = statusInfo.find_elements(By.CSS_SELECTOR, Constants_Selector.genderStatisticsCss)
        # 예매자 > 나이 경로
        statOfAgeList = statusInfo.find_elements(By.CSS_SELECTOR, Constants_Selector.ageStatisticsCss)

        # 예매자 > 성별 > 남성/여성 통계 조회
        for statOfGender in statOfGenderList:
            isGender = statOfGender.find_element(By.CLASS_NAME, 'statGenderName').text
            isValue = statOfGender.find_element(By.CLASS_NAME, 'statGenderValue').text
            if isGender == '남자':
                static_info.male = float(isValue.replace('%', ''))
                print_log(f"예매자 통계 > 남자 : {isValue}")
            else:
                static_info.female = float(isValue.replace('%', ''))
                print_log(f"예매자 통계 > 여자 : {isValue}")

        # 예매자 > 성별 > 나이대 별 통계 조회
        for statOfAge in statOfAgeList:
            ageName = re.sub('대', '', statOfAge.find_element(By.CLASS_NAME, 'statAgeName').text)
            agePercent = re.sub('%', '', statOfAge.find_element(By.CLASS_NAME, 'statAgePercent').text)
            if ageName == '10':
                static_info.teen = float(agePercent)
            if ageName == '20':
                static_info.twenty = float(agePercent)
            if ageName == '30':
                static_info.thirty = float(agePercent)
            if ageName == '40':
                static_info.forty = float(agePercent)
            if ageName == '50':
                static_info.fifty = float(agePercent)
            print_log(f"{ageName}(대) 예약율 : {agePercent}(% 단위)")
    except NoSuchElementException as nsee:
        log_error(nsee)

    product_info.statistics_info = static_info
    print_log(f"통계 정보 : {product_info.statistics_info}")
