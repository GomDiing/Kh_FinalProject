package com.kh.finalproject.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration // 스프링 컨테이너에 빈 등록
public class SpringMvcViewConfig extends WebMvcConfigurerAdapter {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        //super.addViewControllers(registry);   // 기존의 view 아키텍처 사용 안함
        registry.addViewController( "/{spring:\\w+}").setViewName("forward:/");
        registry.addViewController( "/**/{spring:\\w+}").setViewName("forward:/");
        // spring 2.6 이상 [ 해당 패턴 경로 못찾음.. ]
        // 해결 방안 : 어플리케이션.프로퍼티스 파일에
        //spring.mvc.pathmatch.matching-strategy = ant_path_matcher 추가한다
        registry.addViewController( "/{spring:\\w+}/**{spring:?!(\\.js|\\.css|\\.png|\\.jpg)$}").setViewName("forward:/");
    }
}