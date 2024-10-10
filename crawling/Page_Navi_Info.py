import copy
import time
import Constants
import datetime
import re

from selenium.webdriver.common.by import By
from selenium.common import TimeoutException, NoSuchElementException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from crawling.Common import log_error, print_log


# 네비게이션 메뉴 탐색 메서드
def extractNaviInfo(browser, productDataList):
    print_log('네비게이션 메뉴 탐색')
    # 탐색 결과 담을 dict 객체
    resultNaviInfo = {}

    # isExistTimeCasting = False
    resultNaviInfo['isExistTimeCasting'] = False

    # 네비게이션 메뉴 선택
    naviItemList = browser.find_element(By.CLASS_NAME, 'navList').find_elements(By.CSS_SELECTOR, 'li')

    # 네비게이션 메뉴 순회
    for naviItem in naviItemList:
        print_log(f'네비게이션 메뉴 순회: {naviItem.text}')
        # print('naviItemList : ' + str(naviItem.get_attribute('innerHTML')))
        # 정보 탭
        naviLinkOfDetailList = ['공연정보', '이용정보']
        # 현 네비 탭 이름이 정보 탭 리스트에 존재할 경우
        if naviItem.text in naviLinkOfDetailList:
            extractNaviTabOfDetail(naviItem, browser, productDataList)

        # 현 네비 탭 이름이 캐스팅 정보인 경우
        if naviItem.text == '캐스팅정보':
            print_log(f'네비게이션 메뉴 순회: {naviItem.text}')
            resultNaviInfo['isExistTimeCasting'] = True
            # 시간별 캐스팅 정보 유무 데이터 리스트 추가
            productDataList['product_isInfoTimeCasting'] = True
            # 캐스팅 테이블 정보 탐색 메서드
            reserveTimeDataList = extractNaviTabOfCasting(naviItem, browser, productDataList)
            print_log(f"reverseTimeDataList: {reserveTimeDataList}")

            # 공연별
            if reserveTimeDataList is False:
                print_log(f"공연 시간 / 시간별 배우 정보가 없음")
                resultNaviInfo['isExistTimeCasting'] = False
            resultNaviInfo['reserveTimeDataList'] = reserveTimeDataList

    time.sleep(1)

    # return isExistTimeCasting
    return resultNaviInfo


# 공연정보 / 이용정보 탭 > 공연 상세 이미지 탐색 메서드
def test_extractNaviTabOfDetailAboutPoster(browser, productDataList):
    print_log(f'네비게이션 메뉴 탐색 > 정보 탭 탐색 -> 공연 상세 이미지 탐색')
    # $$$ 상세 정보 포스터 및 캐스팅 정보 포스터 URL 데이터 리스트 초기화)
    productDataList['product_detail_poster_url'] = None
    productDataList['product_casting_poster_url'] = None

    try:
        # 이미지 상세 정보가 표시될 때 까지 대기
        WebDriverWait(browser, 5).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".content.description")))
    except TimeoutException as te:
        productDataList['product_detail_poster_url'] = 'null'
        productDataList['product_casting_poster_url'] = None
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
    if len(img_sources) > 2:
        print_log(f"상세 이미지 2개 이상 존재")
        productDataList['product_casting_poster_url'] = img_sources[len(img_sources)-1]
        productDataList['product_detail_poster_url'] = img_sources[len(img_sources)-2]
    if len(img_sources) == 1:
        print_log(f"상세 이미지 1개 존재")
        productDataList['product_detail_poster_url'] = img_sources[len(img_sources) - 1]
    if not len(img_sources):
        print_log(f"상세 이미지 존재 하지 않음")


    #
    # index = 0
    #
    # print('<-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*->')
    # # 이미지 파싱 시작
    # # 단, 이미지가 존재하지 않으면 다른 경로로 파싱
    # if len(contentImagePathList) != 0:
    #     # 상세 이미지 주소, 상세 캐스팅 이미지 주소 2개 추출
    #     for contentImagePath in contentImagePathList[:2]:
    #         index = index + 1
    #         # $$$ 상세 정보 포스터 및 캐스팅 정보 포스터 URL 데이터 리스트 추가
    #         if index == 1:
    #             productDataList['product_detail_poster_url'] = contentImagePath.get_attribute('src')
    #         if index == 2:
    #             productDataList['product_casting_poster_url'] = contentImagePath.get_attribute('src')
    #         print(str(index) + '번째 상세 정보 이미지 링크: ' + contentImagePath.get_attribute('src'))
    # else:
    #     try:
    #         # 구조가 첫번째와 다를 경우 (이미지가 1 이상 존재하지 않은 경우)
    #         # 상세 이미지 주소, 상세 캐스팅 이미지 주소 2개 추출
    #         contentSingeImagePath = browser.find_element(By.CSS_SELECTOR, Constants.contentImgDescCss).find_element(
    #             By.CSS_SELECTOR, Constants.detailImgStrucV2Css)
    #         # $$$ 상세 정보 포스터 URL 데이터 리스트 추가
    #         productDataList['product_detail_poster_url'] = contentSingeImagePath.get_attribute('src')
    #         productDataList['product_casting_poster_url'] = None
    #         print('단독 상세 정보 이미지 링크: ' + contentSingeImagePath.get_attribute('src'))
    #     except NoSuchElementException:
    #         try:
    #             contentSingeImagePath = browser.find_element(By.CSS_SELECTOR, Constants.contentImgDescCss).find_element(
    #                 By.CSS_SELECTOR, Constants.detailImgStrucV3Css)
    #             # $$$ 상세 정보 포스터 URL 데이터 리스트 추가
    #             productDataList['product_detail_poster_url'] = contentSingeImagePath.get_attribute('src')
    #             productDataList['product_casting_poster_url'] = None
    #             print('단독 상세 정보 이미지 링크: ' + contentSingeImagePath.get_attribute('src'))
    #         except NoSuchElementException:
    #             productDataList['product_detail_poster_url'] = 'null'
    #             productDataList['product_casting_poster_url'] = None
    #             print('$$$$$ 단독 상세 정보 이미지 링크가 존재하지 않습니다 $$$$$')

# 공연정보 / 이용정보 탭 > 공연 상세 이미지 탐색 메서드
def extractNaviTabOfDetailAboutPoster(browser, productDataList):
    # $$$ 상세 정보 포스터 및 캐스팅 정보 포스터 URL 데이터 리스트 초기화
    print('접근: extractNaviTabOfDetailAboutPoster')
    productDataList['product_detail_poster_url'] = None
    productDataList['product_casting_poster_url'] = None

    try:
        # 이미지 상세 정보가 표시될 때 까지 대기
        WebDriverWait(browser, 5).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, Constants.contentImgDescCss)))
    except TimeoutException:
        productDataList['product_detail_poster_url'] = 'null'
        productDataList['product_casting_poster_url'] = None
        print('공연 상세 이미지 탐색 실패')
        return

    # 상세 정보 이미지 링크
    contentImagePathList = (browser.find_element(By.CSS_SELECTOR, Constants.contentImgDescCss)
                            .find_elements(By.CSS_SELECTOR, Constants.detailImgStrucV1Css))

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
            contentSingeImagePath = browser.find_element(By.CSS_SELECTOR, Constants.contentImgDescCss).find_element(
                By.CSS_SELECTOR, Constants.detailImgStrucV2Css)
            # $$$ 상세 정보 포스터 URL 데이터 리스트 추가
            productDataList['product_detail_poster_url'] = contentSingeImagePath.get_attribute('src')
            productDataList['product_casting_poster_url'] = None
            print('단독 상세 정보 이미지 링크: ' + contentSingeImagePath.get_attribute('src'))
        except NoSuchElementException:
            try:
                contentSingeImagePath = browser.find_element(By.CSS_SELECTOR, Constants.contentImgDescCss).find_element(
                    By.CSS_SELECTOR, Constants.detailImgStrucV3Css)
                # $$$ 상세 정보 포스터 URL 데이터 리스트 추가
                productDataList['product_detail_poster_url'] = contentSingeImagePath.get_attribute('src')
                productDataList['product_casting_poster_url'] = None
                print('단독 상세 정보 이미지 링크: ' + contentSingeImagePath.get_attribute('src'))
            except NoSuchElementException:
                productDataList['product_detail_poster_url'] = 'null'
                productDataList['product_casting_poster_url'] = None
                print('$$$$$ 단독 상세 정보 이미지 링크가 존재하지 않습니다 $$$$$')


# 네비게이션 메뉴 탐색 > 정보 탭 일 경우 탐색 메서드
def extractNaviTabOfDetail(naviItem, browser, productDataList):
    print_log(f'네비게이션 메뉴 탐색 > 정보 탭 탐색')
    # 정보 탭 클릭
    # naviItem.find_element(By.CSS_SELECTOR, 'a').click()
    element = browser.find_element(By.CSS_SELECTOR, 'a')
    browser.execute_script("arguments[0].click();", element)

    # 정보 탭 내 캐스팅 정보 추출 메서드
    castingInfoTotalList = extractNaviTabOfDetailAboutCasting(browser)

    # 정보 탭 내 캐스팅 정보가 있을 경우
    if castingInfoTotalList is not False:
        # $$$ 캐스팅 정보 유무 데이터 리스트 추가
        productDataList['product_isInfoCasting'] = True
        productDataList['castingInfoTotalList'] = castingInfoTotalList
        print_log(f"캐스팅 정보 유무 : {productDataList['product_isInfoCasting']} 캐스팅 정보 데이터 리스트 : {productDataList['product_isInfoCasting']}")
        # for castingInfoList in castingInfoTotalList:
        #     index = 0
            # for castingInfo in castingInfoList:
            #     if index == 0:
            #         # print('캐스팅 역: ' + castingInfo)
            #     if index == 1:
            #         # print('캐스팅 배우: ' + castingInfo)
            #     if index == 2:
            #         # print('캐스팅 상세 정보 링크: ' + castingInfo)
            #     if index == 3:
            #         # print('캐스팅 이미지 링크: ' + castingInfo)
            #     index = index + 1
    else:
        # $$$ 캐스팅 정보 유무 / 시간별 캐스팅 정보 유무 데이터 리스트 추가
        productDataList['product_isInfoCasting'] = False
        print_log(f"캐스팅 정보 유무 : {productDataList['product_isInfoCasting']}")

    # 정보 탭 내 공연 상세 이미지 탐색 메서드
    # extractNaviTabOfDetailAboutPoster(browser, productDataList)
    test_extractNaviTabOfDetailAboutPoster(browser, productDataList)

    # 정보 탭 내 예매자 통계
    extractNaviTabOfDetailAboutStatics(browser, productDataList)

    time.sleep(1)


# 공연정보 / 이용정보 탭 > 캐스팅 정보 추출 메서드
# 캐스팅 정보가 있다면 전체 캐스팅 정보가 담긴 리스트 반환, 없다면 False 반환
def extractNaviTabOfDetailAboutCasting(browser):
    print_log(f'네비게이션 메뉴 탐색 > 정보 탭 탐색 -> 캐스팅 정보')
    # 캐스팅 정보 리스트를 담을 전체 리스트
    castingInfoTotalList = []
    isClickedCastingInfoButton = False

    time.sleep(0.5)

    # 더보기 버튼 클릭, 없다면 생략
    try:
        # browser.find_element(By.CSS_SELECTOR, Constants.clickMoreInfoOfCastingCss).click()
        browser.execute_script("arguments[0].click();", browser.find_element(By.CSS_SELECTOR, Constants.clickMoreInfoOfCastingCss))
        isClickedCastingInfoButton = True
        time.sleep(1)
    except NoSuchElementException as ne:
        log_error(ne)
        pass

    # 캐스팅 정보 선택, 없다면 False
    try:
        # 캐스팅 정보 확인 유무
        if not isClickedCastingInfoButton:
            browser.find_element(By.CSS_SELECTOR, Constants.existCastingContentCss)
        else:
            browser.find_element(By.CSS_SELECTOR, Constants.existCastingContentCss)

        # 캐스팅 정보 선택
        # castingList = browser.find_element(By.CSS_SELECTOR, Constants.castingContentCss).find_elements(By.CSS_SELECTOR,
        #                                                                                                Constants.castingListCss)
        castingList = browser.find_elements(By.CSS_SELECTOR, Constants.castingListCss)

        # 캐스팅 정보를 리스트에 담고 해당 리스트를 통합 리스트에 담는다
        for casting in castingList:
            # 캐스팅 정보 담을 리스트
            castingInfoList = []

            # 캐스팅 정보 저장 메서드
            saveNaviTabOfDetailAboutCasting(castingInfoList, casting)

            # 저장된 캐스팅 정보를 캐스팅 정보 전체 리스트에 저장
            castingInfoTotalList.append(castingInfoList)

        return castingInfoTotalList

    except NoSuchElementException as nsee:
        log_error(nsee)
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
    print_log(f'네비게이션 메뉴 탐색 > 정보 탭 탐색 -> 캐스팅 정보 > 캐스팅 정보 저장\t'
              f'castingActor : {castingActor}\t'
              f'castingName : {castingName}\t'
              f'castingInfoUrl : {castingInfoUrl}\t'
              f'castingImgUrl : {castingImgUrl}')


# 네비게이션 메뉴 탐색 > 캐스팅 탭 탐색 메서드
def extractNaviTabOfCasting(naviItem, browser, productDataList):
    print_log(f'네비게이션 메뉴 탐색 > 정보 탭 탐색 -> 캐스팅 탭')
    # 공연 시간 / 시간별 배우 정보 담을 리스트
    reserveTimeDataList = []

    # naviItem.find_element(By.CSS_SELECTOR, 'a').click()
    try:
        element = browser.find_element(By.CSS_SELECTOR, 'a.navLink[data-target="CASTING"]')
        browser.execute_script("arguments[0].click();", element)

        time.sleep(0.5)
        # 캐스팅 상세 테이블 정보가 표시될 때 까지 대기
        WebDriverWait(browser, 5).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, Constants.castingDetailTableCss)))
    except TimeoutException as te:
        log_error(te)
        return False

    # 캐스팅 테이블 경로
    castingDetailTable = browser.find_element(By.CSS_SELECTOR, Constants.castingDetailTableCss)

    # 캐스팅 테이블 > 모든 행(row) 선택
    elementList = castingDetailTable.find_elements(By.CSS_SELECTOR, 'tr')

    # 작 중 역 정보 담을 리스트
    actingCharacterList = []

    # 배역 정보가 몇 개가 있는지 확인하는 인덱스
    countRecordList = 0

    # 회차 계산 리스트 선언
    turnIndexList = []

    # 캐스팅 테이블 정보 추출
    # 캐스팅 테이블 > 모든 행(row)의 행 1개씩 순회
    print_log('네비게이션 메뉴 탐색 > 정보 탭 탐색 -> 캐스팅 탭 -> 캐스팅 테이블 > 모든 행(row)의 행 1개씩 순회')
    for rowList in elementList:
        countRecordList = countRecordList + 1
        # 테이블 헤더 부분(첫줄)과 그 외 부분을 나누는 분기점
        # 테이블 헤더의 배역 정보만 추출
        if countRecordList == 1:
            actingCharacterList = addListOfTableAboutCharacter(rowList, actingCharacterList)

        # 헤더 배역 정보 제외한 정보 추출 (공연 시간, 배우 탐색 메서드)
        else:
            reserveTimeDataRecord = addListOfTableAboutDateTimeActor(rowList, actingCharacterList, productDataList, turnIndexList)
            reserveTimeDataList.append(reserveTimeDataRecord)

    return reserveTimeDataList


# 네비게이션 메뉴 탐색 > 캐스팅 탭 > 캐스팅 테이블 > 극 중 역 탐색 메서드
def addListOfTableAboutCharacter(rowList, actingCharacterList):
    print_log(f'네비게이션 메뉴 탐색 > 정보 탭 탐색 -> 캐스팅 테이블 -> 극 중 역 탐색 (헤더 정보만)')
    # 헤더의 배역 정보가 있는 행(row)의 속성 값(column) 선택
    headerList = rowList.find_elements(By.CSS_SELECTOR, 'th')
    # 속성 값 중 앞에 두 행(관람일/시간) 을 제외한 배역 정보만 추출
    for count in range(2, len(headerList)):
        # 배역 캐릭터 추출
        actingCharacter = headerList[count].text
        # print('*** ' + str(count - 1) + '번째 작중 역: ' + actingCharacter)
        print_log(f"{str(count - 1)}번째 작중 역: {actingCharacter}")
        # 작중 역 리스트에 배역 캐릭터 추가
        actingCharacterList.append(actingCharacter)

    return actingCharacterList


# 네비게이션 메뉴 탐색 > 캐스팅 탭 > 캐스팅 테이블 > 공연 시간, 배우 탐색 메서드
def addListOfTableAboutDateTimeActor(rowList, actingCharacterList, productDataList, turnIndexList):
    print_log(f'네비게이션 메뉴 탐색 > 정보 탭 탐색 -> 캐스팅 테이블 -> 공연 시간, 배우 탐색 (헤더 제외)')
    # 예매 시간 / 회차 / 가격 담을 dict 객체
    reserveTimeDataRecord = {}
    reserveTimeActorList = []
    # 관람일과 시간, 그 외 배역 정보를 나누기 위한 인덱스
    index = 0
    # 해당 행(row)의 모든 속성 값(column) 선택
    recordList = rowList.find_elements(By.CSS_SELECTOR, 'td')

    for record in recordList:
        index = index + 1
        # 관람일 정보 추출
        if index == 1:
            print_log('관람날짜')
            # 관람일은 |월 / 일(요일)| 구성
            # 현재 시간을 서울 시간 기준으로 계산 (utc)
            now = datetime.datetime.utcnow() + datetime.timedelta(hours=9)

            # 월과 일(요일) 로 분리
            isYear = record.text.split('/')

            # 월 데이터 추출
            month = re.search(r'\d+', isYear[0]).group(0)
            reserveTimeDataRecord['reserve_time_month'] = str(month)
            # 일 데이터 추출
            day = re.search(r'\d+', isYear[1]).group(0)
            reserveTimeDataRecord['reserve_time_day'] = str(day)
            # 요일 데이터 추출
            dayOfWeek = re.search(r'\((.*?)\)', record.text).group(1)

            # 표시된 월 데이터가 현재 월 데이터보다 낮은 경우 다음 해 데이터로 인식
            if int(month) < now.month:
                year = now.year + 1
                reserveTimeDataRecord['reserve_time_year'] = str(year)
            else:
                year = now.year
                reserveTimeDataRecord['reserve_time_year'] = str(year)
            print_log(f"{year}년 {month}월 {day}일 {dayOfWeek}요일")

            # 연도/월/일 계산
            timeDate = reserveTimeDataRecord['reserve_time_year'] + '/' + \
                       reserveTimeDataRecord['reserve_time_month'] + '/' + \
                       reserveTimeDataRecord['reserve_time_day']

            reserveTimeDataRecord['reserve_time_date'] = timeDate

            # 해당 회차 정보 리스트에 추가
            turnIndexList.append(timeDate)

            # 회차 계산, 리스트 내 중복 개수 계산
            turnCount = turnIndexList.count(timeDate)

            # 중복개수 + 1 하여 회차 계산
            reserveTimeDataRecord['reserve_time_turn'] = int(turnCount)
            print_log(f"연도/월/일 : {reserveTimeDataRecord['reserve_time_date']}")
            print_log(f"회차 : {reserveTimeDataRecord['reserve_time_turn']}")

        # 상영시간 추출
        if index == 2:
            print_log('상연시간')
            # 상연 시간은 |00:00| 구성
            openTime = record.text.split(':')
            reserveTimeDataRecord['reserve_time_hour'] = str(openTime[0])
            reserveTimeDataRecord['reserve_time_min'] = str(openTime[1])
            print_log(f"상연 시간(시/분) : {openTime[0]}/{openTime[1]}")
        # 배역 정보일 경우
        if index > 2:
            print_log('극중 배역')
            reserveTimeActorRecord = {}
            reserveTimeActorRecord['Character'] = copy.deepcopy(actingCharacterList[index - 3])
            reserveTimeActorRecord['Actor'] = copy.deepcopy(record.text)

            reserveTimeActorList.append(reserveTimeActorRecord)

            print_log(f"{actingCharacterList[index - 3]}역은 {record.text}")

    # 예약 날짜 계산 (TimeStamp)
    reserveTimeString = reserveTimeDataRecord['reserve_time_year'] + '-' + reserveTimeDataRecord['reserve_time_month'] + '-' + \
                        reserveTimeDataRecord['reserve_time_day'] + ' ' + reserveTimeDataRecord['reserve_time_hour'] + ':' + \
                        reserveTimeDataRecord['reserve_time_min'] + ':' + '00.000'

    # String 을 TimeStamp 변환
    reserveTimeTimeStamp = datetime.datetime.strptime(reserveTimeString, '%Y-%m-%d %H:%M:%S.%f')

    # 타임존 설정 (대한민국 시간인 UTC +09:00)
    timezone_kst = datetime.timezone(datetime.timedelta(hours=9))
    reserveTimeUTC = reserveTimeTimeStamp.replace(tzinfo=timezone_kst)

    # print('Type: TimeZoneSetting' + str(type(reserveTimeUTC)))
    # print('String: TimeZoneSetting' + str(reserveTimeUTC))

    reserveTimeDataRecord['reserve_time'] = reserveTimeUTC
    reserveTimeDataRecord['reserveTimeActorList'] = reserveTimeActorList

    return reserveTimeDataRecord



# 공연정보 / 이용정보 탭 > 예매자 통계 탐색 메서드
def extractNaviTabOfDetailAboutStatics(browser, productDataList):
    print_log(f'네비게이션 메뉴 탐색 > 정보 탭 탐색 -> 예매자 통계 탐색')
    # 예매 정보 담을 dict 객체 생성
    statisticsRecord = {'product_code': productDataList['product_code']}

    try:
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
                statisticsRecord['statistics_male'] = float(isValue.replace('%', ''))
                print_log(f"예매자 통계 > 남자 : {isValue}")
            else:
                statisticsRecord['statistics_female'] = float(isValue.replace('%', ''))
                print_log(f"예매자 통계 > 여자 : {isValue}")

        # 예매자 > 성별 > 나이대 별 통계 조회
        for statOfAge in statOfAgeList:
            ageName = re.sub('대', '', statOfAge.find_element(By.CLASS_NAME, 'statAgeName').text)
            agePercent = re.sub('%', '', statOfAge.find_element(By.CLASS_NAME, 'statAgePercent').text)
            if ageName == '10':
                statisticsRecord['statistics_teen'] = float(agePercent)
            if ageName == '20':
                statisticsRecord['statistics_twenties'] = float(agePercent)
            if ageName == '30':
                statisticsRecord['statistics_thirties'] = float(agePercent)
            if ageName == '40':
                statisticsRecord['statistics_forties'] = float(agePercent)
            if ageName == '50':
                statisticsRecord['statistics_fifties'] = float(agePercent)
            print_log(f"{ageName}(대) 예약율 : {agePercent}(% 단위)")
    except NoSuchElementException as nsee:
        statisticsRecord['statistics_male'] = 0
        statisticsRecord['statistics_female'] = 0
        statisticsRecord['statistics_teen'] = 0
        statisticsRecord['statistics_twenties'] = 0
        statisticsRecord['statistics_thirties'] = 0
        statisticsRecord['statistics_forties'] = 0
        statisticsRecord['statistics_fifties'] = 0
        log_error(nsee)

    productDataList['statisticsRecord'] = statisticsRecord
    print_log(f"{productDataList['statisticsRecord']}")
