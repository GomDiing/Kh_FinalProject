# from Page import crawlingInterparkPage
import Constants_Rank
from Common import commit_category_rank_url
from DataClass import ProductInfo, RankInfo, Category, CategoryType
from Page import parsing_interpark_page

def debugPage_list():
    product_info_list = []
    for i in range(1, 10):
        product_info = ProductInfo(code='24014440', category='EXHIBITION')
        product_info_list.append(product_info)
    for product_info in product_info_list:
        parsing_interpark_page(product_info)

def debugPa():
    test_list = []
    test_list.append()
    rank_info = RankInfo(Category.EXHIBITION.name, Constants_Rank.base_rank_url + Category.EXHIBITION.url_suffix,
                         CategoryType.WEEK.name, Constants_Rank.base_rank_url + Category.EXHIBITION.url_suffix + CategoryType.WEEK.url_suffix,
                         CategoryType.WEEK.table_name, )
    commit_category_rank_url()


# MUSICAL / DRAMA / CLASSIC / EXHIBITION
def debugPage():
    # 전체관람가
    # product_info = ProductInfo(code='24011867', category='EXHIBITION')
    # 초등학생이상 관람가
    # product_info = ProductInfo(code='24013389', category='CLASSIC')


    # 8세이상 관람가능
    # product_info = ProductInfo(code='24007345', category='MUSICAL')
    # 만 19세이상
    # product_info = ProductInfo(code='24000638', category='MUSICAL')
    # 14세 이상 관람가
    # product_info = ProductInfo(code='24009007', category='MUSICAL')
    # 미취아동입장불가
    # product_info = ProductInfo(code='24011167', category='MUSICAL')
    # $입장권$
    # product_info = ProductInfo(code='24014922', category='EXHIBITION')
    # product_info = ProductInfo(code='24014137', category='EXHIBITION')
    # product_info = ProductInfo(code='24013437', category='CONCERT')
    # product_info = ProductInfo(code='24013165', category='EXHIBITION')
    # product_info = ProductInfo(code='24014550', category='MUSICAL')
    # product_info = ProductInfo(code='24013473', category='MUSICAL')

    # product_info = ProductInfo(code='24013473', category='MUSICAL')
    # product_info = ProductInfo(code='24014618', category='MUSICAL')

    # 제목 : 뮤지컬 지킬 앤 하이드
    # 14세 이상 관람가
    # 한정상품, 일반 캐스팅정보, 캐스팅정보탭 존재
    # product_info = ProductInfo(code='24013928', category='MUSICAL')

    # 제목 : 위창 오세창 : 간송 컬렉션의 감식과 근역화휘
    # 전체관람가
    # 한정상품, 캘린더탭 내 회차정보 존재
    # product_info = ProductInfo(code='24014358', category='EXHIBITION')

    # 영국 국립자연사박물관 특별전 - 부산
    # 전체관람가
    # 상시상품
    # product_info = ProductInfo(code='24013064', category='EXHIBITION')
    # product_info = ProductInfo(code='24014922', category='EXHIBITION')
    # product_info = ProductInfo(code='24014440', category='EXHIBITION')
    # product_info = ProductInfo(code='24014835', category='EXHIBITION')
    product_info = ProductInfo(code='24011666', category='MUSICAL')

    parsing_interpark_page(product_info)


if __name__ == '__main__':
    debugPage()
    # debugPage_list()
