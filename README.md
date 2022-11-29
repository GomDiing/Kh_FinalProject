# KH Final Project - Backend

---

## 적용 기술 스택
- <span style="color:green;font-size:15pt;font-weight:600">Spring Framework</span>
  - <span style="color:green;font-size:15pt">Spring Boot<span>
  - <span style="color:green;font-size:15pt">Spring Data JPA<span>
  - <span style="color:green;font-size:15pt">Spring Security(예정)<span>
- <span style="color:Orange;font-size:15pt;font-weight:600">Python</span>
  - <span style="color:Orange;font-size:15pt">Crawling with Selenium</span>
  - <span style="color:Orange;font-size:15pt">FlaskAPI(예정)</span>
  - <span style="color:Orange;font-size:15pt">SqlAlchemy(예정)</span>

---

## 초기 설정

### 설치

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

3. 다운받아 압축파일 해제한 후 `IntelliJ`로 해당 프로젝트 열기

### 프로젝트 설정

---

> 아래 설명은 모두 `macOS`를 기준으로 설명했습니다.

1. `Preferences` 기준 <br><br>

   1. Annotation Processor 활성화 (롬북 활성화)
      ![khfinal_intellij_preferences](https://user-images.githubusercontent.com/49019419/204409241-634a378b-e41c-4bb3-8b7f-d1e995c12a9d.png)
      `Preferences`에서 `annotation processor` 검색 후 체크박스 활성화<br><br>
      
   2. File Encoding 변경 (*.properties 인코딩)
      ![khfinal-2_intellij_preferences](https://user-images.githubusercontent.com/49019419/204409311-c90fa838-4a0a-47d1-9897-34123cb13214.png)
        `Preferences`에서 `file encoding` 검색 후 <br>`Default encoding for properties files` 변경<br><br>

   3. Gradle 환경 변경 (IntelliJ가 더 빠르다)
      ![khfinal-3_intellij_preferences](https://user-images.githubusercontent.com/49019419/204409373-0d719233-7a71-45d4-9991-f18272d2670f.png)
        `Preferences`에서 `Build and run using`, `Run tests using`을<br>`Gradle` -> `IntelliJ IDEA`로 변경<br><br>
   

2. `gitignore` 설정
   1. 아래 문구 추가 (설정 파일 제외 (*.properties, *.yml))
      `**/src/main/resources/*.properties`<br>
      `**/src/main/resources/*.yml`