package com.kh.finalproject.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;

/**
 * Spring MVC 웹 애플리케이션 뷰 관련 설정 담당 구성 클래스
 * SPA 라우팅 설정, CORS 설정, 정적 리소스 처리 위한 핸들러 설정 포함
 *
 * @author Gomdiing
 */
@Configuration
public class SpringMvcViewConfig implements WebMvcConfigurer {


    /**
     * SPA 라우팅 위한 뷰 컨트롤러 설정
     * 모든 클라이언트 사이드 라우팅을 index.html로 포워딩,
     * React 프론트엔드 라우터가 처리
     * 단, "/api" 제외
     *
     * @author Gomdiing
     * @param registry ViewControllerRegistry 인스턴스
     */
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Single page application 루트
        registry.addViewController("/").setViewName("forward:/index.html");

        // 알파벳, 숫자, 대시(-)로 시작하는 모든 경로를 index.html로 포워딩
        registry.addViewController("/{x:[\\w\\-]+}")
                .setViewName("forward:/index.html");
        registry.addViewController("/**/{x:[\\w\\-]+}")
                .setViewName("forward:/index.html");
        registry.addViewController("/{x:^(?!api$).*$}/**/{y:[\\w\\-]+}")
                .setViewName("forward:/index.html");
    }

    /**
     * 정적 리소스 처리 핸들러 설정
     * HTML/CSS, 이미지파일 등 정적 리소스 요청을
     * classpath의 static 디렉토리에서 처리하도록 매핑
     *
     * @param registry ResourceHandlerRegistry 인스턴스
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**/*.css", "/**/*.html", "/**/*.js", "/**/*.jsx", "/**/*.png", "/**/*.jpg", "/**/*.gif", "/**/*.svg", "/**/*.ico")
                .addResourceLocations("classpath:/static/");
    }

    /**
     * CORS 정책 설정
     * 허용할 특정 외부 도메인, HTTP 메서드, 헤더 등을 설정
     *
     * @param registry CORS 설정을 위한 CorsRegistry 객체
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000", "https://firebasestorage.googleapis.com", "https://open-api.kakaopay.com",
                        "https://tcats.site", "https://dapi.kakao.com")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600); // 1시간
    }
}
