# FinalProject

<p align="center">
<img src="./md_attachment/TCat.jpg" width="50%" height="50%">
</p>  

<div align="center">

[![Hits](https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fgithub.com%2FGomDiing%2FKh_FinalProject&count_bg=%2379C83D&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=hits&edge_flat=false)](https://hits.seeyoufarm.com)

</div>


## 01. TCat
> 학원 파이널 프로젝트
>
> 개발 기간 : 2022.11 ~ 2023.01

<br>

### 배포 주소
> http://www.tcats.site

<br>

### 개발팀 소개
|                              백엔드                               |                             백엔드                              |                           프론트엔드                            |                             프론트엔드                              |                             프론트엔드                              |
|:--------------------------------------------------------------:|:------------------------------------------------------------:|:----------------------------------------------------------:|:--------------------------------------------------------------:|:--------------------------------------------------------------:|
| <img src="./md_attachment/profile_GomDiing.jpeg" width="120"/> | <img src="./md_attachment/profile_hjm8727.png" width="120"/> | <img src="./md_attachment/profile_hrhr7.png" width="120"/> | <img src="./md_attachment/profile_jimin0601.png" width="120"/> | <img src="./md_attachment/profile_Ryel1580.jpeg" width="120"/> |
|            [GomDiing](https://github.com/GomDiing)             |            [hjm8727](https://github.com/hjm8727)             |             [hrhr7](https://github.com/hrhr7)              |           [jimin0601](https://github.com/jimin0601)            |            [Ryel1580](https://github.com/Ryel1580)             |  

<br>

### 프로젝트 소개

다양한 카테고리에 나와있는 상품에 대한 포스터 등 정보 제공과 간편 결제를 활용한 예매 시스템 기능을 지원하는 [인터파크](https://www.interpark.com/)에서 아이디어를 착안했습니다.

프론트엔드는 React, 백엔드는 Spring, 크롤링은 Python, 간편 결제 기능은 카카오페이, 소셜로그인은 구글과 카카오를 사용했습니다.

<br>

## 02. 시작 가이드

> [!CAUTION]
> 보안 문제로 Backend & Frontend & Python 설정 파일을 업로드하지 않았습니다.  
> 제대로 작동하지 않으니 [배포 주소](#배포-주소)로 접속해주세요.

<br>

### 요구 Library

---

#### Spring
다음 Library를 요구합니다.
>- Spring Web
>- Spring Data JPA
>- Validation
>- Lombok
>- MySQL Driver
                                
<br>

#### React
해당 프로젝트의 React는 다음 Library를 요구합니다.
>- antd
>- axios
>- bootstrap
>- firebase
>- moment
>- react
>- react-bootstrap
>- react-calendar
>- react-daum-postcode
>- react-dom
>- react-horizontal-scrolling
>- react-icons
>- react-redux
>- react-router-dom
>- react-scripts
>- react-uuid
>- recharts
>- redux-persist
>- styled-component
>- styled-components
>- web-vitals

<br>

### 설치

---

```
$ git clone https://github.com/GomDiing/Kh_FinalProject.git  
$ cd Kh_FinalProject
```

#### Backend
```
$ ./gradlew build
$ cd build/libs
$ java -jar demo-0.0.1-SNAPSHOT.jar
```

#### Frontend
```
$ cd src/main/frontend
$ npm install
$ yarn start
```

#### Python
````
$ cd crawling
$ pip3 install requirements.txt 
$ python main.py
````

<br>

## 03. 기술 스택
<h3 align="left"> Tools </h3>
<div align="left">
<img src="https://img.shields.io/badge/DBeaver-382923?style=for-the-badge&logo=DBeaver&logoColor=white" />&nbsp
<img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=GitHub&logoColor=white" />&nbsp
<img src="https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=Notion&logoColor=white" />&nbsp
<img src="https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=Postman&logoColor=white" />&nbsp
<img src="https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white"/>&nbsp
<img src="https://img.shields.io/badge/Intellij IDEA-000000?style=for-the-badge&logo=Intellij IDEA&logoColor=white" />&nbsp
</div>

<h3 align="left"> Frontend </h3>
<div align="left">
<img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=white" />&nbsp
<img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=HTML5&logoColor=white" />&nbsp
<img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=CSS3&logoColor=white" />&nbsp
<img src="https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=Bootstrap&logoColor=white" />&nbsp
<img src="https://img.shields.io/badge/Ant Design-0170FE?style=for-the-badge&logo=Ant Design&logoColor=white" />&nbsp
</div>

<h3 align="left"> Backend </h3>
<div align="left">
<img src="https://img.shields.io/badge/Java-000000?style=for-the-badge&logo=OpenJDK&logoColor=white" />&nbsp
<img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=Python&logoColor=white" />&nbsp
<img src="https://img.shields.io/badge/Spring Boot-6DB33F?style=for-the-badge&logo=Spring Boot&logoColor=white" />&nbsp
<img src="https://img.shields.io/badge/Spring Data JPA-6DB33F?style=for-the-badge&logoColor=white" />&nbsp
<img src="https://img.shields.io/badge/SQLAlchemy-D71F00?style=for-the-badge&logo=SqlAlchemy&logoColor=white" />&nbsp
<img src="https://img.shields.io/badge/Selenium-43B02A?style=for-the-badge&logo=Flask&logoColor=white" />&nbsp
</div>

<h3 align="left"> Deploy </h3>
<div align="left">
<img src="https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=Amazon Web Services&logoColor=white" />&nbsp
<img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=MariaDB&logoColor=white" />&nbsp
</div>

<br>

## 04. 화면 구성
|                            로그인 페이지 (일반)                             |                               로그인 페이지 (소셜)                               |
|:-------------------------------------------------------------------:|:------------------------------------------------------------------------:|
|   <img src="./md_attachment/page_normal-login.png" width="300px">   |     <img src="./md_attachment/page_social-login.png" width="300px">      |
|                             아이디/비밀번호 찾기                             |                                  회원 가입                                   |
|    <img src="./md_attachment/page_find-idpw.png" width="300px">     |        <img src="./md_attachment/page_signup.png" width="300px">         |
|                               마이 페이지                                |                            마이 페이지 - 예매/취소 내역                             |
|      <img src="./md_attachment/page_mypage.png" width="300px">      | <img src="./md_attachment/page_mypage-reserve_refund.png" width="300px"> |
|                          마이 페이지 - QnA 문의하기                          |                             마이 페이지 - 회원정보수정                              |
|    <img src="./md_attachment/page_mypage-qna.png" width="300px">    |  <img src="./md_attachment/page_mypage-modifyInform.png" width="300px">  |
|                            마이 페이지 - 찜목록                             |                                 검색 - 작품명                                 |
|   <img src="./md_attachment/page_mypage-wishi.png" width="300px">   |      <img src="./md_attachment/page_search-item.png" width="300px">      |
|                           마이 페이지 - 카테고리별                            |                                 상세페이지 1                                  |
| <img src="./md_attachment/page_searchByCategory.png" width="300px"> |        <img src="./md_attachment/page_detail.png" width="300px">         |
|                               상세페이지 2                               |                                  리뷰 작성                                   |
|     <img src="./md_attachment/page_detail2.png" width="300px">      |     <img src="./md_attachment/page_review-write.png" width="300px">      |
|                                댓글 작성                                |                                   예매하기                                   |
|  <img src="./md_attachment/page_review-comment.png" width="300px">  |        <img src="./md_attachment/page_reserve.png" width="300px">        |
|                                결제하기                                 |                                   예매취소                                   |
|       <img src="./md_attachment/page_pay.png" width="300px">        |    <img src="./md_attachment/page_cancel-reserve.png" width="300px">     |

<br>                                         

## 05. API 문서 주소

> [!NOTE]
> API 문서는 [해당 링크](https://telling-list-c32.notion.site/API-14302fd0ff7c44709f3a5dac9ef18849?pvs=4)에서 자세히 보실 수 있습니다.

|API 목차|API 상세|
|:---:|:---:|
|<img src="./md_attachment/page_api-toc.png" width="210"/>|<img src="./md_attachment/page_api-detail.png" width="210"/>|
|API 요구사항|
|<img src="./md_attachment/page_api-require.png" width="210"/>|

<br>

## 06. 주요 기능
1. 인기 공연 정보 제공
   - 주간 / 일간 두 분류로 구분
2. 일반 로그인 뿐만 아니라 소셜 로그인 기능도 제공
   - 사용한 로그인 API는 카카오, 구글
3. 간편 결제 시스템 도입
   - 개발버전으로 카카오페이 API 사용
4. 웹 정보 파싱
   - Selenium 사용하여 웹 정보 파싱

<br>

## 07. 아키텍쳐
<div align="center">
<img src="./md_attachment/architecture.png" width="480">
</div>

```
.
├── crawling            //Python Selenium 크롤링 소스코드
├── md_attachment       //README 첨부파일
└── src                 //Spring-React 소스코드
    └── main
        ├── frontend          //React 소스코드
        │   ├── public           //Image 파일
        │   │   └── images
        │   └── src
        │       ├── api             //API 모음
        │       ├── components         //컴포넌트 모음
        │       │   ├── KakaoPay       //카카오페이
        │       │   └── views          //View 모음
        │       │       ├── AdminPage                 //관리자 페이지
        │       │       │   ├── Dashboard                //대시보드
        │       │       │   │   ├── chart
        │       │       │   │   ├── featuredInfo
        │       │       │   │   ├── profile
        │       │       │   │   └── recentComment
        │       │       │   ├── Inquiry                  //문의
        │       │       │   ├── Notice                   //공지사항
        │       │       │   └── Tool                     //Firebase, 상단바
        │       │       ├── Cards                     //찜목록, 배우 페이지
        │       │       ├── DetailPage                //상세 페이지
        │       │       │   └── Section
        │       │       │       ├── Body
        │       │       │       ├── Popup
        │       │       │       ├── Side
        │       │       │       └── Summary
        │       │       ├── Footer                    //Footer
        │       │       ├── LoginPage                 //로그인
        │       │       ├── MainHeader                //메인헤더(검색)
        │       │       │   └── Search
        │       │       ├── MainPage                  //메인화면 페이지
        │       │       │   └── Content
        │       │       │       ├── MainBanner        //메인 배너
        │       │       │       ├── MainIcon
        │       │       │       │   └── IconModal
        │       │       │       │       └── ModalBody    //예매 모달
        │       │       │       ├── MainNotice        //메인 공지사항
        │       │       │       ├── MainPoster        //메인 포스터
        │       │       │       ├── MainRankingArea   //주간/월간 랭킹
        │       │       │       └── MainReview        //메인 후기
        │       │       ├── MyPage                    //마이페이지
        │       │       │   └── section
        │       │       │       └── Iquiry               //문의
        │       │       └── SignPage                  //회원가입 페이지
        │       ├── images
        │       └── util
        │           ├── Modal
        │           └── Redux
        └── java/com/kh/finalproject      //Spring 소스코드
               ├── common                    //BaseEntity
               ├── config                    //WebConfig
               ├── controller                //Controller 모음
               ├── dto                       //DTO 모음
               │   ├── accuse                   //신고
               │   ├── casting                  //캐스팅(배우)
               │   ├── chart                    //차트
               │   ├── member                   //회원
               │   ├── notice                   //공지
               │   ├── product                  //상품
               │   ├── qna                      //질문
               │   ├── ranking                  //인기순위(랭킹)
               │   ├── reserve                  //예매
               │   ├── reserveTimeSeatPrice     //예매시간별 좌석/가격
               │   ├── reservetime              //예매시간
               │   ├── reviewComment            //후기 댓글
               │   ├── reviewLike               //후기 좋아요
               │   ├── seatPrice                //좌석 가격
               │   ├── statistics               //분석
               │   └── wishProduct              //찜목록
               ├── entity                    //Entity 모음
               │   └── enumurate
               ├── exception                 //예외
               ├── repository                //Repository 모음
               ├── response                  //응답(Frontend) 모음
               ├── service                   //Service 모음
               │   └── impl                     //Service 구현체
               └── social                    //소셜 관련
                  ├── google                    //구글
                  └── kakao                     //카카오
                     ├── login                     //카카오 로그인
                     └── pay                       //카카오페이

```

<br>

## 08. 개발 문서

### ER 다이어그램
<div align="center">
<img src="./md_attachment/er_diagram.png" width="360"/>
</div>

### 클래스 다이어그램
<div align="center">
<img src="./md_attachment/class_diagram.png" width="360"/>
</div>


## 기타
### IntelliJ 설정
   1. `Preference` 설정
        - Annotation Processor 활성화 (롬북 활성화)
   
           - `annotation processor` 검색 후 체크박스 활성화
<br>

      -  File Encoding 변경
            - `file encoding` 검색 후 <br>`Default encoding for properties files` 변경
<br>

      - Gradle 환경 변경 (IntelliJ가 더 빠르다)
          - `Build and run using`, `Run tests using`을<br>`Gradle` -> `IntelliJ IDEA`로 변경<br><br>
<br>
   2. `gitignore` 설정
   
      - 아래 문구 추가 (설정 파일 제외 (*.properties, *.yml))
      
         `**/src/main/resources/*.properties`
         `**/src/main/resources/*.yml`

<br>

### SpringBootStarter 설정

---

1. [스프링 부트 스타터 홈페이지 이동](https://start.spring.io/)
2. 아래와 같이 설정
<img width="1251" alt="khfinal_springbootstarter_option" src="https://user-images.githubusercontent.com/49019419/204407730-9b6126f9-320b-4aa2-a43c-616410b674e4.png">

```html
Project: Gradle-Groovy

Language: Java

Spring Boot: 2.7.6 (없다면 2.x.x 버전 중 선택)

Project Metadata
    Group: com.kh
    Artifact: final-project
    Name: final-project
    Description: Spring Boot for Kh Final Project
    Package name: com.kh.final-project
    Packaging: Jar
    Java: 11

Dependencies:
    Spring Web
    Spring Data JPA
    Thymeleaf
    Validation
    Lombok
    MySQL Driver
    H2 Database
```