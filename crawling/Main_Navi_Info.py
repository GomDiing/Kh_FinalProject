import time
import Constants
import datetime
import re

from selenium.webdriver.common.by import By
from selenium.common import TimeoutException, NoSuchElementException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


# 네비게이션 메뉴 탐색 메서드
def extractNaviInfo(browser):
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