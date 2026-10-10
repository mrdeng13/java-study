package com.tutorial.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        // 个人学习后端，放行为 *；写操作另有 app.passcode 守门。
                // 允许：GitHub Pages 线上源、本地 vite 预览、本地后端同机开发。
                        .allowedOriginPatterns("*")
                        .allowedMethods("GET", "POST", "OPTIONS")
                        .allowCredentials(false);
            }
        };
    }
}
