package com.rainbowforest.productcatalogservice.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * WebConfig - Static Resources Configuration
 * Maps URL /uploads/** to the physical uploads/ directory on disk
 * (located outside src, at the same level as pom.xml)
 *
 * Example: http://localhost:8810/uploads/banners/abc.jpg
 *          maps to: product-catalog-service/uploads/banners/abc.jpg
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        Path uploadDir = Paths.get("uploads");
        String uploadPath = uploadDir.toFile().getAbsolutePath();

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + uploadPath + "/");
    }
}
