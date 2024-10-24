from Page import parsing_interpark_page
from RankUrl import make_category_type_url, bring_all_codes_from_db

if __name__ == '__main__':

    # 크롬 브라우저 옵션 설정 및 실행 메서드
    while True:
        make_category_type_url()

        product_info_list = bring_all_codes_from_db()
        for product_info in product_info_list:
            parsing_interpark_page(product_info)
        break
