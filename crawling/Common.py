import traceback

from selenium import webdriver

from selenium.common import TimeoutException, NoSuchElementException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import MetaData
from sqlalchemy.orm import sessionmaker
from sqlalchemy.exc import IntegrityError

from crawling import Constants
import configparser
import sqlalchemy


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