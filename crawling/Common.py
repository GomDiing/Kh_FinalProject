import copy
import time
import traceback

from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.chrome.options import Options as ChromeOptions
from webdriver_manager.chrome import ChromeDriverManager

from selenium.common import TimeoutException, NoSuchElementException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from sqlalchemy import MetaData, Table, insert, select, delete
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import MetaData
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import IntegrityError

from crawling import Constants
import configparser
import sqlalchemy

# from crawling.Page import crawlingInterparkPage

# from crawling.Page import crawlingInterparkPage

# 설정값 읽기
config = configparser.ConfigParser()
config.read('config.ini')

SQLALCHEMY_DB_URL = config['DEFAULT']['SQLALCHEMY_DB_URL']

# DB와 연결
engine = sqlalchemy.create_engine(SQLALCHEMY_DB_URL, echo=False, pool_recycle=30)

# Session 생성
metadata_obj = MetaData(bind=engine)
SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()

Base = declarative_base()


# 크롬 브라우저 옵션 설정 및 실행 메서드
def initChromBrowser():
    # <<< 크롬 옵션 설정 >>> #
    chromeOptions = ChromeOptions()
    chromeOptions.add_argument('--headless')
    chromeOptions.add_argument('--window-size=1280,720')
    chromeOptions.add_argument('--no-sandbox')

    # chromeService = ChromeService(executable_path='./chromedriver')
    chromeService = ChromeService(executable_path=ChromeDriverManager().install())

    # <<< 크롬 브라우저 실행 >>> #
    browser = webdriver.Chrome(service=chromeService, options=chromeOptions)

    return browser


# 주어진 요소가 발생할 때 까지 대기하는 메서드
def waitUntilElementLocated(browser, waitTime, byKey, byPath):
    # byList = ['css selector', 'class name', 'id', 'tag name', 'xpath', 'name', 'link text', 'partial link text']
    if not isinstance(waitTime, int):
        print('time이 올바른 값이 아닙니다')
    if not isinstance(byKey, str):
        print('byKey가 올바른 값이 아닙니다')
        return False
    if not isinstance(byPath, str):
        print('byPath가 올바른 값이 아닙니다')
        return False
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
            return False
        except Exception as e:
            print('Error!!! Exception!!!')
            print('byKey: ' + byKey)
            print('byPath: ' + byPath)
            traceback.print_exc()
            browser.quit()
            # break
            return False
    return True


# 엔진 생성 메서드, 테이블 생성 확인
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
        print(ex)
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


def commitRankingChangeStatus(product_code, product_category, rank_status):
    t_rank_name_list = ['ranking_week', 'ranking_month', 'ranking_close_soon']
    print('123: ' + product_code)
    print('123: ' + product_category)
    print('123: ' + rank_status)

    for t_rank_name in t_rank_name_list:
        print('Change Rank Status Query!!! : rank_table = ' + t_rank_name +
              'product_code = ' + product_code +
              ',and rank_status = ' + rank_status)
        t_rank = Table(t_rank_name, metadata_obj, autoload_with=engine, autoload=True)
        updateQuery = t_rank.update().where(t_rank.c.product_code == product_code) \
            .where(t_rank.c.ranking_category == product_category) \
            .values(ranking_status=rank_status)
        print(updateQuery)

        # Commit
        commit_db(updateQuery)


# 순위 테이블에 차트 차트 올리기
# rankingDataList 구조
# rankingDataList['product_category'] = '{카테고리 이름 (MUSICAL / DRAMA / CLASSIC / EXHIBITION)}'
# rankingDataList['ranking_url'] = 카테고리 포함한 링크 (ex: http://ticket.interpark.com/TPGoodsList.asp&?Ca=Mus)
# rankingDataList['product_ranking_category'] = '{순위 분류 (Week / Month / CloseSoon)}'
# rankingDataList['product_url_list'] = [{해당 순위 테이블에 들어갈 데이터들이 List 형태로 정렬}]
#
def commitRankingDataList(rankingDataList):
    t_ranking = None
    table_name = None

    if rankingDataList['product_ranking_category'] == 'Week':
        table_name = 'ranking_week'
        t_ranking = Table('ranking_week', metadata_obj, autoload_with=engine, autoload=True)

    if rankingDataList['product_ranking_category'] == 'Month':
        table_name = 'ranking_month'
        t_ranking = Table('ranking_month', metadata_obj, autoload_with=engine, autoload=True)

    if rankingDataList['product_ranking_category'] == 'CloseSoon':
        table_name = 'ranking_close_soon'
        t_ranking = Table('ranking_close_soon', metadata_obj, autoload_with=engine, autoload=True)

    if t_ranking is None:
        raise Exception('t_ranking is None!!!')

    # url 리스트 추출
    currentUrlKeyList = rankingDataList['product_url_list']

    # url 리스트 전체 개수 추출
    print('keyList: ' + str(len(currentUrlKeyList)))
    totalCount = len(currentUrlKeyList)

    # 카테고리 추출
    category = rankingDataList['product_category']

    # for 문 인덱스 선언
    currentOrder = 0

    print('table_name: ' + table_name)
    # url 리스트 순회
    for urlKey in currentUrlKeyList:
        print('===============================')
        print('')
        print('urlKey ' + urlKey)
        # 해당 데이터 DB 테이블의 존재 여부 확인 변수
        # isTrue = False

        # 해당 카테고리와 해당 url이 있는 레코드의 순서(order) 컬럼 추출 쿼리문
        # 반환 컬렉션은 List 이지만 1개만 조회된다
        print('category ' + category)


        # 카운트 수 증가
        currentOrder = currentOrder + 1
        print('currentOrder: ' + str(currentOrder))

        selectQuery = select(t_ranking).where(t_ranking.c.ranking_category == category) \
            .where(t_ranking.c.product_code == str(urlKey))

        # print(selectQuery)
        # 쿼리문 실행
        resultSelectQuery = db.execute(selectQuery)

        searchOrder = 0
        searchRankingIndex = 0
        searchRankingStatus = 'READY'

        # 동일하지 않으면 기존 영화 정보를 갱신
        # print(resultSelectQuery)
        # time.sleep(0.1)
        for resultDataRecord in resultSelectQuery:
            searchOrder = int(resultDataRecord['ranking_order'])
            searchRankingStatus = resultDataRecord['ranking_status']
            searchRankingIndex = resultDataRecord['ranking_index']
            # print(str(resultDataRecord))
            print('searchOrder = ' + str(searchOrder))

        if searchOrder != currentOrder and searchOrder != 0:
            # isTrue = True

            print('Update Query!!!' + urlKey)
            updateQuery = t_ranking.update().where(t_ranking.c.ranking_order == searchOrder) \
                .where(t_ranking.c.ranking_category == category) \
                .where(t_ranking.c.ranking_index == searchRankingIndex) \
                .values(ranking_order=currentOrder,
                        ranking_category=category,
                        product_code=str(urlKey),
                        ranking_status=searchRankingStatus)

            print('update Query : ' + str(updateQuery))

            # Commit
            commit_db(updateQuery)

        # 조회되지 않는다면 응답 순위 데이터 추가
        # if isTrue is False:
        elif searchOrder == 0:
            print('Insert currentOrder: ' + str(currentOrder))
            print('Insert category: ' + str(category))
            print('Insert product_code: ' + str(urlKey))
            # print('Insert ranking_status: ' + str(currentOrder))
            print("Insert Query!!!" + str(urlKey))

            insertQuery = insert(t_ranking).values(ranking_order=currentOrder,
                                                   ranking_category=category,
                                                   product_code=str(urlKey),
                                                   ranking_status='READY')
            print('Insert Query : ' + str(insertQuery))

            commit_db(insertQuery)

        else:
            print("####### NOTHING QUERY!!!")
            # isTrue = True

        # 응답 url 제품 정보가 테이블에 있는지 확인
        # 없다면 제품 정보를 요청해서 테이블에 추가
        # if isExistProduct(urlKey) == True:
        #     pass
        # else:
        #     crawlingInterparkPage(urlKey)

        print('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')

    deleteQuery = delete(t_ranking).where(t_ranking.c.ranking_category == category) \
        .where(t_ranking.c.ranking_order > totalCount)
    print('DELETE!!! : ' + str(deleteQuery))
    commit_db(deleteQuery)


def browseRankingUrlList():
    rankingUrlList = []
    t_ranking = None
    for count in range(0, 4):
        if count == 0:
            t_ranking = Table('ranking_week', metadata_obj, autoload_with=engine, autoload=True)

        if count == 1:
            t_ranking = Table('ranking_month', metadata_obj, autoload_with=engine, autoload=True)

        if count == 2:
            t_ranking = Table('ranking_close_soon', metadata_obj, autoload_with=engine, autoload=True)

        if t_ranking is None:
            raise Exception('No Ranking Full Url!!!')

        selectRankingQuery = select(t_ranking)

        resultRankingList = db.execute(selectRankingQuery)

        for resultRankingRecord in resultRankingList:
            rankingUrlList.append(resultRankingRecord['product_code'])

    return rankingUrlList


def commitProductDataList(productDataList):
    t_product = Table('product', metadata_obj, autoload_with=engine, autoload=True)

    isExist = isExistTable(t_product, productDataList['product_code'])

    if isExist:
        print('Already exist !!! \nproduct_code in product table ==>' + productDataList['product_code'])
    # print('product_isInfoCasting: ' + str(productDataList['product_isInfoCasting']))
    # print('product_age_isKorean: ' + str(productDataList['product_age_isKorean']))
    # print('product_isInfoTimeCasting: ' + str(productDataList['product_isInfoTimeCasting']))

    else:
        insertQuery = insert(t_product).values(product_code=productDataList['product_code'],
                                               product_url=productDataList['product_url'],
                                               product_title=productDataList['product_title'],
                                               product_category=productDataList['product_category'],
                                               product_thumb_poster_url=productDataList['product_thumb_poster_url'],
                                               product_detail_poster_url=productDataList['product_detail_poster_url'],
                                               product_casting_poster_url=productDataList['product_casting_poster_url'],
                                               product_location=productDataList['product_location'],
                                               product_detail_location=productDataList['product_detail_location'],
                                               product_period_start=productDataList['product_period_start'],
                                               product_period_end=productDataList['product_period_end'],
                                               product_age=productDataList['product_age'],
                                               product_age_is_korean=productDataList['product_age_isKorean'],
                                               product_time_min=productDataList['product_time_min'],
                                               product_time_break=productDataList['product_time_break'],
                                               product_is_info_casting=productDataList['product_isInfoCasting'],
                                               product_is_info_time_casting=productDataList[
                                                   'product_isInfoTimeCasting'],
                                               product_rate_average=0.0)

        commit_db(insertQuery)


# 중복 순위 데이터 처리하는 메서드
# 중복 데이터가 있다면 True, 그렇지 않으면 False 반환
def isExistTable(table_name, urlKey):
    # 테이블 연결
    # t_product = Table("product", metadata_obj, autoload_with=engine)
    # 중복된 데이터를 조회하는 구문 실행
    selectQuery = select(table_name).where(table_name.c.product_code == urlKey)
    resetSelectQuery = db.execute(selectQuery)

    # 중복 데이터가 있다면 True, 없다면 False
    for row in resetSelectQuery:
        if row:
            return True
    return False


def isExistTableForReserveTimeCasting(table_name, reserve_time_index):
    isExistQuery = select(table_name).where(table_name.c.reserve_time_index == reserve_time_index)
    resultExistQuery = db.execute(isExistQuery)

    # 중복 데이터가 있다면 True, 없다면 False
    for row in resultExistQuery:
        if row:
            return True
    return False


def isExistTableForReserveTimeSeatPrice(table_name, reserve_time_index):
    isExistQuery = select(table_name).where(table_name.c.reserve_time_index == reserve_time_index)
    resultExistQuery = db.execute(isExistQuery)

    # 중복 데이터가 있다면 True, 없다면 False
    for row in resultExistQuery:
        if row:
            return True
    return False


def commitReserveTimeDataList(reserveTimeDataList, product_code, product_category):
    t_reserve_time = Table('reserve_time', metadata_obj, autoload_with=engine, autoload=True)
    t_seat_price = Table('seat_price', metadata_obj, autoload_with=engine, autoload=True)

    isExist = isExistTable(t_reserve_time, product_code)

    if isExist:
        print('Already exist !!! \nproduct_code in reserve_time table ==>' + product_code)
    else:
        for reserveTimeDataRecord in reserveTimeDataList:
            # print(str(reserveTimeDataRecord))

            # selectSeatPrice = select(t_seat_price).where(
            #     t_seat_price.c.product_code == product_code)

            # resultSeatPrice = db.execute(selectSeatPrice)
            insertQuery = insert(t_reserve_time).values(
                reserve_time_date=reserveTimeDataRecord['reserve_time_date'],
                reserve_time=reserveTimeDataRecord['reserve_time'],
                reserve_time_hour=reserveTimeDataRecord['reserve_time_hour'],
                reserve_time_min=reserveTimeDataRecord['reserve_time_min'],
                # remain_quantity=reserveTimeDataRecord['remain_quantity'],
                # total_quantity=reserveTimeDataRecord['total_quantity'],
                reserve_time_turn=reserveTimeDataRecord['reserve_time_turn'],
                product_code=product_code,
                product_category=product_category)

            commit_db(insertQuery)


def commitReserveTimeCasting(reserveTimeDataList, product_code):
    t_reserve_time_casting = Table('reserve_time_casting', metadata_obj, autoload_with=engine, autoload=True)
    t_reserve_time = Table('reserve_time', metadata_obj, autoload_with=engine, autoload=True)
    t_casting = Table('casting', metadata_obj, autoload_with=engine, autoload=True)

    # casting_id = product_code + '1'

    # isExist = isExistTableForReserveTimeCasting(t_reserve_time_casting, casting_id)

    # if isExist:
    #     print('Already exist !!! \ncasting_id in reserve_time_casting table ==>' + casting_id)
    # else:
    for reserveTimeDataRecord in reserveTimeDataList:
        # print(str(reserveTimeDataRecord))

        selectReserveTimeQuery = select(t_reserve_time).where(t_reserve_time.c.product_code == product_code) \
            .where(t_reserve_time.c.reserve_time == reserveTimeDataRecord['reserve_time']) \
            .where(t_reserve_time.c.reserve_time_turn == reserveTimeDataRecord['reserve_time_turn'])

        resultReserveTime = db.execute(selectReserveTimeQuery)
        for resultReserveTimeRecord in resultReserveTime:
            # print(str(resultReserveTimeRecord))
            reserve_time_index = resultReserveTimeRecord['reserve_time_index']

            isExist = isExistTableForReserveTimeCasting(t_reserve_time_casting, reserve_time_index)

            if isExist:
                print('Already exist !!! \nreserve_time_index in reserve_time_casting table ==>' + str(
                    reserve_time_index))

            else:
                for reserveTimeActorRecord in reserveTimeDataRecord['reserveTimeActorList']:
                    character = reserveTimeActorRecord['Character']
                    actor = reserveTimeActorRecord['Actor']

                    selectCastingQuery = select(t_casting).where(t_casting.c.product_code == product_code) \
                        .where(t_casting.c.casting_character == character).where(t_casting.c.casting_actor == actor)

                    resultCasting = db.execute(selectCastingQuery)
                    for resultCastingRecord in resultCasting:
                        casting_id = resultCastingRecord['casting_id']
                        print('casting_id: ' + casting_id)

                        insertQuery = insert(t_reserve_time_casting).values(casting_id=casting_id,
                                                                            reserve_time_index=reserve_time_index)

                        commit_db(insertQuery)


def commitReserveTimeSeatPrice(product_code):
    t_reserve_time_seat_price = Table('reserve_time_seat_price', metadata_obj, autoload_with=engine, autoload=True)
    t_seat_price = Table('seat_price', metadata_obj, autoload_with=engine, autoload=True)
    t_reserve_time = Table('reserve_time', metadata_obj, autoload_with=engine, autoload=True)

    remain_quantity = 100
    total_quantity = 100

    selectReserveTimeQuery = select(t_reserve_time).where(t_reserve_time.c.product_code == product_code)

    resultReserveTime = db.execute(selectReserveTimeQuery)

    for resultReserveTimeRecord in resultReserveTime:
        reserve_time_index = resultReserveTimeRecord['reserve_time_index']

        isExist = isExistTableForReserveTimeSeatPrice(t_reserve_time_seat_price, reserve_time_index)

        if isExist:
            print(
                'Already exist !!! \nreserve_time_index in reserve_time_seat_price table ==>' + str(reserve_time_index))

        else:
            selectSeatPriceQuery = select(t_seat_price).where(t_seat_price.c.product_code == product_code)

            resultSeatPrice = db.execute(selectSeatPriceQuery)

            # 예매 시간 정보가 상시 상품일 경우
            if resultReserveTimeRecord['reserve_time_turn'] == 0:
                remain_quantity = 0
                total_quantity = 0

            for resultSeatPriceRecord in resultSeatPrice:
                seat_price_index = resultSeatPriceRecord['seat_price_index']

                insertQuery = insert(t_reserve_time_seat_price).values(reserve_time_index=reserve_time_index,
                                                                       seat_price_index=seat_price_index,
                                                                       remain_quantity=remain_quantity,
                                                                       total_quantity=total_quantity)

                commit_db(insertQuery)


def commitCasting(castingInfoTotalList, product_code):
    t_casting = Table('casting', metadata_obj, autoload_with=engine, autoload=True)

    isExist = isExistTable(t_casting, product_code)

    if isExist:
        print('Already exist !!! \nproduct_code in casting table ==>' + product_code)

    else:
        countOrder = 0
        for castingInfoList in castingInfoTotalList:
            countOrder = countOrder + 1
            casting_id = product_code + '_' + str(countOrder)
            insertQuery = insert(t_casting).values(casting_id=casting_id,
                                                   casting_character=castingInfoList[0],
                                                   casting_actor=castingInfoList[1],
                                                   casting_info_url=castingInfoList[2],
                                                   casting_img_url=castingInfoList[3],
                                                   casting_order=countOrder,
                                                   product_code=product_code)

            commit_db(insertQuery)


def commitSeatPriceDataList(seatPriceDataList, product_code):
    t_seat_price = Table('seat_price', metadata_obj, autoload_with=engine, autoload=True)

    isExist = isExistTable(t_seat_price, product_code)

    if isExist:
        print('Already exist !!! \nproduct_code in seat_price table ==>' + product_code)

    else:
        for seatPriceDataRecord in seatPriceDataList:
            if seatPriceDataRecord['price'] == '':
                print('if')
                break
            else:
                print('else')
                insertQuery = insert(t_seat_price).values(price=int(seatPriceDataRecord['price']),
                                                      seat=seatPriceDataRecord['seat'],
                                                      product_code=product_code)
            commit_db(insertQuery)


def commitStatisticsRecord(statisticsRecord):
    t_statistics = Table('statistics', metadata_obj, autoload_with=engine, autoload=True)

    product_code = statisticsRecord['product_code']

    isExist = isExistTable(t_statistics, product_code)

    if isExist:
        print('Already exist !!! \nproduct_code in statistics table ==>' + product_code)

    else:
        insertQuery = insert(t_statistics).values(statistics_female=statisticsRecord['statistics_female'],
                                                  statistics_male=statisticsRecord['statistics_male'],
                                                  statistics_teen=statisticsRecord['statistics_teen'],
                                                  statistics_twenties=statisticsRecord['statistics_twenties'],
                                                  statistics_thirties=statisticsRecord['statistics_thirties'],
                                                  statistics_forties=statisticsRecord['statistics_forties'],
                                                  statistics_fifties=statisticsRecord['statistics_fifties'],
                                                  product_code=product_code)
        commit_db(insertQuery)


def isExistInTable(product_code):
    t_seat_price = Table('seat_price', metadata_obj, autoload_with=engine, autoload=True)
    t_product = Table('product', metadata_obj, autoload_with=engine, autoload=True)
    t_reserve_time = Table('reserve_time', metadata_obj, autoload_with=engine, autoload=True)

    existSeatPrice = isExistTable(t_seat_price, product_code)
    existProduct = isExistTable(t_product, product_code)
    existReserveTime = isExistTable(t_reserve_time, product_code)

    if existSeatPrice and existProduct and existReserveTime:
        return True
    else:
        return False


def crawlingRankingFromDBMain(count, rankingDataList):
    t_table = ''

    if count == 0:
        # rankingDataList['product_ranking_category'] = 'Week'
        t_table = Table('ranking_week', metadata_obj, autoload_with=engine, autoload=True)

    # 월간 랭킹
    if count == 1:
        # rankingDataList['product_ranking_category'] = 'Month'
        t_table = Table('ranking_month', metadata_obj, autoload_with=engine, autoload=True)

    # 곧 종료 예정 랭킹
    if count == 2:
        # rankingDataList['product_ranking_category'] = 'CloseSoon'
        t_table = Table('ranking_close_soon', metadata_obj, autoload_with=engine, autoload=True)
    isSearchableColumn = ['READY', 'SCHEDULED']
    # selectQuery = select(t_table).where(t_table.c.ranking_status).exists(isSearchableColumn)
    selectQuery = select(t_table).where((t_table.c.ranking_status == 'READY') | (t_table.c.ranking_status == 'SCHEDULED'))
    print(selectQuery)
    # .where(t_table.c.ranking_status == 'SCHEDULED')

    resultSelectQuery = db.execute(selectQuery)

    for resultSelectDataRecord in resultSelectQuery:
        rankingDataRecord = {}
        rankingDataRecord['product_code'] = copy.deepcopy(resultSelectDataRecord['product_code'])
        rankingDataRecord['product_category'] = copy.deepcopy(resultSelectDataRecord['ranking_category'])
        rankingDataList.append(rankingDataRecord)
