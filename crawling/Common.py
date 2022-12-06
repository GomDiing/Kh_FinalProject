import time
import traceback

from selenium import webdriver

from selenium.common import TimeoutException, NoSuchElementException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from sqlalchemy import MetaData, Table, insert, select
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
engine = sqlalchemy.create_engine(SQLALCHEMY_DB_URL, echo=False)

# Session 생성
metadata_obj = MetaData(bind=engine)
SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()

Base = declarative_base()


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
    totalCount = len(currentUrlKeyList)

    # 카테고리 추출
    category = rankingDataList['product_ranking_category']

    # for 문 인덱스 선언
    currentOrder = 0

    print(table_name)
    # url 리스트 순회
    for urlKey in currentUrlKeyList:
        print('===============================')
        print('urlKey ' + urlKey)
        # 해당 데이터 DB 테이블의 존재 여부 확인 변수
        # isTrue = False

        # 해당 카테고리와 해당 url이 있는 레코드의 순서(order) 컬럼 추출 쿼리문
        selectQuery = select(t_ranking.c.ranking_order).where(t_ranking.c.ranking_category == category) \
            .where(t_ranking.c.product_code == urlKey)

        print(selectQuery)
        # 쿼리문 실행
        resultSelectQuery = db.execute(selectQuery)

        tableOrder = 0

        # 동일하지 않으면 기존 영화 정보를 갱신
        # print(resultSelectQuery)
        time.sleep(0.1)
        for row in resultSelectQuery:
            tableOrder = row['ranking_order']
            # print(str(row))
            print('tableOrder = ' + str(tableOrder))

        if tableOrder != currentOrder or tableOrder != 0:
            # isTrue = True
            print('Update Query!!!' + urlKey)
            updateQuery = t_ranking.update().where(t_ranking.c.ranking_order == currentOrder) \
                .values(ranking_order=currentOrder, ranking_category=category, product_code=str(urlKey))

            # Commit
            commit_db(updateQuery)

        # 조회되지 않는다면 응답 영화 데이터 추가
        # if isTrue is False:
        if tableOrder == 0:
            print("Insert Query!!!" + urlKey)

            insertQuery = insert(t_ranking).values(ranking_order=currentOrder,
                                                   ranking_category=category,
                                                   product_code=str(urlKey))

            commit_db(insertQuery)
            isTrue = True

        # 응답 url 제품 정보가 테이블에 있는지 확인
        # 없다면 제품 정보를 요청해서 테이블에 추가
        # if isExistProduct(urlKey) == True:
        #     pass
        # else:
        #     crawlingInterparkPage(urlKey)

        # 카운트 수 증가
        currentOrder += 1
        print('currentOrder = ' + str(currentOrder))
        print('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')


def commitProductDataList(productDataList):
    t_product = Table('product', metadata_obj, autoload_with=engine, autoload=True)

    print('product_isInfoCasting: ' + str(productDataList['product_isInfoCasting']))
    print('product_age_isKorean: ' + str(productDataList['product_age_isKorean']))
    print('product_isInfoTimeCasting: ' + str(productDataList['product_isInfoTimeCasting']))

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
                                           product_is_info_time_casting=productDataList['product_isInfoTimeCasting'],
                                           product_rate_average=0.0)

    commit_db(insertQuery)


# 중복 순위 데이터 처리하는 메서드
# 중복 데이터가 있다면 True, 그렇지 않으면 False 반환
def isExistProduct(urlKey):
    # 테이블 연결
    t_product = Table("product", metadata_obj, autoload_with=engine)
    # 중복된 데이터를 조회하는 구문 실행
    selectQuery = select(t_product).where(t_product.c.product_code == urlKey)
    resetSelectQuery = db.execute(selectQuery)

    # 중복 데이터가 있다면 True, 없다면 False
    for row in resetSelectQuery:
        if row:
            return True
    return False
