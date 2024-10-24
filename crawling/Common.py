import os
import traceback

from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.chrome.webdriver import WebDriver
from webdriver_manager.chrome import ChromeDriverManager

from selenium.common import TimeoutException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from sqlalchemy import Table, insert, select, delete, and_, ClauseElement, Executable, CursorResult, Result, Select
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import MetaData
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import IntegrityError

import configparser
import sqlalchemy

import Constants_Rank
from DataClass import ProductInfo, CategoryType, RankInfo, RankStatus, ProductInfoList, CommitInfo, CommitMessage

# 설정값 읽기
config = configparser.ConfigParser()
config.read('config.ini')

SQLALCHEMY_DB_URL = config['DEFAULT']['SQLALCHEMY_DB_URL']

# DB와 연결
engine = sqlalchemy.create_engine(SQLALCHEMY_DB_URL, echo=False, pool_recycle=30)

# Session 생성
metadata_obj = MetaData()
SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()

Base = declarative_base()


# 크롬 브라우저 옵션 설정 및 실행 메서드
def init_chrome_browser() -> WebDriver:
    # <<< 크롬 옵션 설정 >>> #
    chromeOptions = ChromeOptions()
    chromeOptions.add_argument('--headless')
    chromeOptions.add_argument('--window-size=1280,720')
    chromeOptions.add_argument('--no-sandbox')
    chromeOptions.add_argument(
        "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3")

    chromeService = ChromeService(executable_path=ChromeDriverManager().install())

    # <<< 크롬 브라우저 실행 >>> #
    browser = webdriver.Chrome(service=chromeService, options=chromeOptions)

    return browser


# 주어진 요소가 발생할 때 까지 대기하는 메서드
def waitUntilElementLocated(browser, waitTime, byKey, byPath):
    if not isinstance(waitTime, int):
        print_log('time이 올바른 값이 아닙니다')
    if not isinstance(byKey, str):
        print_log('byeKey가 올바른 값이 아닙니다')
        return False
    if not isinstance(byPath, str):
        print_log('byPath가 올바른 값이 아닙니다')
        return False
    else:
        # 해당 태그가 나타날 때 까지 대기
        try:
            WebDriverWait(browser, 10).until(EC.presence_of_element_located((byKey, byPath)))
        except TimeoutException as te:
            log_error(te, f"Error!!! TimeOutException! byKey: {byKey} byPath: {byPath}")
            browser.quit()
            return False
        except Exception as e:
            log_error(e, f'Error!!! Exception! byKey: {byKey} byPath: {byPath}')
            # traceback.print_exc()
            browser.quit()
            return False
    return True


# 엔진 생성 메서드, 테이블 생성 확인
def createEngine():
    Base.metadata.create_all(engine)
    print_log('테이블 생성 성공')


# Statement를 Commit
def commit_query(stmt: Executable) -> CommitInfo:
    commit_info = CommitInfo()
    try:
        # print_log('COMMIT_DB : Start')
        db.execute(stmt)
        db.commit()
        # print_log('COMMIT_DB : Success')
        commit_info.is_committed = True
        commit_info.message = None
        return commit_info
    # 오류 발생 -> 롤백
    # 멈출때 대비 계속 요청
    except IntegrityError as e:
        log_error(e, f"IntegrityError {e}")
        db.rollback()
        errorDict = extract_error_code(e)
        # 오류 코드가 1062이면 생략
        if errorDict['errorCode'] == 1062:
            log_error(e, 'PASS : errorCode 1062')
            commit_info.is_committed = False
            commit_info.message = CommitMessage.DUPLICATE.value
            return commit_info
        else:
            log_error(e, f"FAIL : IntegrityError - {errorDict['errorCode']}")
            commit_info.is_committed = False
            commit_info.message = CommitMessage.INTEGRITY.value
            return commit_info
    # 오류 발생 생략
    except Exception as ex:
        log_error(ex, f"Unexpected error : {ex}")
        db.rollback()
        commit_info.is_committed = False
        commit_info.message = CommitMessage.UNEXPECTED.value
        return commit_info
    # DB 연결 끊기
    finally:
        if db.in_transaction():
            db.rollback()


# Statement를 Commit, first() 불러옴
def commit_query_result(stmt: Executable) -> CommitInfo:
    commit_info = CommitInfo()
    try:
        result: Result = db.execute(stmt)
        db.commit()  # SELECT 쿼리의 경우 이 줄은 필요 없을 수 있습니다.

        # 불러온 데이터 저장
        commit_info.result = result.all()
        commit_info.message = None
        return commit_info
    except Exception as ex:
        log_error(ex, f"Unexpected error: {ex}")
        db.rollback()  # SELECT 쿼리의 경우 이 줄은 필요 없을 수 있습니다.
        commit_info.result = None
        commit_info.message = CommitMessage.UNEXPECTED.value
        return commit_info
    finally:
        if db.in_transaction():
            db.rollback()


# 에러 코드 추출하는 메서드
def extract_error_code(e):
    # 딕셔너리 생성
    errorMessage = ''
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


def commit_update_rank_status(product_info: ProductInfo, rank_status: RankStatus) -> None:
    print_log('상품 상태 갱신 쿼리')

    for category_type in CategoryType:
        t_rank = Table(category_type.table_name, metadata_obj, autoload_with=engine)
        update_query = t_rank.update().where(t_rank.c.product_code == product_info.code) \
            .where(t_rank.c.ranking_category == product_info.category) \
            .values(ranking_status=rank_status.name)
        print_log(f"UPDATE COMMIT {category_type.table_name} Table WHERE "
                  f"product_code = {product_info.code} AND product_category = {product_info.category} "
                  f"VALUES ranking_status = {rank_status.name}")

        # Commit
        commit_query(update_query)


def commit_category_rank_url(rank_info: RankInfo) -> None:
    """
    파싱된 랭킹 정보를 데이터베이스에 저장하고 관리하는 메서드

    rank_info에 저장된 상품 코드 목록을 데이터베이스의 랭킹 테이블과 비교하여
    추가, 갱신, 삭제 작업을 수행합니다.

    동작 프로세스:
        1. 랭킹 테이블 초기화
        2. 각 상품 코드에 대해:
            - 데이터베이스에 없는 경우: 신규 등록 (READY 상태)
            - 데이터베이스에 있는 경우:
                * 순위가 변경된 경우: 순위 정보 업데이트
                * 랭킹에서 제외된 경우: 데이터베이스에서 삭제
        3. 현재 랭킹에 없는 높은 순위의 기존 데이터 삭제

    Args:
        rank_info: 카테고리 정보와 상품 코드 목록이 포함된 RankInfo 객체
            - table_name: 대상 테이블명
            - category: 랭킹 카테고리
            - code_list: 상품 코드 목록

    Raises:
        SQLAlchemyError: 데이터베이스 작업 중 오류 발생 시
        Exception: 쿼리 실행 결과가 예상과 다른 경우
    """

    # 커밋 SqlAlchemy Table 초기화
    t_ranking = Table(rank_info.table_name, metadata_obj, autoload_with=engine)

    # code 리스트 전체 개수 추출
    total_count_code_list = len(rank_info.code_list)

    # 커밋 code 개수, category, table name 출력
    print_log(f"커밋할 url_list 개수: {total_count_code_list}")
    print_log(f"category : {rank_info.category}\t Table name : {rank_info.table_name}")

    # for문 카운트
    current_order = 0

    # code 리스트 순회
    for code in rank_info.code_list:
        # 카운트 수 증가
        current_order = current_order + 1
        # 현 code 및 index 확인
        print_log(f"code {code}\t index: {current_order}")

        # DB 조회 SELECT 문
        # DB에 불러와서 중복여부, 추가, 갱신 판단
        select_query = (
            select(t_ranking)
            .where(t_ranking.c.ranking_category == rank_info.category)
            .where(t_ranking.c.ranking_order == current_order)
        )

        print_log(f"SELECT COMMIT WHERE Ranking Table : {rank_info.table_name}\t"
                  f"WHERE Table : {rank_info.category}\t"
                  f"Ranking Order : {current_order}")

        # COMMIT 및 조회 데이터 저장
        commit_result_list = commit_query_result(select_query).result

        print_log(f"COMMIT RESULT LIST : {commit_result_list}")

        # DB가 조회 안된다면
        if commit_result_list is None:
            print_log('DB 조회 실패')
            return

        # 데이터 조회가 안된다면 추가 커밋 준비, 상태는 READY
        elif not commit_result_list:
            insert_query = insert(t_ranking).values(ranking_order=current_order,
                                                    ranking_category=rank_info.category,
                                                    product_code=str(code),
                                                    ranking_status=RankStatus.READY.name)
            print_log(f"INSERT COMMIT Ranking Table"
                      f"ranking_order = {current_order}\t"
                      f"ranking_category = {rank_info.category}\t"
                      f"product_code = {code}\t"
                      f"ranking_status = READY")

            commit_query(insert_query)

        # 중복이고 중복 code가 DB에 존재하면 순위 정보만 갱신
        # 없다면 DB에서 제거
        elif commit_result_list:
            for commit_result in commit_result_list:
                # 조회 했으나 찾으려는 code가 아니면 중복된 code로 판단
                if commit_result.product_code != code:
                    # 중복 code가 파싱한 인터파크 랭킹 순위에 있으면
                    # 해당 code의 순위만 update 및 commit
                    if commit_result.product_code in rank_info.code_list:
                        update_code_index = rank_info.code_list.index(commit_result.product_code) + 1
                        update_query = t_ranking.update().where(t_ranking.c.ranking_order == current_order) \
                            .where(t_ranking.c.ranking_category == rank_info.category) \
                            .where(t_ranking.c.product_code == commit_result.product_code) \
                            .values(ranking_order=update_code_index,
                                    ranking_category=rank_info.category,
                                    product_code=commit_result.product_code,
                                    ranking_status=commit_result.ranking_status)
                        commit_query(update_query)

                    # 해당 code가 DB에 없으면 delete commit
                    else:
                        delete_query = (t_ranking.delete()
                                        .where(t_ranking.c.ranking_category == rank_info.category)
                                        .where(t_ranking.c.ranking_order == current_order)
                                        .where(t_ranking.c.product_code == commit_result.product_code))
                        print_log(f"DELETE COMMIT Ranking Table WHERE "
                                  f"ranking_category = {rank_info.category}\t"
                                  f"ranking_order == {current_order}\t"
                                  f"product_code == {commit_result.product_code}")
                        commit_query(delete_query)

        # 동일하면 No Commit
        else:
            print_log(Constants_Rank.error_msg_no_query)

    # 조회된 code 개수보다 순서가 높으면 제거
    delete_query = (t_ranking.delete()
                    .where(t_ranking.c.ranking_category == rank_info.category)
                    .where(t_ranking.c.ranking_order > total_count_code_list))
    print_log(f"DELETE COMMIT Ranking Table WHERE "
              f"ranking_category = {rank_info.category}\t"
              f"ranking_order > {total_count_code_list}\t")

    # COMMIT
    commit_query(delete_query)


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

        print_log(f"SELECT FROM {t_ranking} Table")

        resultRankingList = db.execute(selectRankingQuery)

        for resultRankingRecord in resultRankingList:
            rankingUrlList.append(resultRankingRecord['product_code'])

    return rankingUrlList


def commitProductDataList(product_info: ProductInfo):
    t_product = Table('product', metadata_obj, autoload_with=engine)

    isExist = isExistTable(t_product, product_info.code)

    if isExist:
        print_log(f"이미 Product 테이블에 존재 : Product Code : {product_info.code}")


    else:
        insertQuery = insert(t_product).values(product_code=product_info.code,
                                               product_url=product_info.url,
                                               product_title=product_info.title,
                                               product_category=product_info.category,
                                               product_thumb_poster_url=product_info.thumbnail_url,
                                               product_detail_poster_url=product_info.desc_poster_url,
                                               product_casting_poster_url=product_info.casting_poster_url,
                                               product_location=product_info.location,
                                               product_detail_location=product_info.detail_location,
                                               product_period_start=product_info.period_start,
                                               product_period_end=product_info.period_end,
                                               product_age=product_info.age_num,
                                               product_age_is_korean=product_info.age_kor,
                                               product_time_min=product_info.perf_time,
                                               product_time_break=product_info.intermission,
                                               product_is_info_casting=product_info.is_casting,
                                               product_is_info_time_casting=product_info.is_detail_casting,
                                               product_rate_average=0.0)

        print_log(f"INSERT COMMIT TO Product 테이블 : "
                  f"product_code : {product_info.code}\t"
                  f"product_url : {product_info.url}\t"
                  f"product_title : {product_info.title}\t"
                  f"product_category : {product_info.category}\t"
                  f"product_thumb_poster_url : {product_info.thumbnail_url}\t"
                  f"product_detail_poster_url : {product_info.desc_poster_url}\t"
                  f"product_casting_poster_url : {product_info.casting_poster_url}\t"
                  f"product_location : {product_info.location}\t"
                  f"product_detail_location : {product_info.detail_location}\t"
                  f"product_period_start : {product_info.period_start}\t"
                  f"product_period_end : {product_info.period_end}\t"
                  f"product_age : {product_info.age_num}\t"
                  f"product_age_is_korean : {product_info.age_kor}\t"
                  f"product_time_min: {product_info.perf_time}\t"
                  f"product_time_break: {product_info.intermission}\t"
                  f"product_is_info_casting : {product_info.is_casting}\t"
                  f"product_is_info_time_casting : {product_info.is_detail_casting}\t"
                  f"product_rate_average : 0.0\t")

        commit_query(insertQuery)


# 중복 순위 데이터 처리하는 메서드
# 중복 데이터가 있다면 True, 그렇지 않으면 False 반환
def isExistTable(table_name, urlKey):
    # 테이블 연결
    # 중복된 데이터를 조회하는 구문 실행
    selectQuery = select(table_name).where(table_name.c.product_code == urlKey)
    print_log(f"SELECT COMMIT {table_name} Table "
              f"WHERE product_code : {urlKey} ")
    resetSelectQuery = db.execute(selectQuery)

    # 중복 데이터가 있다면 True, 없다면 False
    for row in resetSelectQuery:
        if row:
            return True
    return False


def isExistTableForReserveTimeCasting(table_name, reserve_time_index):
    isExistQuery = select(table_name).where(table_name.c.reserve_time_index == reserve_time_index)
    print_log(f"SELECT COMMIT FROM {table_name} TABLE WHERE reserve_time_index : {reserve_time_index}")
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


def commitReserveTimeDataList(product_info: ProductInfo) -> None:
    t_reserve_time = Table('reserve_time', metadata_obj, autoload_with=engine)

    isExist = isExistTable(t_reserve_time, product_info.code)

    if isExist:
        print_log(f"이미 ReverseTime 테이블에 존재 : Product Code : {product_info.code}")
    else:
        for detail_casting_time_info in product_info.detail_casting_time_info_list:

            insertQuery = insert(t_reserve_time).values(
                reserve_time_date=detail_casting_time_info.date,
                reserve_time=detail_casting_time_info.time_datetime,
                reserve_time_hour=detail_casting_time_info.hour,
                reserve_time_min=detail_casting_time_info.min,
                reserve_time_turn=detail_casting_time_info.turn,
                product_code=product_info.code,
                product_category=product_info.category,)

            print_log(f"INSERT COMMIT TO ReverseTime Table : "
                      f"product_code : {product_info.code}\t"
                      f"product_category : {product_info.category}\t"
                      f"reserve_time_turn : {detail_casting_time_info.turn}\t"
                      f"reserve_time_date : {detail_casting_time_info.date}\t"
                      f"reserve_time : {detail_casting_time_info.time_datetime}\t"
                      f"reserve_time_hour : {detail_casting_time_info.hour}\t"
                      f"reserve_time_min : {detail_casting_time_info.min}\t")

            commit_query(insertQuery)


def commitReserveTimeCasting(product_info: ProductInfo) -> None:
    t_reserve_time_casting = Table('reserve_time_casting', metadata_obj, autoload_with=engine)
    t_reserve_time = Table('reserve_time', metadata_obj, autoload_with=engine)
    t_casting = Table('casting', metadata_obj, autoload_with=engine)

    for detail_casting_time_info in product_info.detail_casting_time_info_list:

        selectReserveTimeQuery = select(t_reserve_time).where(t_reserve_time.c.product_code == product_info.code) \
            .where(t_reserve_time.c.reserve_time == detail_casting_time_info.time_datetime) \
            .where(t_reserve_time.c.reserve_time_turn == detail_casting_time_info.turn)

        print_log(
            f"SELECT COMMIT ReserveTime TABLE WHERE product_code : {product_info.code} "
            f"reserve_time : {detail_casting_time_info.time_datetime} "
            f"reserve_time_turn : {detail_casting_time_info.turn} ")

        resultReserveTime = commit_query_result(selectReserveTimeQuery).result
        for resultReserveTimeRecord in resultReserveTime:
            reserve_time_index = resultReserveTimeRecord.reserve_time_index

            isExist = isExistTableForReserveTimeCasting(t_reserve_time_casting, reserve_time_index)

            if isExist:
                print_log(f"이미 ReverseTimeCasting 테이블에 존재 : ReverseTimeIndex : {reserve_time_index}")

            else:
                for detail_casting_acting_info in detail_casting_time_info.detail_casting_acting_info_list:

                    character = detail_casting_acting_info.character
                    actor = detail_casting_acting_info.actor

                    selectCastingQuery = select(t_casting).where(t_casting.c.product_code == product_info.code) \
                        .where(t_casting.c.casting_character == character).where(t_casting.c.casting_actor == actor)

                    print_log(f"SELECT COMMIT Casting TABLE WHERE "
                              f"product_code : {product_info.code} casting_character : {character} casting_actor : {actor}")

                    resultCasting = commit_query_result(selectCastingQuery).result
                    for resultCastingRecord in resultCasting:
                        print_log(f"resultCastingRecord: {resultCastingRecord}")
                        casting_id = resultCastingRecord.casting_id
                        insertQuery = insert(t_reserve_time_casting).values(casting_id=casting_id,
                                                                            reserve_time_index=reserve_time_index)
                        print_log(f"INSERT COMMIT TO ReverseTimeCasting Table "
                                  f"Casting_id : {casting_id} "
                                  f"reserve_time_index : {reserve_time_index}")
                        commit_query(insertQuery)


def commitReserveTimeSeatPrice(product_info: ProductInfo) -> None:
    t_reserve_time_seat_price = Table('reserve_time_seat_price', metadata_obj, autoload_with=engine)
    t_seat_price = Table('seat_price', metadata_obj, autoload_with=engine)
    t_reserve_time = Table('reserve_time', metadata_obj, autoload_with=engine)

    remain_quantity = 100
    total_quantity = 100

    selectReserveTimeQuery = select(t_reserve_time).where(t_reserve_time.c.product_code == product_info.code)
    print_log(f"SELECT COMMIT ReserveTime TABLE WHERE Product Code : {product_info.code}")

    resultReserveTimeList = commit_query_result(selectReserveTimeQuery).result

    for resultReserveTimeRecord in resultReserveTimeList:
        reserve_time_index = resultReserveTimeRecord.reserve_time_index

        isExist = isExistTableForReserveTimeSeatPrice(t_reserve_time_seat_price, reserve_time_index)

        if isExist:
            print_log(f"이미 ReserveTimeSeatPrice 테이블에 존재 : ReserveTimeIndex : {reserve_time_index}")

        else:
            selectSeatPriceQuery = select(t_seat_price).where(t_seat_price.c.product_code == product_info.code)

            print_log(f"SELECT COMMIT SeatPrice TABLE WHERE Product Code : {product_info.code}")
            resultSeatPrice = commit_query_result(selectSeatPriceQuery).result

            # 예매 시간 정보가 상시 상품일 경우
            if resultReserveTimeRecord.reserve_time_turn == 0:
                print_log(f"예매 시간 정보가 상시 상품")
                remain_quantity = 0
                total_quantity = 0

            for resultSeatPriceRecord in resultSeatPrice:
                seat_price_index = resultSeatPriceRecord.seat_price_index

                insertQuery = insert(t_reserve_time_seat_price).values(reserve_time_index=reserve_time_index,
                                                                       seat_price_index=seat_price_index,
                                                                       remain_quantity=remain_quantity,
                                                                       total_quantity=total_quantity)
                print_log(f"INSERT COMMIT TO ReverseTimeSeatPrice 테이블 "
                          f"reserve_time_index : {reserve_time_index} "
                          f"seat_price_index : {seat_price_index} "
                          f"remain_quantity : {remain_quantity}"
                          f"total_quantity : {total_quantity}")

                commit_query(insertQuery)


def commitCasting(product_info: ProductInfo):
    t_casting = Table('casting', metadata_obj, autoload_with=engine)

    isExist = isExistTable(t_casting, product_info.code)

    if isExist:
        print_log(f"이미 Casting 테이블에 존재 : Product Code : {product_info.code}")

    else:
        countOrder = 0
        for casting_info in product_info.casting_info_list:
            countOrder = countOrder + 1
            casting_id = product_info.code + '_' + str(countOrder)
            print_log(f"INSERT COMMIT TO Casting 테이블: Product Code/Casting_id {product_info.code} : {casting_id}")
            insertQuery = insert(t_casting).values(casting_id=casting_id,
                                                   casting_character=casting_info.character,
                                                   casting_actor=casting_info.actor,
                                                   casting_info_url=casting_info.info_url,
                                                   casting_img_url=casting_info.img_url,
                                                   casting_order=countOrder,
                                                   product_code=product_info.code)

            commit_query(insertQuery)


def commitSeatPriceDataList(product_info: ProductInfo) -> None:
    t_seat_price = Table('seat_price', metadata_obj, autoload_with=engine)

    isExist = isExistTable(t_seat_price, product_info.code)

    if isExist:
        print_log(f"이미 SeatPrice 테이블에 존재 : Product Code : {product_info.code}")

    else:
        for seat_price_info in product_info.seat_price_info_list:
                print_log(
                    f"INSERT COMMIT TO SeatPrice 테이블: Product Code/SeatPrice(Price):(Seat) {product_info.code} : {seat_price_info.price}:{seat_price_info.seat}")
                insertQuery = insert(t_seat_price).values(price=seat_price_info.price,
                                                          seat=seat_price_info.seat,
                                                          product_code=product_info.code)
                commit_query(insertQuery)


def commitStatisticsRecord(product_info: ProductInfo) -> None:
    t_statistics = Table('statistics', metadata_obj, autoload_with=engine)

    isExist = isExistTable(t_statistics, product_info.code)

    if isExist:
        print_log(f"이미 Statistics 테이블에 존재 : Product Code : {product_info.code}")

    else:
        insertQuery = insert(t_statistics).values(statistics_female=product_info.statistics_info.female,
                                                  statistics_male=product_info.statistics_info.male,
                                                  statistics_teen=product_info.statistics_info.teen,
                                                  statistics_twenties=product_info.statistics_info.twenty,
                                                  statistics_thirties=product_info.statistics_info.thirty,
                                                  statistics_forties=product_info.statistics_info.forty,
                                                  statistics_fifties=product_info.statistics_info.fifty,
                                                  product_code=product_info.code)

        print_log(f"INSERT COMMIT TO Statistics 테이블 : "
                  f"statistics_female : {product_info.statistics_info.female},"
                  f"statistics_male : {product_info.statistics_info.male},"
                  f"statistics_teen : {product_info.statistics_info.teen},"
                  f"statistics_twenties : {product_info.statistics_info.twenty},"
                  f"statistics_thirties : {product_info.statistics_info.thirty},"
                  f"statistics_forties : {product_info.statistics_info.forty},"
                  f"statistics_fifties : {product_info.statistics_info.fifty}"
                  f"product_code: {product_info.code}")
        commit_query(insertQuery)


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


def bring_code_from_db(category_type: CategoryType, product_info_list: ProductInfoList) -> None:
    """
    DB에서 불러온 파싱할 URL 목록을 담아서 ProductInfoList에 저장

    Args:
        category_type: 상품 타입 구분
        product_info_list: 저장할 데이터 담을 product_info 타입의 list
    """
    product_info = ProductInfo()
    t_table_name = ''
    # 커밋 SqlAlchemy Table 초기화
    t_table = Table(category_type.table_name, metadata_obj, autoload_with=engine)

    # Ready 상태이거나 Schedule 상태 Select
    select_query = select(t_table).where(
        (t_table.c.ranking_status == RankStatus.READY.name) | (t_table.c.ranking_status == RankStatus.SCHEDULED.name)
    )
    print_log(f"SELECT COMMIT {t_table_name} WHERE ranking_status = READY OR SCHEDULED")
    commit_result_list = commit_query_result(select_query).result

    for commit_result in commit_result_list:
        product_info.code = commit_result.product_code
        product_info.category = commit_result.ranking_category
        product_info_list.append(product_info)
        print_log(f"파싱 데이터 추가 : product_info_list.append({product_info})")


def log_error(e, *args):
    tb = traceback.extract_tb(e.__traceback__)
    searchFile = extract_filename(traceback.extract_stack())
    msg = ''
    for frame in tb:
        filename, line, func, text = frame

        if filename == searchFile:
            if args:
                msg = args[0] + '\n'

            print(f"ERROR\t{func}\t\t\t{msg} ERROR FROM File '{os.path.basename(filename)}', "
                  f"Function '{func}', Line {line}: {text}")
            break


def extract_filename(stack):
    stack = traceback.extract_stack()
    filename, line, func, text = stack[-3]
    return filename


def print_log(input_msg):
    stack = traceback.extract_stack()
    msg = ''
    filename, line, func, text = stack[-2]
    if input_msg:
        msg = str(input_msg) + '\t\t'
    print(f"LOG\t\t{func}\t\t\t{msg} FROM File '{os.path.basename(filename)}', "
          f"Function '{func}', Line {line}")
