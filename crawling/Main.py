from Debug import debugCreateUrlOfInterpark
from crawling.Common import browseRankingUrlList, initChromBrowser
from crawling.Page import crawlingInterparkPage
# from crawling.Page import crawlingInterparkPage
from crawling.Page_Calendar_Info import extractCalendarInfo
from crawling.Page_Compact_Info import extractCompactInfo
from crawling.RankUrl import crawlingRankingMainDetail, crawlingRankingMain, browseRankingFromDB

if __name__ == '__main__':
    # 크롬 브라우저 옵션 설정 및 실행 메서드

    while True:
        crawlingRankingMain()

        rankingDataList = browseRankingFromDB()
        for rankingDataRecord in rankingDataList:
            crawlingInterparkPage(rankingDataRecord['product_code'], rankingDataRecord['product_category'])
        break

    # crawlingInterparkPage('22012060', 'EXHIBITION')

    # for rankingDataRecord in rankingDataList['product_url_list']:
    #     product_category = rankingDataList['product_category']
    #     crawlingInterparkPage(rankingDataRecord, product_category)

    # crawlingInterparkPage(20011346, 'DRAMA')


    # url_list = crawlingRankingMainDetail()
    # createEngine()

    # crawlingRankingUrlList()
    # urlList = browseRankingUrlList()

    # crawlingMainBanner()
    # urlList = debugCreateUrlOfInterpark()
    #
    # for url in urlList:
    #     crawlingInterparkPage(url)
