from Debug import debugCreateUrlOfInterpark
from crawling.Page import crawlingInterparkPage
from crawling.Page_Calendar_Info import extractCalendarInfo
from crawling.Page_Compact_Info import extractCompactInfo
from crawling.RankUrl import crawlingRankingUrlList


if __name__ == '__main__':
    urlList = debugCreateUrlOfInterpark()
    # createEngine()

    # crawlingRankingUrlList()

    # crawlingMainBanner()

    for url in urlList:
        crawlingInterparkPage(url)
