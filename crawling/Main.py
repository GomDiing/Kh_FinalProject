from Debug import debugCreateUrlOfInterpark
from crawling.Common import browseRankingUrlList
from crawling.Page import crawlingInterparkPage
# from crawling.Page import crawlingInterparkPage
from crawling.Page_Calendar_Info import extractCalendarInfo
from crawling.Page_Compact_Info import extractCompactInfo
from crawling.RankUrl import crawlingRankingMainDetail, crawlingRankingMain

if __name__ == '__main__':
    # crawlingRankingMain()
    # url_list = crawlingRankingMainDetail()
    # createEngine()

    # crawlingRankingUrlList()
    # urlList = browseRankingUrlList()

    # crawlingMainBanner()
    urlList = debugCreateUrlOfInterpark()
    #
    for url in urlList:
        crawlingInterparkPage(url)
