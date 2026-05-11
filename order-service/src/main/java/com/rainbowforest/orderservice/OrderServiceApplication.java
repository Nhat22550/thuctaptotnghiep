package com.rainbowforest.orderservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.session.data.redis.config.annotation.web.http.EnableRedisHttpSession;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@EnableJpaRepositories
@EnableFeignClients
// @EnableWebSecurity
@EnableRedisHttpSession
@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
public class OrderServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(OrderServiceApplication.class, args);
    }
}
