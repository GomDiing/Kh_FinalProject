from dataclasses import dataclass, field
from enum import Enum
from typing import List, Optional, Any

import datetime

from selenium.webdriver.remote.webelement import WebElement

import Constants_Rank


@dataclass
class CalendarNextMonth:
    is_next_month_disabled : bool = False
    button_next_month : WebElement = None

@dataclass
class CalendarInfo:
    muted_count: int = None
    current_year_month: str = None
    possible_days_list: List[str] = field(default_factory=list)


class NaviTab(Enum):
    INFO = "공연정보"
    INFO_V2 = "이용정보"
    CASTING = "캐스팅정보"


class AgeInfo(Enum):
    PRE_SCHOOL = ("미취학아동입장불가", "미취학아동입장불가", 6)
    ABOVE_ELEMENTARY = ("초등학생이상", "한국", 8)
    MIDDLE_SCHOOL = ("중학생이상", "한국", 14)
    HIGH_SCHOOL = ("고등학생이상", "한국", 17)
    TOTAL = ("-", "전체", 0)

    def __init__(self, age_desc, age_type, age_num):
        self._age_desc = age_desc
        self._age_type = age_type
        self.age_num = age_num

    @property
    def age_desc(self):
        return self._age_desc

    @classmethod
    def from_string(cls, value):
        for member in cls:
            if member.value[0] == value:
                return member
        return None

class PeriodInfo(Enum):
    OPENRUN = "오픈런"

class DetailLocationInfo(Enum):
    NOT_PAGE = "NOT PAGE"

class GeneralCategory(Enum):
    PLACE = "장소"
    PERIOD = "공연기간"
    PERIOD_V2 = "기간"
    TIME = "공연시간"
    AGE = "관람연령"


@dataclass
class SeatPriceInfo:
    seat: str = None
    price: int = None

@dataclass
class SeatPriceInfoList(list):
    def append(self, seat_price_info):
        if not isinstance(seat_price_info, SeatPriceInfo):
            raise TypeError(Constants_Rank.error_msg_typeerror)
        super().append(seat_price_info)

    def __repr__(self):
        return f"SeatPriceInfoList({super().__repr__()})"

class LimitedAlways(Enum):
    CLOSE = ("판매종료", "close")
    ALWAYS = ("상시상품", "always")
    LIMITED = ("한정상품", "limited")
    RELEASE = ("판매예정", "not_open")
    NOTIFY_TICKET = ("티켓오픈안내", "not_open")

    def __init__(self, status_desc, status_name):
        self._status_desc = status_desc
        self.status_name = status_name

    @property
    def status_desc(self):
        return self._status_desc


class CommitMessage(Enum):
    DUPLICATE = "duplicate"
    INTEGRITY = "integrity"
    UNEXPECTED = "unexpected"


@dataclass
class CommitInfo:
    is_committed: bool = False
    result:Optional[Any] = None
    message: str = None


class RankStatus(Enum):
    """
    페이지 파싱 상태 단계
    READY = 페이지 URL만 저장
    SCHEDULED = 예약 페이지가 준비 중
    END =
    COMPLETED = 파싱 완료
    """
    READY = 1
    SCHEDULED = 2
    END = 3
    COMPLETE = 4


class CategoryType(Enum):
    WEEK = ("WEEK", "&Sort=2", "ranking_week")
    MONTH = ("MONTH", "&Sort=3", "ranking_month")
    CLOSE_SOON = ("CLOSE_SOON", "&Sort=5", "ranking_close_soon")

    def __init__(self, display_name, url_suffix, table_name):
        self._display_name = display_name
        self.url_suffix = url_suffix
        self.table_name = table_name

    @property
    def display_name(self):
        return self._display_name


class Category(Enum):
    MUSICAL = ("MUSICAL", "?Ca=Mus")
    DRAMA = ("DRAMA", "?Ca=Dra")
    CLASSIC = ("CLASSIC", "?Ca=Cla&SubCa=ClassicMain")
    EXHIBITION = ("EXHIBITION", "?Ca=Eve&SubCa=Eve_O")

    def __init__(self, display_name, url_suffix):
        self._display_name = display_name
        self.url_suffix = url_suffix

    @property
    def display_name(self):
        return self._display_name


@dataclass
class BaseURL:
    base_url: str = 'https://ticket.interpark.com/TPGoodsList.asp'


@dataclass
class DetailCastingCharOnlyInfo:
    """
    상세 캐스팅 배우 정보
    """
    character: str = None


@dataclass
class DetailCastingActingInfo:
    character: str = None
    actor: str = None


@dataclass
class DetailCastingTimeInfo:
    """
    상세 캐스팅 시간 정보
    회차별 시간 포함
    """
    turn: int = None  # 회차
    year: int = None  # 연도
    month: int = None  # 월
    day: int = None  # 일
    date: str = None # 연/월/일(yyyy/mm/dd)
    hour: int = None # 시
    min: int = None # 분
    time_datetime: datetime = None  # datetime 형식 시간
    detail_casting_acting_info_list: List[DetailCastingActingInfo] = field(default_factory=list)



@dataclass
class StatisticsInfo:
    """
    성별/나이별 예매율
    """
    male: float = 0  # 남성 예매율
    female: float = 0  # 여성 예매율
    teen: float = 0  # 10대 예매율
    twenty: float = 0  # 20대 예매율
    thirty: float = 0  # 30대 예매율
    forty: float = 0  # 40대 예매율
    fifty: float = 0  # 50대 예매율


@dataclass
class CastingInfo:
    """
    캐스팅 정보
    """
    character: str = None  # 캐스팅 배우
    actor: str = None # 캐스팅 극중 이름
    info_url: str  = None # 캐스팅 정보 URL
    img_url: str = None # 캐스팅 사진 URL


@dataclass
class RankInfo:
    """
    랭킹 정보
    """
    category: Optional[str] = None
    category_url: Optional[str] = None
    category_type: Optional[str] = None
    url: Optional[str] = None
    table_name: Optional[str] = None
    code_list: List[str] = field(default_factory=list)


@dataclass
class ProductInfo:
    """
    상품 정보
    """
    # category: Literal["MUSICAL", "DRAMA", "CLASSIC", "EXHIBITION"]  # 카테고리
    category: str = None  # 카테고리
    # category_url: str = None  # 인터파크 카테고리 URL
    url: str = None  # 인터파크 URL ({인터파크 호스트 + / + code}로 구성)
    title: str = None  # 상품 제목
    thumbnail_url: str = None  # 썸네일 URL
    location: str = None  # 일반 장소
    detail_location: str = None  # 상세 장소
    period_start: str = None  # 공연기간: 시작
    period_end: str = None  # 공연기간: 끝
    age_kor: bool = None  # 관람연령 만나이 여부
    age_type: str = None
    age_num: int = None  # 관렴연령
    limited_always: str = None # 한정/상시 여부
    is_casting: bool = None
    is_detail_casting: bool = None  # 상세 시간별 캐스팅 정보
    is_seat_price_info: bool = False
    code: str = None # 고유 코드
    # is_navi_casting_tab: bool = False  # 네비탭에 캐스팅 정보
    desc_poster_url: str = None  # 상세 포스터 URL
    casting_poster_url: str = None  # 캐스팅 포스터 URL
    perf_time: int = -1  # 공연시간
    intermission: int = 0  # 인터미션
    # url_list: List[str] = field(default_factory=list)
    statistics_info: StatisticsInfo = field(default_factory=StatisticsInfo)  # 예매율 정보 List
    casting_info_list: List[CastingInfo] = field(default_factory=list)  # 캐스팅 List
    seat_price_info_list: List[SeatPriceInfo] = field(default_factory=list)
    detail_casting_time_info_list: List[DetailCastingTimeInfo] = field(default_factory=list)  # 상세 캐스팅/시간 List
    detail_casting_char_only_info_list: List[DetailCastingCharOnlyInfo] = field(default_factory=list)



@dataclass
class ProductInfoList(list):
    # product_info_list: List[ProductInfo] = field(default_factory=list)

    def append(self, product_record):
        if not isinstance(product_record, ProductInfo):
            raise TypeError(Constants_Rank.error_msg_typeerror)
        super().append(product_record)

    def __repr__(self):
        return f"ProductInfoList({super().__repr__()})"


if __name__ == '__main__':
    def update_product_info(product_info: ProductInfo, category: Category) -> None:
        product_info.category = category.name
        product_info.category_url = BaseURL.base_url + category.url_suffix


    product_info = ProductInfo
    update_product_info(product_info, Category.MUSICAL)

    print(product_info.category)
    print(product_info.category_url)
