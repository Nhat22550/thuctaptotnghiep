package com.rainbowforest.userservice.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseFixRunner implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) throws Exception {
        try {
            jdbcTemplate.execute("ALTER TABLE users ALTER COLUMN user_password TYPE VARCHAR(255)");
            System.out.println("✅ Đã sửa lỗi độ dài cột user_password thành 255");
        } catch (Exception e) {
            System.out.println("⚠️ Không thể tự động alter table users: " + e.getMessage());
        }
        
        try {
            jdbcTemplate.execute("ALTER TABLE users_details ALTER COLUMN first_name DROP NOT NULL");
            jdbcTemplate.execute("ALTER TABLE users_details ALTER COLUMN last_name DROP NOT NULL");
            System.out.println("✅ Đã sửa lỗi cột first_name, last_name cho phép NULL");
        } catch (Exception e) {
            System.out.println("⚠️ Không thể tự động alter table users_details: " + e.getMessage());
        }
    }
}
