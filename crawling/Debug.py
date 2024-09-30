from Page import crawlingInterparkPage


def debugCreateUrlOfInterpark():
    urlList = []

    urlList.append(22012631)  # 뮤지컬 - 랭보
    urlList.append(22009226)  # 뮤지컬 - 마틸다
    urlList.append(22014702)  # 연극 - 진짜나쁜소녀
    urlList.append(22013518)  # 연극 - 맥베스 레퀴엠
    urlList.append(22014652)  # 클래식 - 스트라스부르 필하모닉 오케스트라 내한공연
    urlList.append(22015789)  # 클래식 - 디즈니 OST 콘서트：디 오케스트라
    urlList.append(22005831)  # 전시 - 에바 알머슨 특별전：Andando
    urlList.append(22009615)  # 전시 - 모네 인사이드
    urlList.append(19018229)
    urlList.append(22012184)
    urlList.append(22009029)
    urlList.append(22010521)  # 뮤지컬 : 이머시브 다이닝 (가격 Span 정렬)

    return urlList


def debugPage():
    crawlingInterparkPage(24012950, 'MUSICAL')
    # for x in [1, 2, 3, 4, 5, '', 6, 7, 8, 9, 10]:
    #     if x == '':
    #         continue
    #     else:
    #         print(x)


if __name__ == '__main__':
    debugPage()
