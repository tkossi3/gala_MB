package com.baobab.gala.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Autorise le frontend React lancé en développement (Vite, port 5173) à appeler
 * l'API sur le port 8080, cookies compris (nécessaires pour l'anti-doublon).
 * En production, frontend et backend sont servis depuis la même origine :
 * cette configuration n'a alors aucun effet indésirable.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "OPTIONS")
                .allowCredentials(true);
    }
}
