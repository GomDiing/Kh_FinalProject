package com.kh.finalproject.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
//@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {
//public class WebConfig {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:3000", "https://firebasestorage.googleapis.com", "https://open-api.kakaopay.com")
                .allowedMethods("OPTIONS", "GET", "POST", "PUT", "DELETE")
                .allowCredentials(true);
    }
}


//                .allowedOrigins("http://localhost:3000")
//                .allowedOrigins("http://localhost:8100")
//                .allowedOrigins("http://www.tcats.tk:8100")
//                .allowedOrigins("http://3.36.188.106:8100")
//                .allowedOrigins("http://cokebear756.synology.me:33060")
