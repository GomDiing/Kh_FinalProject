import re
import time
import traceback

import selenium.common.exceptions
from selenium import webdriver
from selenium.common import TimeoutException, NoSuchElementException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
import Constants


def createUrlOfInterpark():
    urlList = []

    baseUrl = 'https://tickets.interpark.com/goods'

    # urlList.append(baseUrl + '/' + str(22012631))  # 뮤지컬 - 랭보
    # urlList.append(baseUrl + '/' + str(22009226))  # 뮤지컬 - 마틸다
    # urlList.append(baseUrl + '/' + str(22014702))  # 연극 - 진짜나쁜소녀
    # urlList.append(baseUrl + '/' + str(22013518))  # 연극 - 맥베스 레퀴엠
    # urlList.append(baseUrl + '/' + str(22014652))  # 클래식 - 스트라스부르 필하모닉 오케스트라 내한공연
    # urlList.append(baseUrl + '/' + str(22015789))  # 클래식 - 디즈니 OST 콘서트：디 오케스트라
    # urlList.append(baseUrl + '/' + str(22005831))  # 전시 - 에바 알머슨 특별전：Andando
    # urlList.append(baseUrl + '/' + str(22009615))  # 전시 - 모네 인사이드
    # urlList.append(baseUrl + '/' + str(19018229))
    # urlList.append(baseUrl + '/' + str(22012184))
    urlList.append(22009029)


    return urlList


def crawlingInterparkBasicInfo(url):
    print('========================================')
    print('<<< Start --- Crawling Interpark >>>')
    print('========================================')

    # <<< 크롬 옵션 설정 >>> #
    chromeOptions = webdriver.ChromeOptions()
    # chromeOptions.add_argument('--headless')
    chromeOptions.add_argument('--window-size=1280,720')
    chromeOptions.add_argument('--no-sandbox')

    # <<< 크롬 브라우저 실행 >>> #
    browser = webdriver.Chrome('./chromedriver', chrome_options=chromeOptions)

    browser.get(url)

    # 해당 태그가 나타날 때 까지 대기
    try:
        WebDriverWait(browser, 5).until(EC.presence_of_element_located((By.CLASS_NAME, "popPriceTable")))
    except TimeoutException as te:
        print('Error!!! TimeOutException!!!')
        browser.quit()
        # break
        return
    except Exception as e:
        print('Error!!! Exception!!!')
        traceback.print_exc()
        browser.quit()
        # break
        return

    # 경고 창 제거, 없다면 무시
    # ******************** #
    try:
        browser.find_element(By.CSS_SELECTOR, '#popup-prdGuide > div > div.popupFooter > button').click()
    except NoSuchElementException:
        pass

    time.sleep(1)


    # 타이틀 추출
    # ******************** #
    print('타이틀: ' + browser.find_element(By.CLASS_NAME, 'prdTitle').text)

    time.sleep(0.5)

    # 한정 | 상시 판매 추출
    # ******************** #
    # 상시 판매일 경우 sideContent, 그렇지 않으면 sideHeader
    isRegularSale = browser.find_element(By.XPATH, '/html/body/div[1]/div[5]/div[1]/div[3]/div/div[1]/div[1]/div[1]').get_attribute('class')
    if isRegularSale == 'sideContent':
        print('판매 종류: 상시 판매')
    else:
        print('판매 종류: 한정 판매')

    # 포스터 주소 추출
    # ******************** #
    posterSource = browser.find_element(By.CSS_SELECTOR, '#container > div.contents > div.productWrapper > div.productMain > div.productMainTop > div > div.summaryBody > div > div.posterBoxTop > img').get_attribute('src')
    print('포스터 주소: ' + posterSource)

    # 아래 요소 추출
    # ******************** #
    # 장소
    # (한정 판매) 공연기간, 공연시간 / (상시 판매) 기간
    # 관람 연령
    # 가격
    informList = browser.find_element(By.CSS_SELECTOR, '#container > div.contents > div.productWrapper > div.productMain > div.productMainTop > div > div.summaryBody > ul').find_elements(By.CLASS_NAME, 'infoItem')
    for inform in informList:
        # print('속성 값: ' + inform.get_attribute('class'))
        attribute = inform.get_attribute('class')
        print('==========')

        # 장소, (한정 판매) 공연기간, 공연시간 / (상시 판매) 기간, 관람연령 출력
        if attribute == 'infoItem':
            print('속성 값: infoItem')
            # 장소 출력, (자세히)는 제외
            if inform.find_element(By.CLASS_NAME, 'infoLabel').text == '장소':
                print('장소: ' + re.sub('\(자세히\)', '', inform.find_element(By.CLASS_NAME, 'infoDesc').text))
            # (한정) 공연기간 출력
            if inform.find_element(By.CLASS_NAME, 'infoLabel').text == '공연기간':
                periodInfo = inform.find_element(By.CLASS_NAME, 'infoDesc').text
                # 공연 기간이 나뉘어져 있다면 나뉘어 추출
                isTerm = periodInfo.find(' ~')
                if isTerm == -1:
                    print('공연기간: ' + periodInfo)
                else:
                    periodInfoTerm = periodInfo.split(' ~')
                    print('(시작) 공연기간 :' + periodInfoTerm[0])
                    print('(끝) 공연기간 :' + periodInfoTerm[1])
            # (한정) 공연시간 출력
            if inform.find_element(By.CLASS_NAME, 'infoLabel').text == '공연시간':
                timeInfo = inform.find_element(By.CLASS_NAME, 'infoDesc').text
                isIntermission = timeInfo.find('인터미션')
                if isIntermission == -1:
                    print('공연시간: ' + timeInfo)
                else:
                    timeInfoFindAllList = re.findall(r'[0-9]+분', timeInfo)
                    print('공연시간: ' + timeInfoFindAllList[0])
                    print('인터미션: ' + timeInfoFindAllList[1])
            # (상시) 기간 출력
            if inform.find_element(By.CLASS_NAME, 'infoLabel').text == '기간':
                print('기간: ' + inform.find_element(By.CLASS_NAME, 'infoDesc').text)
            # 관람연령 출력
            if inform.find_element(By.CLASS_NAME, 'infoLabel').text == '관람연령':
                ageInfo = inform.find_element(By.CLASS_NAME, 'infoDesc').text
                # 전체 관람가 유무 분기
                if ageInfo.find('전체') == -1:
                    # 만 / 한국식 나이일 경우
                    ageInfoSearch = re.search(r'\d+세', ageInfo).group(0)
                    if re.match(r'만', ageInfo) is None:
                        print('한국식 나이: ' + ageInfoSearch)
                    else:
                        print('만 나이: ' + ageInfoSearch)
                else:
                    print('전체 관람가: ' + ageInfo)

        # 가격 요소 출력
        if attribute == 'infoItem infoPrice':
            print('속성 값: infoItem infoPrice')
            infoPriceItemList = inform.find_elements(By.CSS_SELECTOR, 'div > ul > li.infoPriceItem')
            count = 0
            # 좌석이 모두 동일할 경우를 확인
            seatInfoList = []

            # 가격 요소 출력, 전체 가격 보기 요소 제외
            for infoPriceItem in infoPriceItemList[1:]:
                count = count + 1
                print('*** ' + str(count) + '번째 가격 요소 출력 ***')
                # span 태그로 정렬 되었을 때 좌석, 가격 요소 추출
                # 다른 구조로 정렬 되었을 때 except 문으로 이동해서 추출
                try:
                    seatInfo = infoPriceItem.find_element(By.CSS_SELECTOR, 'span.name').text
                    seatInfoList.append(seatInfo)
                    priceInfo = infoPriceItem.find_element(By.CSS_SELECTOR, 'span.price').text
                    print('--- 좌석: ' + re.sub(r'석$', '', seatInfo))
                    print('--- 가격: ' + re.sub('원|,', '', priceInfo))
                # 다른 구조로 요소가 정렬 되었을 때
                except NoSuchElementException:
                    prdPriceDetailList = infoPriceItem.find_element(By.CLASS_NAME, 'prdPriceDetail').find_elements(By.TAG_NAME, 'li')
                    for prdPriceDetail in prdPriceDetailList:
                        seatInfo = re.search(r'(.*?)석', prdPriceDetail.text).group(1)
                        print('---좌석: ' + seatInfo)
                        priceInfoSpace = re.sub(seatInfo, '', prdPriceDetail.text)
                        # 공백, '원' 제외
                        print('---가격: ' + re.sub(r'석|\s+|원', '', priceInfoSpace))

            # 좌석 정보에 중복이 있는지 확인
            # 없다면 생략, 있다면 상세 정보 표기
            if len(seatInfoList) == len(set(seatInfoList)):
                pass
            else:
                # 전체 가격 보기 클릭
                browser.find_element(By.CSS_SELECTOR, '#container > div.contents > div.productWrapper > div.productMain > div.productMainTop > div > div.summaryBody > ul > li.infoItem.infoPrice > div > ul > li.infoPriceItem.is-largePrice > a').click()

                time.sleep(0.5)

                # 상세한 가격 정보 선택
                detailInfoList = browser.find_element(By.CSS_SELECTOR, '#popup-info-price > div > div.popupBody > div > div > table > tbody').find_elements(By.CSS_SELECTOR, 'tr')

                for detailInfo in detailInfoList:
                    detailInfoText = detailInfo.text
                    try:
                        # 카테고리 영역이 있다면 제외
                        categoryInfo = detailInfo.find_element(By.CLASS_NAME, 'category').text
                        detailInfoText = re.sub(categoryInfo + ' ', '', detailInfoText)
                    except NoSuchElementException:
                        pass
                    detailSeatInfo = detailInfoText.split(' ')[0]
                    detailPriceInfo = detailInfoText.split(' ')[1]
                    print('*** 상세 정보 => 좌석: ' + detailSeatInfo)
                    print('*** 상세 정보 => 가격: ' + re.sub(r'원|,', '', detailPriceInfo))

                browser.find_element(By.CSS_SELECTOR, '#popup-info-price > div > div.popupHead > button').click()

                time.sleep(0.5)

        if attribute == 'infoItem infoBenefit':
            print('속성 값: infoItem infoBenefit')
        if attribute == 'infoItem infoRelated':
            print('속성 값: infoItem infoRelated')
        print('디버깅 요소 - 헤더: ' + inform.find_element(By.CLASS_NAME, 'infoLabel').text)
        print('디버깅 요소 - 내용: ' + inform.find_element(By.CLASS_NAME, 'infoDesc').text)



    time.sleep(0.5)


def crawlingInterparkNavi(url):
    print('========================================')
    print('<<< Start --- Crawling Interpark >>>')
    print('========================================')

    # <<< 크롬 옵션 설정 >>> #
    chromeOptions = webdriver.ChromeOptions()
    # chromeOptions.add_argument('--headless')
    chromeOptions.add_argument('--window-size=1280,720')
    chromeOptions.add_argument('--no-sandbox')

    # <<< 크롬 브라우저 실행 >>> #
    browser = webdriver.Chrome('./chromedriver', chrome_options=chromeOptions)

    browser.get(url)


    # 해당 태그가 나타날 때 까지 대기
    try:
        WebDriverWait(browser, 5).until(EC.presence_of_element_located((By.CLASS_NAME, "popPriceTable")))
    except TimeoutException as te:
        print('Error!!! TimeOutException!!!')
        browser.quit()
        # break
        return
    except Exception as e:
        print('Error!!! Exception!!!')
        traceback.print_exc()
        browser.quit()
        # break
        return

    # 경고 창 제거, 없다면 무시
    # ******************** #
    try:
        browser.find_element(By.CSS_SELECTOR, '#popup-prdGuide > div > div.popupFooter > button').click()
    except NoSuchElementException:
        pass

    time.sleep(1)

    # 타이틀 추출
    # ******************** #
    print('타이틀: ' + browser.find_element(By.CLASS_NAME, 'prdTitle').text)

    # 네비게이션 메뉴 선택
    naviItemList = browser.find_element(By.CLASS_NAME, 'navList').find_elements(By.CSS_SELECTOR, 'li')

    navDetailList = ['공연정보', '이용정보']

    for naviItem in naviItemList:
        if navDetailList.count(naviItem.text) != 0:
            print('==**==**==**==**==**==**==**==**==**==')
            naviItem.find_element(By.CSS_SELECTOR, 'a').click()

            time.sleep(0.5)

            contentDescriptionCSSPath = '#productMainBody > div > div.content.description'

            # 상세 정보가 표시될 때 까지 대기
            WebDriverWait(browser, 5).until(EC.presence_of_element_located((By.CSS_SELECTOR, contentDescriptionCSSPath)))

            try:
                # 더보기 버튼 클릭
                browser.find_element(By.CSS_SELECTOR, '#productMainBody > div > div.content.casting > div > a').click()

                time.sleep(1)

            except NoSuchElementException:
                pass

            try:
                # 캐스팅 정보 출력
                castingContent = browser.find_element(By.CSS_SELECTOR, '#productMainBody > div > div.content.casting')

                castingList = castingContent.find_elements(By.CSS_SELECTOR, 'div.expandalbeWrap > ul > li')

                for casting in castingList:
                    print('<-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*->')
                    # 캐스팅 역
                    castingActor = casting.find_element(By.CSS_SELECTOR, 'div.castingInfo > div.castingActor').text
                    print('캐스팅 역: ' + castingActor)

                    # 캐스팅 배우 이름
                    castingName = casting.find_element(By.CSS_SELECTOR, 'div.castingInfo > div.castingName').text
                    print('캐스팅 배우: ' + castingName)

                    # 캐스팅 상세 정보 링크
                    castingInfo = casting.find_element(By.CSS_SELECTOR, 'div.castingTop > a.castingLink').get_attribute('href')
                    print('캐스팅 정보 링크: ' + castingInfo)

                    # 캐스팅 이미지 링크
                    castingImgPath = casting.find_element(By.CSS_SELECTOR, 'div.castingTop > a.castingLink > div.castingProfile > img').get_attribute('src')
                    print('캐스팅 이미지 링크: ' + castingImgPath)

            except NoSuchElementException:
                pass

            # 상세 정보 이미지 링크
            contentImagePathList = browser.find_element(By.CSS_SELECTOR, contentDescriptionCSSPath).find_elements(By.CSS_SELECTOR, 'div.contentDetail > p > strong > img')

            count = 0

            print('<-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*-=*->')
            if len(contentImagePathList) > 2:
                for contentImagePath in contentImagePathList[:2]:
                    count = count + 1
                    print(str(count) + '번째 상세 정보 이미지 링크: ' + contentImagePath.get_attribute('src'))
            else:
                contentSingeImagePath = browser.find_element(By.CSS_SELECTOR, contentDescriptionCSSPath).find_element(By.CSS_SELECTOR, 'div.contentDetail > img')
                print('단독 상세 정보 이미지 링크: ' + contentSingeImagePath.get_attribute('src'))


            statusInfo = browser.find_element(By.CSS_SELECTOR, '#productMainBody > div > div.content.prdStat > div.statWrap')
            statOfGenderList = statusInfo.find_elements(By.CSS_SELECTOR, 'div.statGender > div')
            statOfAgeList = statusInfo.find_elements(By.CSS_SELECTOR, 'div.statAge > div > div.statAgeType')

            for statOfGender in statOfGenderList:
                isGender = statOfGender.find_element(By.CLASS_NAME, 'statGenderName').text
                isValue = statOfGender.find_element(By.CLASS_NAME, 'statGenderValue').text
                if isGender == '남자':
                    print('예매자 통계 > 남자 : ' + isValue)
                else:
                    print('예매자 통계 > 여자 : ' + isValue)

            for statOfAge in statOfAgeList:
                ageName = re.sub('대', '', statOfAge.find_element(By.CLASS_NAME, 'statAgeName').text)
                agePercent = re.sub('%', '', statOfAge.find_element(By.CLASS_NAME, 'statAgePercent').text)
                print(ageName + '(대) 예약율 : ' + agePercent + '(% 단위)')



            time.sleep(1)

        if naviItem.text == '캐스팅정보':
            print('==**==**==**==**==**==**==**==**==**==')

            naviItem.find_element(By.CSS_SELECTOR, 'a').click()

            time.sleep(0.5)

            castingDetailTableCSSPath = '#productMainBody > div > div > div.castingDetailResult > table > tbody'

            # 캐스팅 상세 테이블 정보가 표시될 때 까지 대기
            WebDriverWait(browser, 5).until(EC.presence_of_element_located((By.CSS_SELECTOR, castingDetailTableCSSPath)))

            castingDetailTable = browser.find_element(By.CSS_SELECTOR, castingDetailTableCSSPath)

            elementList = castingDetailTable.find_elements(By.CSS_SELECTOR, 'tr')
            actingCharacterList = []
            countRecordList = 0
            # 테이블 정보 추출
            for rowList in elementList:
                countRecordList = countRecordList + 1
                # 테이블 헤더의 배역 정보만 추출
                if countRecordList == 1:
                    headerList = rowList.find_elements(By.CSS_SELECTOR, 'th')
                    for count in range(2, len(headerList)):
                        actingCharacter = headerList[count].text
                        print('*** ' + str(count - 1) + '번째 작중 역: ' + actingCharacter)
                        actingCharacterList.append(actingCharacter)
                # 헤더 배역 정보 제외한 정보 추출
                else:
                    countRecord = 0
                    recordList = rowList.find_elements(By.CSS_SELECTOR, 'td')
                    print('=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=')
                    for record in recordList:
                        countRecord = countRecord + 1
                        # 날씨 정보 추출
                        if countRecord == 1:
                            isYear = record.text.split('/')
                            if int(isYear[0]) < 11:
                                year = 2023
                            else:
                                year = 2022
                            month = re.search(r'\d+', isYear[0]).group(0)
                            day = re.search(r'\d+', isYear[1]).group(0)
                            dayOfWeek = re.search(r'\((.*?)\)', record.text).group(1)
                            print(str(year) + '년 ' + month + '월 ' + day + '일 ' + dayOfWeek + '요일')
                        if countRecord == 2:
                            openTime = record.text.split(':')
                            print('상영 시간(시): ' + openTime[0])
                            print('상영 시간(분): ' + openTime[1])
                        if countRecord > 2:
                            print(actingCharacterList[countRecord - 3] + '역은 ' + record.text)
            time.sleep(1)


def crawlingRankingUrlList():
    allBaseListUrl = 'http://ticket.interpark.com/TPGoodsList.asp'

    # 뮤지컬
    # allRankingListUrl = allBaseListUrl + '?Ca=Mus'
    # 연극
    # allRankingListUrl = allBaseListUrl + '?Ca=Dra'
    # 클래식
    # allRankingListUrl = allBaseListUrl + '?Ca=Cla&SubCa=ClassicMain'
    # 전시
    allRankingListUrl = allBaseListUrl + '?Ca=Eve&SubCa=Eve_O'

    todayRanking = allRankingListUrl + '&Sort=1'
    weekRanking = allRankingListUrl + '&Sort=2'
    monthRanking = allRankingListUrl + '&Sort=3'
    sortByNameAsc = allRankingListUrl + '&Sort=4'
    closeSoonAsc = allRankingListUrl + '&Sort=5'

    print('========================================')
    print('<<< Start --- Crawling Interpark >>>')
    print('========================================')

    # <<< 크롬 옵션 설정 >>> #
    chromeOptions = webdriver.ChromeOptions()
    # chromeOptions.add_argument('--headless')
    chromeOptions.add_argument('--window-size=1280,720')
    chromeOptions.add_argument('--no-sandbox')

    # <<< 크롬 브라우저 실행 >>> #
    browser = webdriver.Chrome('./chromedriver', chrome_options=chromeOptions)

    browser.get(todayRanking)

    # 해당 태그가 나타날 때 까지 대기
    try:
        WebDriverWait(browser, 10).until(EC.presence_of_element_located((By.CLASS_NAME, 'RK_total2')))
    except TimeoutException as te:
        print('Error!!! TimeOutException!!!')
        browser.quit()
        # break
        return
    except Exception as e:
        print('Error!!! Exception!!!')
        traceback.print_exc()
        browser.quit()
        # break
        return

    totalCountElement = browser.find_element(By.CLASS_NAME, 'RK_total2')
    totalCount = re.search(r'\d+', totalCountElement.find_element(By.CSS_SELECTOR, 'span').text).group(0)

    # 마지막 요소 탐색
    lastElement = 'div.sR_w755 > div.Rk_gen2 > div.con > div > table > tbody > tr:nth-child(' + str(totalCount) + ')'

    try:
        WebDriverWait(browser, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, lastElement)))
    except TimeoutException as te:
        print('Error!!! TimeOutException!!!')
        browser.quit()
        # break
        return
    except Exception as e:
        print('Error!!! Exception!!!')
        traceback.print_exc()
        browser.quit()
        # break

    for index in range(1, int(totalCount) + 1):
        currentElementCSSPath = 'div.sR_w755 > div.Rk_gen2 > div.con > div > table > tbody > tr:nth-child(' + str(index) + ') > td.RKtxt > span > a'
        currentElementUrl = browser.find_element(By.CSS_SELECTOR, currentElementCSSPath).get_attribute('href')
        currentUrlKey = re.sub('GroupCode=', '', currentElementUrl.split('?')[1])

        print(str(index) + '번째 url Key = ' + currentUrlKey)

    # lastUrl = browser.find_element(By.CSS_SELECTOR, lastElement + ' > td.RKtxt > span > a').get_attribute('href')
    #
    # print(re.sub('GroupCode=', '', lastUrl.split('?')[1]))


def crawlingInterparkCalendar(url):
    print('========================================')
    print('<<< Start --- Crawling InterparkCalendar >>>')
    print('========================================')

    # <<< 크롬 옵션 설정 >>> #
    chromeOptions = webdriver.ChromeOptions()
    # chromeOptions.add_argument('--headless')
    chromeOptions.add_argument('--window-size=1280,720')
    chromeOptions.add_argument('--no-sandbox')

    # <<< 크롬 브라우저 실행 >>> #
    browser = webdriver.Chrome('./chromedriver', chrome_options=chromeOptions)

    browser.get(url)

    # 해당 태그가 나타날 때 까지 대기
    try:
        WebDriverWait(browser, 5).until(EC.presence_of_element_located((By.CLASS_NAME, "popPriceTable")))
    except TimeoutException as te:
        print('Error!!! TimeOutException!!!')
        browser.quit()
        # break
        return
    except Exception as e:
        print('Error!!! Exception!!!')
        traceback.print_exc()
        browser.quit()
        # break
        return

    # 경고 창 제거, 없다면 무시
    # ******************** #
    try:
        browser.find_element(By.CSS_SELECTOR, '#popup-prdGuide > div > div.popupFooter > button').click()
    except NoSuchElementException:
        pass

    time.sleep(1)

    # 타이틀 추출
    # ******************** #
    print('타이틀: ' + browser.find_element(By.CLASS_NAME, 'prdTitle').text)

    isRegularSale = browser.find_element(By.CSS_SELECTOR, '#productSide > div > div.sideMain > div > div').get_attribute('class')
    if isRegularSale == 'sideContent':
        print('판매 종류: 상시 판매')
    else:
        print('판매 종류: 한정 판매')


    # 다음 달 이동이 불가능 할 때 까지 계속 조회
    while isRegularSale != 'sideContent':
        # -------------------- #
        # 예약 가능한 날짜 조회 #
        # -------------------- #
        # 메인화면 > 캘린더 : 날짜 태그 추출 (ul)
        # reserveDaysList = soup_page.find('ul', {'data-view': 'days'})
        reserveDaysList = browser.find_elements(By.CSS_SELECTOR, '#productSide > div > div.sideMain > div.sideContainer.containerTop.sideToggleWrap > div.sideContent.toggleCalendar > div > div > div > div > ul:nth-child(3) > li')

        # 예약 가능한 날짜 담을 List 선언
        possibleDaysList = []

        # muted 된 요소 세기
        mutedCount = 0

        # 날짜 리스트 중 예약 가능한 날짜 찾아서 List 배열에 넣기 #
        # ----- #
        # <li> 태그를 순회하면서 disabled / muted 이면 제외, picked / 빈 문자열 이면 포함
        # 단, muted 이면 추가, 추후 예약 가능 날짜에 접근할 때 필요
        for reserveDays in reserveDaysList:
            # # 태그 속 텍스트만 찾을 정규 표현식
            # re_patt = re.compile('"(.*?)"')
            #
            # # 위 정규 표현식을 해당 날짜 태그에서 적용
            # checkDisabled = str(re.search(re_patt, str(reserveDays)).group(0))

            isPossibleDay = reserveDays.get_attribute('class')
            # muted 이면 추가
            if isPossibleDay == 'muted':
                mutedCount = mutedCount + 1;
            # 빈 문자열이면 예약 가능한 날짜에 추가
            if isPossibleDay == '':
                possibleDaysList.append(reserveDays.text)
            # picked 이여도 추가
            if isPossibleDay == 'picked':
                possibleDaysList.append(reserveDays.text)

        currentYearMonth = browser.find_element(By.CSS_SELECTOR, '#productSide > div > div.sideMain > div.sideContainer.containerTop.sideToggleWrap > div.sideContent.toggleCalendar > div > div > div > div > ul:nth-child(1) > li:nth-child(2)').text
        print('====================')
        print('현재 연월 : ' + currentYearMonth)
        print('====================')
        print("예약 가능한 날짜 : " + str(possibleDaysList))

        # -------------------- #
        # 예약 가능한 날짜 에서 캐스트 정보 조회 #
        # -------------------- #
        for possibleDays in possibleDaysList:
            # print(possibleDays)

            # 해당 날짜 조회
            print('현재 날짜: ' + str(possibleDays))

            # 현 예약 가능 날짜에 총 muted 숫자 추가
            possibleDaysMuted = int(possibleDays) + mutedCount
            time.sleep(0.2)

            # 메인화면 > 캘린더 > 예약 가능 날짜 접근해서 클릭

            possibleDaysCssPath = '#productSide > div > div.sideMain > div.sideContainer.containerTop.sideToggleWrap > div.sideContent.toggleCalendar > div > div > div > div > ul:nth-child(3) > li:nth-child('+ str(possibleDaysMuted) +')'

            browser.find_element(By.CSS_SELECTOR, possibleDaysCssPath).click()

            time.sleep(0.5)

            # 주연 정보 접근
            # 메인화면 > 캘린더 > 예약 가능 날짜(클릭) > 공연 회차 : 총 공연 회차 조회
            try:
                turnTotalCount = browser.find_elements(By.CSS_SELECTOR, '#productSide > div > div.sideMain > div.sideContainer.containerMiddle.sideToggleWrap > div.sideContent > div.sideTimeTable.toggleTimeTable > ul > li')

                print('총 회차 수: ' + str(len(turnTotalCount)))

                # 각 공연 회차에 접근해 배우 정보 추출 #
                # print('======================== for debug!!! ===========================')
                for count in range(1, len(turnTotalCount) + 1):
                    # 메인화면 > 캘린더 > 예약 가능 날짜(클릭) > 총 공연 회차 클릭
                    browser.find_element(By.CSS_SELECTOR, '#productSide > div > div.sideMain > div.sideContainer.containerMiddle.sideToggleWrap > div.sideContent > div.sideTimeTable.toggleTimeTable > ul > li:nth-child(' + str(count) + ')').click()

                    time.sleep(0.2)

                    # 현 공연 회차 배우 정보 출력
                    print('현 ' + str(count) + '회차 ')

                    try:
                        print('배우 정보 :' + browser.find_element(By.CSS_SELECTOR, '#productSide > div > div.sideMain > div.sideContainer.containerBottom > div.sideContent').text)
                    except NoSuchElementException:
                        pass

                    time.sleep(0.2)
            except NoSuchElementException:
                pass

        # -------------------- #
        # 캘린더 다음 달로 이동 하는 메서드 #
        # 다음 달 이동 버튼의 class 값이 disabled 이면 종료
        # 그렇지 않으면 이동
        # -------------------- #

        # 메인화면 > 캘린더 > 다음 달 이동 버튼 조회
        # nextPageButton = soup_page.find('li', {'data-view': 'month next'})
        nextPageButton = browser.find_element(By.CSS_SELECTOR, '#productSide > div > div.sideMain > div.sideContainer.containerTop.sideToggleWrap > div.sideContent.toggleCalendar > div > div > div > div > ul:nth-child(1) > li:nth-child(3)')
        # print(nextPageButton.text)

        # 다음 달 이동 버튼의 class 값이 disabled 인지 확인, group(1)로 판단 가능
        isNextMonthDisabled = nextPageButton.get_attribute('class')
        #
        # class 속성 값이 disabled 이면 종료
        if (isNextMonthDisabled == 'disabled'):
            browser.quit()
            break
        else:
            # 다음 달 이동 버튼이 disabled 이면 이동 클릭
            browser.execute_script('arguments[0].click();', nextPageButton)

        time.sleep(3)


if __name__ == '__main__':
    urlList = createUrlOfInterpark()
    # crawlingRankingUrlList()

    for url in urlList:
        # crawlingInterparkBasicInfo(url)
        # crawlingInterparkNavi(url)
        crawlingInterparkCalendar(url)
