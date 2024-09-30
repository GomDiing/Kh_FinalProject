/*
package com.kh.finalproject.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

//@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin("http://localhost:3000");
        config.addAllowedOrigin("http://tcats.tk");
        config.addAllowedMethod("http://localhost:8100");
//        config.addAllowedOrigin("http://3.36.188.106");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        config.setMaxAge(3600L);
        config.addExposedHeader("Authorization");
        config.addExposedHeader("MemberEmail");
        config.addExposedHeader("MemberName");
        config.addExposedHeader("ProviderType");
        config.addExposedHeader("IsJoined");
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}
*/
