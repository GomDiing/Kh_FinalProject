from crawling.Page import crawlingInterparkPage
from crawling.RankUrl import crawlingRankingMainDetail, crawlingRankingMain, browseRankingFromDB

if __name__ == '__main__':

    # 크롬 브라우저 옵션 설정 및 실행 메서드
    while True:
        crawlingRankingMain()

        rankingDataList = browseRankingFromDB()
        for rankingDataRecord in rankingDataList:
            crawlingInterparkPage(rankingDataRecord['product_code'], rankingDataRecord['product_category'])
        break
